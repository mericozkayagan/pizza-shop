import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();
  const [isHovering, setIsHovering] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Ensure the item is valid before adding to cart
  const handleAddToCart = () => {
    if (!item || !item.id || !item.is_available) {
      console.error('Cannot add invalid or unavailable item to cart:', item);
      return;
    }

    setIsAdding(true);

    try {
      // Create a sanitized version of the item with all required properties
      const sanitizedItem = {
        id: item.id,
        name: item.name || 'Unknown Item',
        price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
        image_url: item.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: item.description || 'No description available',
        is_available: item.is_available
      };

      // Add the sanitized item to cart
      addToCart(sanitizedItem);

      // Provide visual feedback
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setIsAdding(false);
    }
  };

  // If item is invalid, don't render anything
  if (!item || !item.id) {
    return null;
  }

  const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
  const isAvailable = !!item.is_available;

  return (
    <div
      className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        <img
          src={item.image_url || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'}
          alt={item.name || 'Menu Item'}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
          }}
        />

        {/* Price tag with improved visibility */}
        <div className="absolute top-0 right-0 bg-red-600 text-white font-bold py-2 px-4 rounded-bl-lg shadow-md">
          ${itemPrice.toFixed(2)}
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-bold transform -rotate-12 shadow-lg">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name || 'Unknown Item'}</h3>
        <p className="text-gray-600 flex-grow mb-4">
          {item.description || 'No description available'}
        </p>

        <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
          <hr className="my-3 border-gray-200" />
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Top rated
              </span>
            </div>
            <div>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Hot & fresh
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className={`
            w-full py-3 px-4 rounded-lg font-bold text-white
            transition-all duration-300 flex items-center justify-center
            ${isAvailable ? (isAdding ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg') : 'bg-gray-400 cursor-not-allowed'}
          `}
          aria-label={isAvailable ? `Add ${item.name || 'item'} to order` : `${item.name || 'This item'} is out of stock`}
        >
          {isAdding ? (
            'Added!'
          ) : isAvailable ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Order
            </>
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuItem;