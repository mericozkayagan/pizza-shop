import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import MenuItem from '../components/menu/MenuItem';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const { tableId } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories and menu items in parallel
        const [categoriesResponse, itemsResponse] = await Promise.all([
          menuAPI.getAllCategories(),
          menuAPI.getAllItems()
        ]);

        setCategories(categoriesResponse.data);
        setMenuItems(itemsResponse.data);

        // Set first category as active if available
        if (categoriesResponse.data.length > 0) {
          setActiveCategory(categoriesResponse.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Filter items by active category
  const filteredItems = activeCategory
    ? menuItems.filter(item => item.category_id === activeCategory)
    : menuItems;

  return (
    <MainLayout>
      <div className="w-full bg-[url('https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg')] bg-cover bg-center py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">Our Delicious Menu</h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8 drop-shadow-md">
            Handcrafted with fresh ingredients and baked to perfection in our wood-fired ovens
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {!tableId && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-8 max-w-2xl mx-auto shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-red-800">
                  Please select a table before placing your order
                </p>
                <div className="mt-2">
                  <Link
                    to="/select-table"
                    className="inline-block px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
                  >
                    Select a Table
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Categories tabs */}
            <div className="mb-12 bg-white rounded-xl shadow-md p-2 max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`
                      relative px-6 py-3 mx-2 my-1 font-medium text-base rounded-full
                      transition-all duration-200 ease-in-out
                      ${activeCategory === category.id
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-red-50 border border-gray-200'}
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredItems.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md max-w-xl mx-auto">
                <img
                  src="https://img.icons8.com/color/96/000000/nothing-found.png"
                  alt="No items found"
                  className="w-24 h-24 mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800">No items found</h3>
                <p className="mt-2 text-gray-600">
                  We're currently updating our menu for this category.
                  <br />Please check back soon or try another category!
                </p>
              </div>
            )}

            {/* Pizza shop decorative elements */}
            <div className="mt-16 py-8 bg-red-50 rounded-lg relative overflow-hidden">
              <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-3xl font-bold text-red-800 mb-4">We Take Pride in Our Food</h2>
                <p className="text-lg text-red-700 mb-6">
                  Our pizzas are made with fresh, locally-sourced ingredients and baked in traditional wood-fired ovens.
                </p>
                <div className="flex flex-wrap justify-center gap-8 text-center">
                  <div className="p-4">
                    <div className="rounded-full bg-white p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-red-800">Fast Preparation</h3>
                  </div>
                  <div className="p-4">
                    <div className="rounded-full bg-white p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-red-800">Fresh Ingredients</h3>
                  </div>
                  <div className="p-4">
                    <div className="rounded-full bg-white p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-red-800">Customer Satisfaction</h3>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 opacity-10 z-0">
                <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/food.png')" }}></div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MenuPage;