import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderAPI, tableAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';

const CartPage = () => {
  const { cartItems, selectedTableId, clearCart, calculateTotal, totalItems } = useCart();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch table data when component loads
  useEffect(() => {
    const fetchTableInfo = async () => {
      if (!selectedTableId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await tableAPI.getTableById(selectedTableId);
        setSelectedTable(response.data);
      } catch (err) {
        console.error('Error fetching table info:', err);
        setError('Failed to load table information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableInfo();
  }, [selectedTableId]);

  const handleSubmitOrder = async () => {
    if (!selectedTableId) {
      setError('Please select a table before placing your order');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare order data - ensure menu_item_id is properly set
      const orderData = {
        table_id: selectedTableId,
        items: cartItems.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity || 1, // Ensure a default quantity
          notes: item.notes || ''
        })),
        notes: notes
      };

      console.log('Submitting order with data:', orderData);

      // Submit order
      await orderAPI.createOrder(orderData);

      // Clear cart and redirect
      clearCart();
      navigate('/order-success');
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    navigate('/menu');
  };

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

          {!selectedTableId && (
            <div className="bg-yellow-100 p-4 rounded-md mb-6 border border-yellow-300">
              <p className="text-yellow-800">
                You haven't selected a table yet. Please select a table before placing your order.
              </p>
              <a
                href="/select-table"
                className="mt-2 inline-block text-sm font-medium text-yellow-800 underline"
              >
                Select a Table
              </a>
            </div>
          )}

          {selectedTable && (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-blue-700">
                Your order will be placed for <strong>Table #{selectedTable.number}</strong> ({selectedTable.capacity} seats)
              </p>
            </div>
          )}

          {!cartItems || cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button onClick={handleAddMore}>Browse Menu</Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Items in Your Cart</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id || `item-${Math.random()}`}
                      item={item}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                    rows="3"
                    placeholder="Any special requests or preferences for your order?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Items:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total Price:</span>
                  <span className="font-bold">${calculateTotal().toFixed(2)}</span>
                </div>

                {error && (
                  <div className="bg-red-100 p-3 rounded-md border border-red-300 mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                  <Button
                    variant="secondary"
                    onClick={handleAddMore}
                  >
                    Add More Items
                  </Button>
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={loading || !selectedTableId || !cartItems || cartItems.length === 0}
                    fullWidth
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
