import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import { menuAPI, orderAPI, tableAPI } from '../../api/api';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    menuItems: 0,
    tables: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all required data in parallel
        const [ordersRes, menuItemsRes, tablesRes] = await Promise.all([
          orderAPI.getAllOrders(),
          menuAPI.getAllItems(),
          tableAPI.getAllTables()
        ]);

        const orders = ordersRes.data;
        const menuItems = menuItemsRes.data;
        const tables = tablesRes.data;

        // Calculate statistics
        const activeOrders = orders.filter(
          order => !['paid', 'cancelled'].includes(order.status)
        ).length;

        const totalRevenue = orders
          .filter(order => order.status === 'paid')
          .reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

        setStats({
          totalOrders: orders.length,
          activeOrders,
          totalRevenue,
          menuItems: menuItems.length,
          tables: tables.length
        });
      } catch (err) {
        setError('Failed to fetch statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <p>Loading statistics...</p>
          </div>
        ) : (
          <>
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Orders</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{stats.totalOrders}</p>
                    <p className="text-sm text-gray-500">Total Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{stats.activeOrders}</p>
                    <p className="text-sm text-gray-500">Active Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
                <p className="mt-2 text-2xl font-bold text-primary-600">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">System Status</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{stats.menuItems}</p>
                    <p className="text-sm text-gray-500">Menu Items</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{stats.tables}</p>
                    <p className="text-sm text-gray-500">Tables</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => navigate('/admin/orders')}
                  variant="primary"
                  fullWidth
                >
                  Manage Orders
                </Button>
                <Button
                  onClick={() => navigate('/admin/menu')}
                  variant="primary"
                  fullWidth
                >
                  Manage Menu
                </Button>
                <Button
                  onClick={() => navigate('/admin/tables')}
                  variant="primary"
                  fullWidth
                >
                  Manage Tables
                </Button>
                <Button
                  onClick={() => navigate('/admin/users')}
                  variant="primary"
                  fullWidth
                >
                  Manage Users
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminPage;