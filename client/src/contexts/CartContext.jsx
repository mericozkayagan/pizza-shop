import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
    const savedCart = localStorage.getItem('cart');
    const savedTableId = localStorage.getItem('selectedTableId');

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }

      if (savedTableId) {
        setSelectedTableId(savedTableId);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // If there's an error with saved data, reset to defaults
      localStorage.removeItem('cart');
      localStorage.removeItem('selectedTableId');
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Save selected table to localStorage whenever it changes
  useEffect(() => {
    try {
    if (selectedTableId) {
      localStorage.setItem('selectedTableId', selectedTableId);
    } else {
      localStorage.removeItem('selectedTableId');
      }
    } catch (error) {
      console.error('Error saving selectedTableId to localStorage:', error);
    }
  }, [selectedTableId]);

  const addToCart = (item) => {
    if (!item || !item.id) {
      console.error('Cannot add invalid item to cart:', item);
      return;
    }

    try {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = (itemId) => {
    if (!itemId) {
      console.error('Cannot remove item with invalid ID');
      return;
    }

    try {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (!itemId) {
      console.error('Cannot update quantity for item with invalid ID');
      return;
    }

    try {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const clearCart = () => {
    try {
    setCartItems([]);
    setSelectedTableId(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('selectedTableId');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const updateItemNotes = (itemId, notes) => {
    if (!itemId) {
      console.error('Cannot update notes for item with invalid ID');
      return;
    }

    try {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, notes }
          : item
      )
    );
    } catch (error) {
      console.error('Error updating item notes:', error);
    }
  };

  const calculateTotal = () => {
    try {
      return cartItems.reduce((total, item) => {
        // Ensure price and quantity are valid numbers
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0;
    }
  };

  const getTotalItems = () => {
    try {
      return cartItems.reduce((sum, item) => {
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
        return sum + quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total items:', error);
      return 0;
    }
  };

  const value = {
    cartItems,
    selectedTableId,
    setSelectedTableId,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemNotes,
    clearCart,
    calculateTotal,
    totalItems: getTotalItems()
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};