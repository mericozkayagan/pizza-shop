import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { orderAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Check if we're in the admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Determine if the user can edit the order
  const canEditOrder = isAdminRoute && user && ['admin', 'kitchen', 'server'].includes(user.role);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await orderAPI.getOrderById(orderId);
        console.log('Order data:', response.data);
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

  // Handle back button - go to appropriate page based on route
  const handleBack = () => {
    if (isAdminRoute) {
      navigate('/admin/orders');
    } else {
      navigate(-1);
    }
  };

  const handleItemStatusUpdate = async (itemId, newStatus) => {
    if (!canEditOrder) return;

    try {
      // Fix the API call to match the expected format
      await orderAPI.updateItemStatus(orderId, itemId, { status: newStatus });

      // Refresh order details
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update item status');
    }
  };

  // Handle updating the entire order status
  const handleOrderStatusUpdate = async (newStatus) => {
    if (!canEditOrder) return;

    try {
      setUpdatingStatus(true);
      await orderAPI.updateStatus(orderId, newStatus);

      // Refresh order details
      const response = await orderAPI.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
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
        return 'bg-indigo-100 text-indigo-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if user has permission to update items
  const canUpdateItems = () => {
    if (!canEditOrder) return false;
    return ['admin', 'kitchen', 'server'].includes(user.role);
  };

  // Check if user has permission to cancel items
  const canCancelItems = () => {
    if (!canEditOrder) return false;
    return ['admin', 'kitchen'].includes(user.role);
  };

  // Check if any order items are in 'pending' status
  const hasPendingItems = () => {
    if (!order || !order.items) return false;
    return order.items.some(item => item.status === 'pending');
  };

  // Check if all order items are in 'ready' status
  const allItemsReady = () => {
    if (!order || !order.items || order.items.length === 0) return false;
    return order.items.every(item => item.status === 'ready' || item.status === 'served' || item.status === 'cancelled');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              {isAdminRoute ? 'Manage Order' : 'Order Details'}
            </h1>
            <Button
              variant="secondary"
              onClick={handleBack}
            >
              {isAdminRoute ? 'Back to Orders' : 'Back'}
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Table</p>
                    <p className="font-semibold">Table #{order.table_number || order.table_id}</p>
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

                {/* Display edit mode indicator for admin users */}
                {canEditOrder && (
                  <div className="mt-4 mb-2">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      Edit Mode
                    </span>
                  </div>
                )}

                {/* Order-level action buttons - Only show in admin route */}
                {canUpdateItems() && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                    <h3 className="w-full text-sm font-medium text-gray-700 mb-2">Quick Actions:</h3>

                    {order.status === 'pending' && (
                      <Button
                        onClick={() => handleOrderStatusUpdate('preparing')}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Updating...' : 'Mark Order as Preparing'}
                      </Button>
                    )}

                    {order.status === 'preparing' && (
                      <Button
                        onClick={async () => {
                          try {
                            setUpdatingStatus(true);

                            // First update order status
                            await orderAPI.updateStatus(orderId, 'ready');

                            // Optional: Auto-update any pending or preparing items to ready
                            const itemsToUpdate = order.items.filter(item =>
                              ['pending', 'preparing'].includes(item.status));

                            if (itemsToUpdate.length > 0) {
                              console.log(`Auto-updating ${itemsToUpdate.length} items to ready status`);

                              for (const item of itemsToUpdate) {
                                try {
                                  await orderAPI.updateItemStatus(orderId, item.id, { status: 'ready' });
                                } catch (itemError) {
                                  console.error(`Failed to update item ${item.id}, continuing with others`, itemError);
                                }
                                // Small delay between requests
                                await new Promise(resolve => setTimeout(resolve, 50));
                              }
                            }

                            // Refresh order details
                            const response = await orderAPI.getOrderById(orderId);
                            setOrder(response.data);

                          } catch (err) {
                            console.error('Error updating order status:', err);
                            alert('Failed to update order status');
                          } finally {
                            setUpdatingStatus(false);
                          }
                        }}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Updating...' : 'Mark Order as Ready'}
                      </Button>
                    )}

                    {order.status === 'ready' && user?.role === 'server' && (
                      <Button
                        onClick={() => handleOrderStatusUpdate('served')}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Updating...' : 'Mark Order as Served'}
                      </Button>
                    )}

                    {(order.status === 'pending' || order.status === 'preparing') && canCancelItems() && (
                      <Button
                        variant="danger"
                        onClick={() => handleOrderStatusUpdate('cancelled')}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? 'Updating...' : 'Cancel Order'}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="divide-y divide-gray-200">
                  {order.items && order.items.map((item) => (
                    <div key={item.id || `item-${Math.random()}`} className="py-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">
                            {item.name || 'Unknown Item'}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Quantity: {item.quantity || 1}</p>
                            <p>Price: ${parseFloat(item.price || 0).toFixed(2)}</p>
                            {item.description && <p className="italic mt-1">{item.description}</p>}
                          </div>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                              <span className="font-medium">Notes:</span> {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs leading-5 font-semibold ${getStatusBadgeClass(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Status Update Buttons - Only show for authorized staff in admin route */}
                      {canUpdateItems() && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleItemStatusUpdate(item.id, 'preparing')}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {item.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => handleItemStatusUpdate(item.id, 'ready')}
                            >
                              Mark Ready
                            </Button>
                          )}
                          {item.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => handleItemStatusUpdate(item.id, 'served')}
                            >
                              Mark Served
                            </Button>
                          )}
                          {item.status === 'served' && user?.role === 'admin' && (
                            <Button
                              size="sm"
                              onClick={() => handleItemStatusUpdate(item.id, 'paid')}
                            >
                              Mark Paid
                            </Button>
                          )}
                          {['pending', 'preparing'].includes(item.status) && canCancelItems() && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleItemStatusUpdate(item.id, 'cancelled')}
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
                      {order.items ? order.items.reduce((sum, item) => sum + parseInt(item.quantity || 0, 10), 0) : 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold">
                      ${order.items ? order.items.reduce((sum, item) => {
                        const price = parseFloat(item.price || 0);
                        const quantity = parseInt(item.quantity || 0, 10);
                        return sum + (price * quantity);
                      }, 0).toFixed(2) : '0.00'}
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