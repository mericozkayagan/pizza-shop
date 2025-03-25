import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import CartItem from '../components/cart/CartItem';
import Button from '../components/ui/Button';

const CartPage = () => {
  const { cartItems, tableId, clearCart, calculateTotal, getOrderItems } = useCart();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmitOrder = async () => {
    if (!tableId) {
      setError('Please select a table before placing your order');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        table_id: tableId,
        items: getOrderItems(),
        notes: notes
      };

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
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

          {!tableId && (
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

          {tableId && (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-blue-700">
                Your order will be placed for <strong>Table #{tableId}</strong>
              </p>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button onClick={handleAddMore}>Browse Menu</Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Cart items */}
              <div className="p-6">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <CartItem key={item.menu_item_id} item={item} />
                  ))}
                </div>
              </div>

              {/* Order notes */}
              <div className="border-t border-gray-200 p-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Cart summary */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Items:</span>
                  <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
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

                <div className="flex space-x-4">
                  <Button
                    variant="secondary"
                    onClick={handleAddMore}
                  >
                    Add More Items
                  </Button>
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={loading || !tableId || cartItems.length === 0}
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
