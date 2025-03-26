import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pizza-themed header */}
      <div className="bg-red-700 text-white text-center text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>🍕 Free delivery on orders over $30! Call us: (555) 123-4567</p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="text-2xl font-bold text-red-600 italic">Pizza Paradise</span>
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  to="/menu"
                  className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 hover:border-red-600 transition-colors"
                >
                  Menu
                </Link>
                {user && user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/admin/orders" className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 transition-colors">
                      Manage Orders
                    </Link>
                    <Link to="/admin/menu" className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 transition-colors">
                      Manage Menu
                    </Link>
                    <Link to="/admin/tables" className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 transition-colors">
                      Manage Tables
                    </Link>
                    <Link to="/admin/users" className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 transition-colors">
                      Manage Users
                    </Link>
                  </>
                )}
                {user && user.role === 'kitchen' && (
                  <Link to="/kitchen" className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 transition-colors">
                    Kitchen
                  </Link>
                )}
                {user && user.role === 'server' && (
                  <Link to="/server" className="inline-flex items-center px-3 py-2 text-gray-900 font-medium hover:text-red-600 transition-colors">
                    Server
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Link to="/select-table" className="p-2 text-gray-900 hover:text-red-600 hidden md:block">
                Tables
              </Link>

              <Link
                to="/cart"
                className="ml-4 p-2 text-gray-900 hover:text-red-600 relative"
                aria-label="Shopping cart"
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="ml-6 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-sm transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="ml-6 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-sm transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden ml-4 p-2 text-gray-800 hover:text-red-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/menu" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                Menu
              </Link>
              <Link to="/select-table" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                Tables
              </Link>
              {user && user.role === 'admin' && (
                <>
                  <Link to="/admin" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/admin/orders" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                    Manage Orders
                  </Link>
                  <Link to="/admin/menu" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                    Manage Menu
                  </Link>
                  <Link to="/admin/tables" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                    Manage Tables
                  </Link>
                  <Link to="/admin/users" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                    Manage Users
                  </Link>
                </>
              )}
              {user && user.role === 'kitchen' && (
                <Link to="/kitchen" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                  Kitchen
                </Link>
              )}
              {user && user.role === 'server' && (
                <Link to="/server" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-red-50" onClick={() => setMobileMenuOpen(false)}>
                  Server
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>
        {children}
      </main>

      {/* Footer with improved contrast */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Pizza Paradise</h3>
              <p className="text-gray-100 mb-4">Serving the best Italian cuisine since 1995. Made with love and only the freshest ingredients.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-100 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-100 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Opening Hours</h3>
              <ul className="text-gray-100 space-y-2">
                <li>Monday - Thursday: 11:00 AM - 10:00 PM</li>
                <li>Friday - Saturday: 11:00 AM - 11:00 PM</li>
                <li>Sunday: 12:00 PM - 9:00 PM</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
              <ul className="text-gray-100 space-y-2">
                <li>123 Pizza Street, Foodville</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@pizzaparadise.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-200 text-sm">
            <p>© 2023 Pizza Paradise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;