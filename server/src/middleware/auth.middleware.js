const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verify the JWT token from the authorization header
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "pizza_shop_secret"
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Check if user has admin role
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Requires admin role" });
  }

  next();
};

// Check if user has kitchen role
const isKitchen = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "kitchen" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Requires kitchen or admin role" });
  }

  next();
};

// Check if user has server role
const isServer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "server" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Requires server or admin role" });
  }

  next();
};

// Check if user has staff role (any role is ok except customer)
const isStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!["admin", "staff", "server", "kitchen"].includes(req.user.role)) {
    return res.status(403).json({ message: "Requires staff role" });
  }

  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isKitchen,
  isServer,
  isStaff,
};
