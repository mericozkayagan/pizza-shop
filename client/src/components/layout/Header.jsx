import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src="/logo.png" alt="Pizza Paradise" className="h-10 mr-2" />
            <span className="heading-4 text-red-700 hidden sm:block">Pizza Paradise</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 hover:text-red-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'}`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`nav-link ${isActive('/menu') ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'}`}
            >
              Menu
            </Link>
            <Link
              to="/tables"
              className={`nav-link ${isActive('/tables') ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'}`}
            >
              Tables
            </Link>
            <Link
              to="/cart"
              className={`nav-link flex items-center ${isActive('/cart') ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'}`}
            >
              <span className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </span>
                )}
              </span>
              <span className="ml-2">Cart</span>
            </Link>
            {user ? (
              <div className="relative">
                <button
                  className="text-ui-bold text-gray-600 hover:text-red-600 flex items-center"
                  onClick={logout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2.414L15.414 9H10V5.414z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`nav-link ${isActive('/login') ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'}`}
              >
                Login
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'text-red-600 font-bold' : 'text-gray-600'}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className={`nav-link ${isActive('/menu') ? 'text-red-600 font-bold' : 'text-gray-600'}`}
                onClick={closeMenu}
              >
                Menu
              </Link>
              <Link
                to="/tables"
                className={`nav-link ${isActive('/tables') ? 'text-red-600 font-bold' : 'text-gray-600'}`}
                onClick={closeMenu}
              >
                Tables
              </Link>
              <Link
                to="/cart"
                className={`nav-link flex items-center ${isActive('/cart') ? 'text-red-600 font-bold' : 'text-gray-600'}`}
                onClick={closeMenu}
              >
                <span className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemsCount}
                    </span>
                  )}
                </span>
                <span className="ml-2">Cart</span>
              </Link>
              {user ? (
                <button
                  className="text-ui-bold text-gray-600 hover:text-red-600 flex items-center"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2.414L15.414 9H10V5.414z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`nav-link ${isActive('/login') ? 'text-red-600 font-bold' : 'text-gray-600'}`}
                  onClick={closeMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;