const db = require("../db");

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, u.name as server_name
      FROM tables t
      LEFT JOIN users u ON t.server_id = u.id
      ORDER BY t.number
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting tables:", error);
    res.status(500).json({ message: "Error getting tables" });
  }
};

// Get a single table by ID
exports.getTableById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT t.*, u.name as server_name
      FROM tables t
      LEFT JOIN users u ON t.server_id = u.id
      WHERE t.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error getting table:", error);
    res.status(500).json({ message: "Error getting table" });
  }
};

// Create a new table
exports.createTable = async (req, res) => {
  const {
    number,
    capacity,
    x_position,
    y_position,
    status = "available",
    server_id = null,
  } = req.body;

  try {
    // Check if table number already exists
    const tableCheck = await db.query(
      "SELECT * FROM tables WHERE number = $1",
      [number]
    );

    if (tableCheck.rows.length > 0) {
      return res.status(400).json({ message: "Table number already exists" });
    }

    const result = await db.query(
      "INSERT INTO tables (number, capacity, status, x_position, y_position, server_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [number, capacity, status, x_position, y_position, server_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ message: "Error creating table" });
  }
};

// Update a table
exports.updateTable = async (req, res) => {
  const { id } = req.params;
  const { number, capacity, status, x_position, y_position, server_id } =
    req.body;

  try {
    // Check if table exists
    const tableCheck = await db.query("SELECT * FROM tables WHERE id = $1", [
      id,
    ]);

    if (tableCheck.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    // If number is being updated, check if it conflicts with another table
    if (number && number !== tableCheck.rows[0].number) {
      const numberCheck = await db.query(
        "SELECT * FROM tables WHERE number = $1 AND id != $2",
        [number, id]
      );

      if (numberCheck.rows.length > 0) {
        return res.status(400).json({ message: "Table number already exists" });
      }
    }

    const result = await db.query(
      `UPDATE tables
       SET number = COALESCE($1, number),
           capacity = COALESCE($2, capacity),
           status = COALESCE($3, status),
           x_position = COALESCE($4, x_position),
           y_position = COALESCE($5, y_position),
           server_id = $6
       WHERE id = $7
       RETURNING *`,
      [number, capacity, status, x_position, y_position, server_id, id]
    );

    // Fetch the updated table with server name
    const updatedTableResult = await db.query(
      `
      SELECT t.*, u.name as server_name
      FROM tables t
      LEFT JOIN users u ON t.server_id = u.id
      WHERE t.id = $1
    `,
      [id]
    );

    const updatedTable = updatedTableResult.rows[0];

    // Broadcast the table update via WebSocket
    if (global.broadcastTableUpdate) {
      global.broadcastTableUpdate(updatedTable);
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    console.error("Error updating table:", error);
    res.status(500).json({ message: "Error updating table" });
  }
};

// Delete a table
exports.deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if table exists
    const tableCheck = await db.query("SELECT * FROM tables WHERE id = $1", [
      id,
    ]);

    if (tableCheck.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Check if table has any active orders
    const ordersCheck = await db.query(
      `
      SELECT id FROM orders
      WHERE table_id = $1 AND status NOT IN ('paid', 'cancelled')
    `,
      [id]
    );

    if (ordersCheck.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete table with active orders. Please complete or cancel all orders first.",
      });
    }

    await db.query("DELETE FROM tables WHERE id = $1", [id]);

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (error) {
    console.error("Error deleting table:", error);
    res.status(500).json({ message: "Error deleting table" });
  }
};

// Assign server to table
exports.assignServer = async (req, res) => {
  const { id } = req.params;
  const { server_id } = req.body;

  try {
    // Check if table exists
    const tableCheck = await db.query("SELECT * FROM tables WHERE id = $1", [
      id,
    ]);

    if (tableCheck.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    // If server_id is provided, check if user exists and is a server
    if (server_id) {
      const serverCheck = await db.query(
        "SELECT * FROM users WHERE id = $1 AND role IN ('server', 'admin')",
        [server_id]
      );

      if (serverCheck.rows.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid server ID or user is not a server" });
      }
    }

    const result = await db.query(
      "UPDATE tables SET server_id = $1 WHERE id = $2 RETURNING *",
      [server_id, id]
    );

    // Fetch the updated table with server name
    const updatedTableResult = await db.query(
      `
      SELECT t.*, u.name as server_name
      FROM tables t
      LEFT JOIN users u ON t.server_id = u.id
      WHERE t.id = $1
    `,
      [id]
    );

    const updatedTable = updatedTableResult.rows[0];

    // Broadcast the table update via WebSocket
    if (global.broadcastTableUpdate) {
      global.broadcastTableUpdate(updatedTable);
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    console.error("Error assigning server to table:", error);
    res.status(500).json({ message: "Error assigning server to table" });
  }
};

// Update table status
exports.updateTableStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Check if table exists
    const tableCheck = await db.query("SELECT * FROM tables WHERE id = $1", [
      id,
    ]);

    if (tableCheck.rows.length === 0) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Validate status
    if (!["available", "occupied", "reserved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be available, occupied, or reserved",
      });
    }

    const result = await db.query(
      "UPDATE tables SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    // Fetch the updated table with server name
    const updatedTableResult = await db.query(
      `
      SELECT t.*, u.name as server_name
      FROM tables t
      LEFT JOIN users u ON t.server_id = u.id
      WHERE t.id = $1
    `,
      [id]
    );

    const updatedTable = updatedTableResult.rows[0];

    // Broadcast the table update via WebSocket
    if (global.broadcastTableUpdate) {
      global.broadcastTableUpdate(updatedTable);
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    console.error("Error updating table status:", error);
    res.status(500).json({ message: "Error updating table status" });
  }
};
