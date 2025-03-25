const db = require("../db");

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT m.*, c.name as category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY m.category_id, m.name
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting menu items:", error);
    res.status(500).json({ message: "Error getting menu items" });
  }
};

// Get menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const result = await db.query(
      `
      SELECT m.*, c.name as category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.category_id = $1
      ORDER BY m.name
    `,
      [categoryId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting menu items by category:", error);
    res.status(500).json({ message: "Error getting menu items by category" });
  }
};

// Get a single menu item
exports.getMenuItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT m.*, c.name as category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error getting menu item:", error);
    res.status(500).json({ message: "Error getting menu item" });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  const {
    name,
    description,
    price,
    category_id,
    image_url,
    is_available = true,
  } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO menu_items (name, description, price, category_id, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, category_id, image_url, is_available]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Error creating menu item" });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id, image_url, is_available } =
    req.body;

  try {
    // Check if menu item exists
    const checkItem = await db.query("SELECT * FROM menu_items WHERE id = $1", [
      id,
    ]);

    if (checkItem.rows.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const result = await db.query(
      `UPDATE menu_items
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category_id = COALESCE($4, category_id),
           image_url = COALESCE($5, image_url),
           is_available = COALESCE($6, is_available)
       WHERE id = $7
       RETURNING *`,
      [name, description, price, category_id, image_url, is_available, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Error updating menu item" });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if menu item exists
    const checkItem = await db.query("SELECT * FROM menu_items WHERE id = $1", [
      id,
    ]);

    if (checkItem.rows.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await db.query("DELETE FROM menu_items WHERE id = $1", [id]);

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Error deleting menu item" });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories ORDER BY name");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Error getting categories" });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category" });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await db.query(
      "UPDATE categories SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *",
      [name, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category" });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if any menu items use this category
    const menuItems = await db.query(
      "SELECT id FROM menu_items WHERE category_id = $1",
      [id]
    );

    if (menuItems.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category that has menu items. Update or delete the menu items first.",
      });
    }

    const result = await db.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category" });
  }
};
