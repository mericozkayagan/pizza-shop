import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';

const CartItem = ({ item }) => {
  const { updateQuantity, updateNotes, removeFromCart } = useCart();
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(item.notes || '');

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    updateQuantity(item.menu_item_id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.menu_item_id);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleNotesSave = () => {
    updateNotes(item.menu_item_id, notes);
    setShowNotes(false);
  };

  return (
    <div className="flex flex-col py-4 border-b border-gray-200">
      <div className="flex justify-between">
        <div className="flex-grow">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-gray-600 text-sm">
            ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
          </p>
          {item.notes && !showNotes && (
            <p className="text-gray-500 text-xs mt-1 italic">{item.notes}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            -
          </button>
          <span className="px-2">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            +
          </button>
          <button
            onClick={handleRemove}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {showNotes ? (
        <div className="mt-2">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Special instructions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={2}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              onClick={() => setShowNotes(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNotesSave}
              size="sm"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNotes(true)}
          className="mt-1 text-sm text-gray-600 underline self-start hover:text-red-500"
        >
          {item.notes ? 'Edit Notes' : 'Add Notes'}
        </button>
      )}
    </div>
  );
};

export default CartItem;