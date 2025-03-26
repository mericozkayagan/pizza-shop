import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import SelectTablePage from './pages/SelectTablePage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import KitchenPage from './pages/KitchenPage';
import ServerPage from './pages/ServerPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminPage from './pages/admin/AdminPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import TableManagementPage from './pages/admin/TableManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/select-table" element={<SelectTablePage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailsPage />} />

            {/* Protected Routes */}
            <Route path="/kitchen" element={<KitchenPage />} />
            <Route path="/server" element={<ServerPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/menu" element={<MenuManagementPage />} />
            <Route path="/admin/tables" element={<TableManagementPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/orders" element={<OrderManagementPage />} />
            <Route path="/admin/orders/:orderId" element={<OrderDetailsPage />} />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/menu" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
