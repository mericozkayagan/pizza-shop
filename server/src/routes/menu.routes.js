const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

// Menu items routes
router.get("/", menuController.getAllMenuItems);
router.get("/category/:categoryId", menuController.getMenuItemsByCategory);
router.get("/item/:id", menuController.getMenuItemById);
router.post("/item", verifyToken, isAdmin, menuController.createMenuItem);
router.put("/item/:id", verifyToken, isAdmin, menuController.updateMenuItem);
router.delete("/item/:id", verifyToken, isAdmin, menuController.deleteMenuItem);

// Categories routes
router.get("/categories", menuController.getAllCategories);
router.post("/category", verifyToken, isAdmin, menuController.createCategory);
router.put(
  "/category/:id",
  verifyToken,
  isAdmin,
  menuController.updateCategory
);
router.delete(
  "/category/:id",
  verifyToken,
  isAdmin,
  menuController.deleteCategory
);

module.exports = router;
