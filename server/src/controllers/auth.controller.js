const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role = "staff" } = req.body;

  try {
    // Check if user already exists
    const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user
    const newUser = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    // Create and return JWT token
    const payload = {
      id: newUser.rows[0].id,
      name: newUser.rows[0].name,
      email: newUser.rows[0].email,
      role: newUser.rows[0].role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "pizza_shop_secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create and return JWT token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "pizza_shop_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: user.rows[0] });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error getting user data" });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );

    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error getting users" });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error getting user" });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    // Verify user exists
    const userCheck = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    let paramCounter = 1;

    if (name) {
      updateFields.push(`name = $${paramCounter}`);
      queryParams.push(name);
      paramCounter++;
    }

    if (email) {
      // Check if email is already taken by another user
      if (email !== userCheck.rows[0].email) {
        const emailCheck = await db.query(
          "SELECT * FROM users WHERE email = $1 AND id != $2",
          [email, id]
        );

        if (emailCheck.rows.length > 0) {
          return res
            .status(400)
            .json({ message: "Email is already in use by another user" });
        }
      }

      updateFields.push(`email = $${paramCounter}`);
      queryParams.push(email);
      paramCounter++;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.push(`password = $${paramCounter}`);
      queryParams.push(hashedPassword);
      paramCounter++;
    }

    if (role) {
      updateFields.push(`role = $${paramCounter}`);
      queryParams.push(role);
      paramCounter++;
    }

    // If no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Add user ID as the last parameter
    queryParams.push(id);

    // Perform update
    const result = await db.query(
      `UPDATE users SET ${updateFields.join(
        ", "
      )} WHERE id = $${paramCounter} RETURNING id, name, email, role`,
      queryParams
    );

    res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error updating user" });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  // Prevent deleting the current user
  if (id === req.user.id.toString()) {
    return res.status(400).json({ message: "Cannot delete your own account" });
  }

  try {
    // Check if user exists
    const userCheck = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await db.query("DELETE FROM users WHERE id = $1", [id]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error deleting user" });
  }
};
