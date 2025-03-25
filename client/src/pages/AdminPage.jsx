import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { menuAPI, orderAPI, tableAPI } from '../api/api';

const AdminPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    menuItems: 0,
    tables: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [ordersResponse, menuResponse, tablesResponse] = await Promise.all([
          orderAPI.getAllOrders(),
          menuAPI.getAllMenuItems(),
          tableAPI.getAllTables()
        ]);

        const orders = ordersResponse.data;
        const menuItems = menuResponse.data;
        const tables = tablesResponse.data;

        // Calculate stats
        const activeOrders = orders.filter(order =>
          order.status !== 'completed' && order.status !== 'cancelled'
        ).length;

        const totalRevenue = orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.total || 0), 0);

        setStats({
          totalOrders: orders.length,
          activeOrders,
          totalRevenue,
          menuItems: menuItems.length,
          tables: tables.length
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md border border-red-300">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Orders</h3>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Active Orders</h3>
                <p className="text-3xl font-bold">{stats.activeOrders}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Menu Items</h3>
                <p className="text-3xl font-bold">{stats.menuItems}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/admin/menu'}
                >
                  Manage Menu
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/admin/tables'}
                >
                  Manage Tables
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/admin/users'}
                >
                  Manage Users
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Backend API</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tables Available</span>
                  <span className="font-medium">{stats.tables}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminPage;