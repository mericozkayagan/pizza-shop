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
      {/* Hero Banner with Texture Overlay */}
      <div className="relative overflow-hidden">
        {/* Main background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg)',
            filter: 'brightness(0.85)'
          }}
        ></div>

        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/checkered-pattern.png')",
            mixBlendMode: 'multiply'
          }}
        ></div>

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-24">
          <div className="inline-block mb-3 px-4 py-1 rounded-full bg-red-600 shadow-lg transform -rotate-1">
            <span className="text-white font-medium text-sm tracking-wide">Authentic Italian Recipes</span>
          </div>
          <h1 className="menu-banner-title mb-4 transform hover:scale-105 transition-transform duration-500 text-white">
            Our Delicious Menu
          </h1>
          <p className="menu-banner-text max-w-2xl mx-auto mb-8 text-white">
            Handcrafted with fresh ingredients and baked to perfection in our wood-fired ovens
          </p>

          {/* Pizza icon decoration */}
          <div className="absolute left-10 top-20 opacity-20 hidden lg:block">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49 3.49-7.51-7.51 3.49-3.49 7.51zm5.5-6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
            </svg>
          </div>

          <div className="absolute right-10 bottom-20 opacity-20 hidden lg:block">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49 3.49-7.51-7.51 3.49-3.49 7.51zm5.5-6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!tableId && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-8 max-w-2xl mx-auto shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-ui-bold">
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
                <p className="notice-text text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Category Selector */}
            <div className="mb-8">
              <h2 className="menu-section-title text-center mb-6">Our Menu Categories</h2>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-4 py-2 rounded-full border-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1
                    ${!activeCategory
                      ? 'bg-red-600 text-white border-red-700 font-bold'
                      : 'bg-white text-red-600 border-red-200 hover:border-red-400'
                    }`}
                >
                  All Items
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1
                      ${activeCategory === category.id
                        ? 'bg-red-600 text-white border-red-700 font-bold'
                        : 'bg-white text-red-600 border-red-200 hover:border-red-400'
                      }`}
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
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                <h3 className="handwritten-note text-center mb-2 text-2xl">Mamma mia!</h3>
                <p className="text-body-md mb-2">We couldn't find any menu items matching your selection.</p>
                <p className="text-body-sm">Try selecting a different category or check back later for new additions to our menu.</p>
              </div>
            )}

            {/* Restaurant Features */}
            <div className="mt-16 bg-white shadow-xl rounded-xl overflow-hidden max-w-5xl mx-auto">
              <div className="pizza-crust-border m-4">
                <div className="text-center py-8 px-4">
                  <div className="pizza-accent-title mb-6">Taste the Authentic Italian Tradition</div>
                  <p className="text-body-lg text-red-700 mb-8 max-w-3xl mx-auto">
                    Our chefs prepare each pizza with carefully selected ingredients and traditional techniques passed down through generations.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="mb-3">
                        <span className="inline-block p-3 bg-red-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="heading-6 text-red-800 mb-2">Wood-Fired Perfection</h3>
                      <p className="text-body-sm">Our pizzas are baked in authentic wood-fired ovens at 850°F to achieve the perfect crust.</p>
                    </div>

                    <div className="text-center">
                      <div className="mb-3">
                        <span className="inline-block p-3 bg-red-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="heading-6 text-red-800 mb-2">Premium Ingredients</h3>
                      <p className="text-body-sm">We import San Marzano tomatoes and use only the finest local and imported ingredients.</p>
                    </div>

                    <div className="text-center">
                      <div className="mb-3">
                        <span className="inline-block p-3 bg-red-100 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="heading-6 text-red-800 mb-2">Customer Happiness</h3>
                      <p className="text-body-sm">Our customers' satisfaction is our priority - that's why we make every pizza with love.</p>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <span className="italian-phrase">"La vita è una combinazione di magia e pasta"</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default MenuPage;