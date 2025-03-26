require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const PORT = process.env.PORT || 8000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server, path: "/ws/tables" });

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on("connection", (ws, req) => {
  // Add client to the set
  clients.add(ws);

  console.log(`WebSocket client connected to tables feed`);

  // Send initial welcome message
  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to tables feed",
    })
  );

  // Handle client disconnect
  ws.on("close", () => {
    clients.delete(ws);
    console.log("WebSocket client disconnected from tables feed");
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Function to broadcast table updates to all connected clients
global.broadcastTableUpdate = (tableData) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(tableData));
    }
  });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const menuRoutes = require("./routes/menu.routes");
const tableRoutes = require("./routes/table.routes");
const orderRoutes = require("./routes/order.routes");
const authRoutes = require("./routes/auth.routes");

// Route middleware
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to Pizza Shop API");
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
