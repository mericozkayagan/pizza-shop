const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// Register a new user
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Get current user (protected route)
router.get("/me", verifyToken, authController.getCurrentUser);

// User management routes (admin only)
router.get("/users", verifyToken, isAdmin, authController.getAllUsers);
router.get("/users/:id", verifyToken, isAdmin, authController.getUserById);
router.put("/users/:id", verifyToken, isAdmin, authController.updateUser);
router.delete("/users/:id", verifyToken, isAdmin, authController.deleteUser);

module.exports = router;
