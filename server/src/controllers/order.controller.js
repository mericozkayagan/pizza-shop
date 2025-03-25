const db = require("../db");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, t.number as table_number
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      ORDER BY o.created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Error getting orders" });
  }
};

// Get active orders (pending, preparing, ready)
exports.getActiveOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, t.number as table_number
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      WHERE o.status IN ('pending', 'preparing', 'ready')
      ORDER BY o.created_at
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting active orders:", error);
    res.status(500).json({ message: "Error getting active orders" });
  }
};

// Get orders by table
exports.getOrdersByTable = async (req, res) => {
  const { tableId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT o.*
      FROM orders o
      WHERE o.table_id = $1
      ORDER BY o.created_at DESC
    `,
      [tableId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting orders by table:", error);
    res.status(500).json({ message: "Error getting orders by table" });
  }
};

// Get active order by table
exports.getActiveOrderByTable = async (req, res) => {
  const { tableId } = req.params;

  try {
    // Find most recent order for table that is not paid or cancelled
    const orderResult = await db.query(
      `
      SELECT o.*
      FROM orders o
      WHERE o.table_id = $1 AND o.status NOT IN ('paid', 'cancelled')
      ORDER BY o.created_at DESC
      LIMIT 1
    `,
      [tableId]
    );

    if (orderResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No active order found for this table" });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(
      `
      SELECT oi.*, mi.name, mi.price, mi.description, mi.image_url
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `,
      [order.id]
    );

    // Return order with items
    res.status(200).json({
      ...order,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error getting active order by table:", error);
    res.status(500).json({ message: "Error getting active order by table" });
  }
};

// Get order details by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    // Get order
    const orderResult = await db.query(
      `
      SELECT o.*, t.number as table_number
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      WHERE o.id = $1
    `,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await db.query(
      `
      SELECT oi.*, mi.name, mi.price, mi.description, mi.image_url
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `,
      [id]
    );

    // Return order with items
    res.status(200).json({
      ...order,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ message: "Error getting order details" });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const { table_id, items, notes } = req.body;

  // Start transaction
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // Check if table exists
    const tableCheck = await client.query(
      "SELECT * FROM tables WHERE id = $1",
      [table_id]
    );

    if (tableCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Table not found" });
    }

    // Create order
    const orderResult = await client.query(
      "INSERT INTO orders (table_id, notes) VALUES ($1, $2) RETURNING *",
      [table_id, notes]
    );

    const orderId = orderResult.rows[0].id;

    // Create order items
    const orderItems = [];

    for (const item of items) {
      // Check if menu item exists
      const menuItemCheck = await client.query(
        "SELECT * FROM menu_items WHERE id = $1",
        [item.menu_item_id]
      );

      if (menuItemCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({
            message: `Menu item with ID ${item.menu_item_id} not found`,
          });
      }

      // Create order item
      const orderItemResult = await client.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, notes) VALUES ($1, $2, $3, $4) RETURNING *",
        [orderId, item.menu_item_id, item.quantity, item.notes]
      );

      orderItems.push(orderItemResult.rows[0]);
    }

    // Update table status to occupied
    await client.query("UPDATE tables SET status = 'occupied' WHERE id = $1", [
      table_id,
    ]);

    await client.query("COMMIT");

    res.status(201).json({
      ...orderResult.rows[0],
      items: orderItems,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  } finally {
    client.release();
  }
};

// Add items to an existing order
exports.addOrderItems = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  // Start transaction
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // Check if order exists and is not paid/cancelled
    const orderCheck = await client.query(
      "SELECT * FROM orders WHERE id = $1 AND status NOT IN ('paid', 'cancelled')",
      [id]
    );

    if (orderCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "Order not found or already completed" });
    }

    // Add new items
    const orderItems = [];

    for (const item of items) {
      // Check if menu item exists
      const menuItemCheck = await client.query(
        "SELECT * FROM menu_items WHERE id = $1",
        [item.menu_item_id]
      );

      if (menuItemCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return res
          .status(404)
          .json({
            message: `Menu item with ID ${item.menu_item_id} not found`,
          });
      }

      // Create order item
      const orderItemResult = await client.query(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, notes) VALUES ($1, $2, $3, $4) RETURNING *",
        [id, item.menu_item_id, item.quantity, item.notes]
      );

      orderItems.push(orderItemResult.rows[0]);
    }

    // Set order back to pending if it was already served
    await client.query(
      "UPDATE orders SET status = 'pending', updated_at = NOW() WHERE id = $1 AND status = 'served'",
      [id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Items added to order successfully",
      items: orderItems,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding items to order:", error);
    res.status(500).json({ message: "Error adding items to order" });
  } finally {
    client.release();
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Check if order exists
    const orderCheck = await db.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate status
    if (
      ![
        "pending",
        "preparing",
        "ready",
        "served",
        "paid",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid status. Must be one of: pending, preparing, ready, served, paid, cancelled",
      });
    }

    // If status is 'paid', check if there's already a payment
    if (status === "paid") {
      const paymentCheck = await db.query(
        "SELECT * FROM payments WHERE order_id = $1 AND status = 'completed'",
        [id]
      );

      if (paymentCheck.rows.length === 0) {
        return res.status(400).json({
          message: "Cannot mark order as paid without a completed payment",
        });
      }
    }

    // If status is 'cancelled', don't allow cancellation of paid orders
    if (status === "cancelled" && orderCheck.rows[0].status === "paid") {
      return res.status(400).json({ message: "Cannot cancel a paid order" });
    }

    // Update order status
    const result = await db.query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );

    // If order is paid or cancelled, update table status to available if there are no other active orders
    if (status === "paid" || status === "cancelled") {
      const tableId = orderCheck.rows[0].table_id;

      // Check if there are other active orders for this table
      const activeOrdersCheck = await db.query(
        "SELECT id FROM orders WHERE table_id = $1 AND id != $2 AND status NOT IN ('paid', 'cancelled')",
        [tableId, id]
      );

      if (activeOrdersCheck.rows.length === 0) {
        await db.query("UPDATE tables SET status = 'available' WHERE id = $1", [
          tableId,
        ]);
      }
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// Update order item status
exports.updateOrderItemStatus = async (req, res) => {
  const { id, itemId } = req.params;
  const { status } = req.body;

  try {
    // Check if order item exists and belongs to the specified order
    const itemCheck = await db.query(
      "SELECT * FROM order_items WHERE id = $1 AND order_id = $2",
      [itemId, id]
    );

    if (itemCheck.rows.length === 0) {
      return res
        .status(404)
        .json({
          message: "Order item not found or does not belong to this order",
        });
    }

    // Validate status
    if (
      !["pending", "preparing", "ready", "served", "cancelled"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid status. Must be one of: pending, preparing, ready, served, cancelled",
      });
    }

    // Update order item status
    const result = await db.query(
      "UPDATE order_items SET status = $1 WHERE id = $2 RETURNING *",
      [status, itemId]
    );

    // If all items are ready, update order status to ready
    if (status === "ready") {
      const pendingItems = await db.query(
        "SELECT id FROM order_items WHERE order_id = $1 AND status NOT IN ('ready', 'served', 'cancelled')",
        [id]
      );

      if (pendingItems.rows.length === 0) {
        await db.query(
          "UPDATE orders SET status = 'ready', updated_at = NOW() WHERE id = $1",
          [id]
        );
      }
    }

    // If all items are served, update order status to served
    if (status === "served") {
      const unservedItems = await db.query(
        "SELECT id FROM order_items WHERE order_id = $1 AND status NOT IN ('served', 'cancelled')",
        [id]
      );

      if (unservedItems.rows.length === 0) {
        await db.query(
          "UPDATE orders SET status = 'served', updated_at = NOW() WHERE id = $1",
          [id]
        );
      }
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating order item status:", error);
    res.status(500).json({ message: "Error updating order item status" });
  }
};

// Process payment for an order
exports.processPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, payment_method, processed_by } = req.body;

  // Start transaction
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    // Check if order exists and is not already paid
    const orderCheck = await client.query(
      "SELECT * FROM orders WHERE id = $1 AND status != 'paid'",
      [id]
    );

    if (orderCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "Order not found or already paid" });
    }

    // Validate payment method
    if (
      !["cash", "credit_card", "debit_card", "online"].includes(payment_method)
    ) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message:
          "Invalid payment method. Must be one of: cash, credit_card, debit_card, online",
      });
    }

    // Create payment record
    const paymentResult = await client.query(
      "INSERT INTO payments (order_id, amount, payment_method, status, processed_by) VALUES ($1, $2, $3, 'completed', $4) RETURNING *",
      [id, amount, payment_method, processed_by]
    );

    // Update order status to paid
    await client.query(
      "UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = $1",
      [id]
    );

    // Check if there are other active orders for this table
    const tableId = orderCheck.rows[0].table_id;
    const activeOrdersCheck = await client.query(
      "SELECT id FROM orders WHERE table_id = $1 AND id != $2 AND status NOT IN ('paid', 'cancelled')",
      [tableId, id]
    );

    // If no other active orders, update table status to available
    if (activeOrdersCheck.rows.length === 0) {
      await client.query(
        "UPDATE tables SET status = 'available' WHERE id = $1",
        [tableId]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "Payment processed successfully",
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Error processing payment" });
  } finally {
    client.release();
  }
};
