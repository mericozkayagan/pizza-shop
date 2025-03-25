const fs = require("fs");
const path = require("path");
const db = require("./index");

// Read and execute the schema.sql file
async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("Initializing database...");
    await db.query(schema);
    console.log("Database schema initialized successfully");

    // Insert sample data if needed
    await insertSampleData();

    console.log("Database setup complete");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Insert some sample data for testing
async function insertSampleData() {
  try {
    // Sample menu items
    const pizzaItems = [
      {
        name: "Margherita",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 12.99,
        category_id: 1,
        image_url:
          "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
      },
      {
        name: "Pepperoni",
        description: "Pizza with tomato sauce, mozzarella, and pepperoni",
        price: 14.99,
        category_id: 1,
        image_url:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e",
      },
      {
        name: "Vegetarian",
        description:
          "Pizza with tomato sauce, mozzarella, bell peppers, mushrooms, and onions",
        price: 13.99,
        category_id: 1,
        image_url:
          "https://images.unsplash.com/photo-1511689660979-10d2b1aada49",
      },
    ];

    // Sample tables
    const tables = [
      { number: 1, capacity: 2, x_position: 100, y_position: 100 },
      { number: 2, capacity: 4, x_position: 200, y_position: 100 },
      { number: 3, capacity: 6, x_position: 300, y_position: 100 },
      { number: 4, capacity: 2, x_position: 100, y_position: 200 },
      { number: 5, capacity: 4, x_position: 200, y_position: 200 },
    ];

    // Sample ingredients
    const ingredients = [
      { name: "Flour", quantity: 50, unit: "kg", min_quantity: 10 },
      { name: "Tomato Sauce", quantity: 30, unit: "liters", min_quantity: 5 },
      { name: "Mozzarella", quantity: 20, unit: "kg", min_quantity: 5 },
      { name: "Pepperoni", quantity: 15, unit: "kg", min_quantity: 3 },
      { name: "Mushrooms", quantity: 10, unit: "kg", min_quantity: 2 },
      { name: "Bell Peppers", quantity: 10, unit: "kg", min_quantity: 2 },
      { name: "Onions", quantity: 10, unit: "kg", min_quantity: 2 },
      { name: "Basil", quantity: 2, unit: "kg", min_quantity: 1 },
    ];

    // Insert tables
    for (const table of tables) {
      await db.query(
        "INSERT INTO tables (number, capacity, x_position, y_position) VALUES ($1, $2, $3, $4) ON CONFLICT (number) DO NOTHING",
        [table.number, table.capacity, table.x_position, table.y_position]
      );
    }

    // Insert menu items
    for (const item of pizzaItems) {
      await db.query(
        "INSERT INTO menu_items (name, description, price, category_id, image_url) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
        [
          item.name,
          item.description,
          item.price,
          item.category_id,
          item.image_url,
        ]
      );
    }

    // Insert ingredients
    for (const ingredient of ingredients) {
      await db.query(
        "INSERT INTO ingredients (name, quantity, unit, min_quantity) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING",
        [
          ingredient.name,
          ingredient.quantity,
          ingredient.unit,
          ingredient.min_quantity,
        ]
      );
    }

    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
}

// Run the initialization
initializeDatabase();

module.exports = { initializeDatabase };
