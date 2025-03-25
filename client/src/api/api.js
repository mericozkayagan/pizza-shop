import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getCurrentUser: () => api.get("/auth/me"),
  getAllUsers: () => api.get("/auth/users"),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// Menu API
export const menuAPI = {
  getAllItems: () => api.get("/menu"),
  getItemsByCategory: (categoryId) => api.get(`/menu/category/${categoryId}`),
  getItemById: (id) => api.get(`/menu/item/${id}`),
  createItem: (itemData) => api.post("/menu/item", itemData),
  updateItem: (id, itemData) => api.put(`/menu/item/${id}`, itemData),
  deleteItem: (id) => api.delete(`/menu/item/${id}`),
  getAllCategories: () => api.get("/menu/categories"),
  createCategory: (categoryData) => api.post("/menu/category", categoryData),
  updateCategory: (id, categoryData) =>
    api.put(`/menu/category/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/menu/category/${id}`),
};

// Table API
export const tableAPI = {
  getAllTables: () => api.get("/tables"),
  getTableById: (id) => api.get(`/tables/${id}`),
  createTable: (tableData) => api.post("/tables", tableData),
  updateTable: (id, tableData) => api.put(`/tables/${id}`, tableData),
  deleteTable: (id) => api.delete(`/tables/${id}`),
  assignServer: (id, serverId) =>
    api.put(`/tables/${id}/server`, { server_id: serverId }),
  updateStatus: (id, status) => api.put(`/tables/${id}/status`, { status }),
};

// Order API
export const orderAPI = {
  getAllOrders: () => api.get("/orders"),
  getActiveOrders: () => api.get("/orders/active"),
  getOrdersByTable: (tableId) => api.get(`/orders/table/${tableId}`),
  getActiveOrderByTable: (tableId) =>
    api.get(`/orders/table/${tableId}/active`),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post("/orders", orderData),
  addItems: (id, items) => api.post(`/orders/${id}/items`, { items }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  updateItemStatus: (orderId, itemId, status) =>
    api.put(`/orders/${orderId}/item/${itemId}/status`, { status }),
  processPayment: (id, paymentData) =>
    api.post(`/orders/${id}/payment`, paymentData),
};

export default api;
