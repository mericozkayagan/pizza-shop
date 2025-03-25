import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await orderAPI.getOrderById(orderId);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async (itemId, newStatus) => {
    try {
      await orderAPI.updateOrderItemStatus(orderId, itemId, { status: newStatus });
      // Refresh order details
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update item status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'served':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md border border-red-300">
              <p className="text-red-800">{error}</p>
            </div>
          ) : order ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Table</p>
                    <p className="font-semibold">#{order.table_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{item.menu_item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              Notes: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusBadgeClass(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Status Update Buttons - Only show for kitchen staff or admin */}
                      {(user.role === 'kitchen' || user.role === 'admin') && (
                        <div className="flex space-x-2 mt-2">
                          {item.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'preparing')}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {item.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'ready')}
                            >
                              Mark Ready
                            </Button>
                          )}
                          {item.status === 'ready' && user.role === 'server' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(item.id, 'served')}
                            >
                              Mark Served
                            </Button>
                          )}
                          {['pending', 'preparing'].includes(item.status) && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleStatusUpdate(item.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 mb-1">Order Notes:</p>
                    <p className="text-gray-800">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 p-4 rounded-md border border-yellow-300">
              <p className="text-yellow-800">Order not found</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetailsPage;