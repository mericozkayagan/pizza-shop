const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const {
  verifyToken,
  isAdmin,
  isStaff,
  isKitchen,
  isServer,
} = require("../middleware/auth.middleware");

// Get all orders (admin/staff only)
router.get("/", verifyToken, isStaff, orderController.getAllOrders);

// Get active orders (staff only)
router.get("/active", verifyToken, isStaff, orderController.getActiveOrders);

// Get orders by table
router.get("/table/:tableId", orderController.getOrdersByTable);

// Get active order by table
router.get("/table/:tableId/active", orderController.getActiveOrderByTable);

// Get order details by ID
router.get("/:id", orderController.getOrderById);

// Create a new order (accessible to all users)
router.post("/", orderController.createOrder);

// Add items to an existing order (accessible to all users)
router.post("/:id/items", orderController.addOrderItems);

// Update order status (staff only)
router.put(
  "/:id/status",
  verifyToken,
  isStaff,
  orderController.updateOrderStatus
);

// Update order item status (kitchen/staff only)
router.put(
  "/:id/item/:itemId/status",
  verifyToken,
  isKitchen,
  orderController.updateOrderItemStatus
);

// Process payment for order (server/staff only)
router.post(
  "/:id/payment",
  verifyToken,
  isServer,
  orderController.processPayment
);

module.exports = router;
