import React, { useState, useEffect } from 'react';
import { orderAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import OrderCard from '../components/kitchen/OrderCard';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const KitchenPage = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Redirect if not kitchen or admin
  if (user && user.role !== 'kitchen' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Fetch active orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getActiveOrders();
      setActiveOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount and every 30 seconds
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Group orders by status
  const pendingOrders = activeOrders.filter(order => order.status === 'pending');
  const preparingOrders = activeOrders.filter(order => order.status === 'preparing');
  const readyOrders = activeOrders.filter(order => order.status === 'ready');

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kitchen Orders</h1>
          <button
            onClick={fetchOrders}
            className="bg-white p-2 rounded-md shadow hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {loading && activeOrders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md border border-red-300">
            <p className="text-red-800">{error}</p>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Active Orders</h2>
            <p className="text-gray-600">There are no orders to prepare at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Orders Column */}
            <div>
              <h2 className="text-lg font-semibold mb-4 bg-yellow-100 text-yellow-800 p-2 rounded">
                Pending ({pendingOrders.length})
              </h2>
              <div className="space-y-6">
                {pendingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={fetchOrders}
                  />
                ))}
                {pendingOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No pending orders</p>
                )}
              </div>
            </div>

            {/* Preparing Orders Column */}
            <div>
              <h2 className="text-lg font-semibold mb-4 bg-blue-100 text-blue-800 p-2 rounded">
                Preparing ({preparingOrders.length})
              </h2>
              <div className="space-y-6">
                {preparingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={fetchOrders}
                  />
                ))}
                {preparingOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No orders being prepared</p>
                )}
              </div>
            </div>

            {/* Ready Orders Column */}
            <div>
              <h2 className="text-lg font-semibold mb-4 bg-green-100 text-green-800 p-2 rounded">
                Ready ({readyOrders.length})
              </h2>
              <div className="space-y-6">
                {readyOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusUpdate={fetchOrders}
                  />
                ))}
                {readyOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No orders ready for serving</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default KitchenPage;