-- First clean up duplicate pizza entries (if any)
DELETE FROM menu_items
WHERE id NOT IN (
    SELECT MIN(id)
    FROM menu_items
    GROUP BY name, category_id
);

-- Pasta items (category_id = 2)
INSERT INTO menu_items (name, description, price, category_id, image_url, is_available)
VALUES
  ('Spaghetti Carbonara', 'Classic carbonara with pancetta, egg, black pepper, and parmesan', 14.99, 2, 'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9', true),
  ('Fettuccine Alfredo', 'Creamy fettuccine with garlic parmesan sauce', 13.99, 2, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a', true),
  ('Lasagna', 'Layered pasta with beef ragù, béchamel sauce, and cheese', 15.99, 2, 'https://images.unsplash.com/photo-1619895092538-128341789043', true),
  ('Penne Arrabbiata', 'Spicy tomato sauce with garlic, chili flakes, and parsley', 12.99, 2, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8', true),
  ('Ravioli', 'Cheese-filled pasta pockets with tomato basil sauce', 14.99, 2, 'https://images.unsplash.com/photo-1587740908075-9e245311d258', true)
ON CONFLICT (id) DO NOTHING;

-- Appetizers (category_id = 3)
INSERT INTO menu_items (name, description, price, category_id, image_url, is_available)
VALUES
  ('Garlic Bread', 'Toasted bread with garlic butter and herbs', 5.99, 3, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c', true),
  ('Bruschetta', 'Toasted bread topped with tomatoes, garlic, basil, and olive oil', 7.99, 3, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f', true),
  ('Calamari', 'Crispy fried calamari served with marinara sauce', 11.99, 3, 'https://images.unsplash.com/photo-1596556250264-b3c8173adf50', true),
  ('Mozzarella Sticks', 'Breaded and fried mozzarella with marinara sauce', 8.99, 3, 'https://images.unsplash.com/photo-1548340748-6d98de8c5f93', true),
  ('Caprese Salad', 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', 9.99, 3, 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5', true)
ON CONFLICT (id) DO NOTHING;

-- Desserts (category_id = 4)
INSERT INTO menu_items (name, description, price, category_id, image_url, is_available)
VALUES
  ('Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', 7.99, 4, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', true),
  ('Cannoli', 'Crispy pastry tubes filled with sweet ricotta cream', 6.99, 4, 'https://images.unsplash.com/photo-1635321593217-40050ad13c74', true),
  ('Chocolate Lava Cake', 'Warm chocolate cake with a molten center, served with vanilla ice cream', 8.99, 4, 'https://images.unsplash.com/photo-1617805677940-0502199b214d', true),
  ('Panna Cotta', 'Italian custard dessert with berry compote', 6.99, 4, 'https://images.unsplash.com/photo-1488477181946-6428a0291777', true),
  ('Gelato', 'Italian ice cream in various flavors', 5.99, 4, 'https://images.unsplash.com/photo-1557142046-c704a3adf364', true)
ON CONFLICT (id) DO NOTHING;

-- Beverages (category_id = 5)
INSERT INTO menu_items (name, description, price, category_id, image_url, is_available)
VALUES
  ('Italian Soda', 'Sparkling water with flavor syrup and cream', 3.99, 5, 'https://images.unsplash.com/photo-1623123776919-a382c80481a6', true),
  ('Espresso', 'Strong Italian coffee', 2.99, 5, 'https://images.unsplash.com/photo-1510591509098-f4b5d5516d07', true),
  ('Cappuccino', 'Espresso with steamed milk and foam', 4.99, 5, 'https://images.unsplash.com/photo-1534778356534-d3e7d97bf63a', true),
  ('San Pellegrino', 'Sparkling mineral water', 3.49, 5, 'https://images.unsplash.com/photo-1523371054106-bbf80586c33c', true),
  ('House Wine', 'Red or white house wine by the glass', 6.99, 5, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3', true)
ON CONFLICT (id) DO NOTHING;
