import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Ensure cart is cleared when this page is reached
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const handleReturnToMenu = () => {
    navigate('/menu');
  };

  const handleOrderForAnotherTable = () => {
    navigate('/select-table');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h1>

          <p className="text-gray-600 mb-4">
            Thank you for your order. Your delicious food is being prepared and will be served to your table shortly.
          </p>

          <p className="text-gray-500 text-sm mb-4">
            Your cart has been cleared for your convenience.
          </p>

          <p className="text-gray-500 text-sm mb-8">
            You can check the status of your order on the kitchen display screens in the restaurant.
          </p>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleReturnToMenu}
              fullWidth
            >
              Return to Menu
            </Button>

            <Button
              variant="secondary"
              onClick={handleOrderForAnotherTable}
              fullWidth
            >
              Order for Another Table
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderSuccessPage;