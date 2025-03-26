const express = require("express");
const router = express.Router();
const tableController = require("../controllers/table.controller");
const {
  verifyToken,
  isAdmin,
  isStaff,
} = require("../middleware/auth.middleware");

// Get all tables
router.get("/", tableController.getAllTables);

// Get a single table
router.get("/:id", tableController.getTableById);

// Create a new table (admin only)
router.post("/", verifyToken, isAdmin, tableController.createTable);

// Update a table (admin only)
router.put("/:id", verifyToken, isAdmin, tableController.updateTable);

// Delete a table (admin only)
router.delete("/:id", verifyToken, isAdmin, tableController.deleteTable);

// Assign server to table (staff/admin)
router.put("/:id/server", verifyToken, isStaff, tableController.assignServer);

// Update table status - accessible for customers to select tables
router.put("/:id/status", tableController.updateTableStatus);

module.exports = router;
