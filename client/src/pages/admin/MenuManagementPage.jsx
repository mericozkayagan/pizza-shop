import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { menuAPI } from '../../api/api';

const MenuManagementPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form data
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Fetch menu data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, menuItemsRes] = await Promise.all([
          menuAPI.getAllCategories(),
          menuAPI.getAllItems()
        ]);
        setCategories(categoriesRes.data);
        setMenuItems(menuItemsRes.data);
      } catch (err) {
        console.error('Error fetching menu data:', err);
        setError('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Category form handlers
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await menuAPI.updateCategory(editingCategory.id, categoryForm);
      } else {
        await menuAPI.createCategory(categoryForm);
      }
      // Refresh categories
      const response = await menuAPI.getAllCategories();
      setCategories(response.data);
      // Reset form
      setCategoryForm({ name: '', description: '' });
      setShowCategoryForm(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category. Please try again.');
    }
  };

  // Menu item form handlers
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        ...itemForm,
        price: parseFloat(itemForm.price)
      };

      if (editingItem) {
        await menuAPI.updateItem(editingItem.id, itemData);
      } else {
        await menuAPI.createItem(itemData);
      }
      // Refresh menu items
      const response = await menuAPI.getAllItems();
      setMenuItems(response.data);
      // Reset form
      setItemForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_available: true
      });
      setShowItemForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving menu item:', err);
      alert('Failed to save menu item. Please try again.');
    }
  };

  // Delete handlers
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? All menu items in this category will also be deleted.')) {
      return;
    }

    try {
      await menuAPI.deleteCategory(categoryId);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      // Refresh menu items as some might have been deleted
      const response = await menuAPI.getAllItems();
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      await menuAPI.deleteItem(itemId);
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <div className="space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCategoryForm(true);
                  setShowItemForm(false);
                }}
              >
                Add Category
              </Button>
              <Button
                onClick={() => {
                  setShowItemForm(true);
                  setShowCategoryForm(false);
                }}
              >
                Add Menu Item
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 p-4 rounded-md border border-red-300 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading menu data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Categories Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                {showCategoryForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <form onSubmit={handleCategorySubmit}>
                      <div className="space-y-4">
                        <Input
                          label="Category Name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({
                            ...categoryForm,
                            name: e.target.value
                          })}
                          required
                        />
                        <Input
                          label="Description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({
                            ...categoryForm,
                            description: e.target.value
                          })}
                        />
                        <div className="flex space-x-4">
                          <Button type="submit">
                            {editingCategory ? 'Update' : 'Add'} Category
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              setShowCategoryForm(false);
                              setEditingCategory(null);
                              setCategoryForm({ name: '', description: '' });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                  {categories.map(category => (
                    <div key={category.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryForm({
                                name: category.name,
                                description: category.description || ''
                              });
                              setShowCategoryForm(true);
                              setShowItemForm(false);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="p-4 text-gray-500">No categories found</p>
                  )}
                </div>
              </div>

              {/* Menu Items Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
                {showItemForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <form onSubmit={handleItemSubmit}>
                      <div className="space-y-4">
                        <Input
                          label="Item Name"
                          value={itemForm.name}
                          onChange={(e) => setItemForm({
                            ...itemForm,
                            name: e.target.value
                          })}
                          required
                        />
                        <Input
                          label="Description"
                          value={itemForm.description}
                          onChange={(e) => setItemForm({
                            ...itemForm,
                            description: e.target.value
                          })}
                        />
                        <Input
                          label="Price"
                          type="number"
                          step="0.01"
                          value={itemForm.price}
                          onChange={(e) => setItemForm({
                            ...itemForm,
                            price: e.target.value
                          })}
                          required
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={itemForm.category_id}
                            onChange={(e) => setItemForm({
                              ...itemForm,
                              category_id: e.target.value
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Input
                          label="Image URL"
                          value={itemForm.image_url}
                          onChange={(e) => setItemForm({
                            ...itemForm,
                            image_url: e.target.value
                          })}
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="is_available"
                            checked={itemForm.is_available}
                            onChange={(e) => setItemForm({
                              ...itemForm,
                              is_available: e.target.checked
                            })}
                            className="h-4 w-4 text-primary-600"
                          />
                          <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">
                            Available for ordering
                          </label>
                        </div>
                        <div className="flex space-x-4">
                          <Button type="submit">
                            {editingItem ? 'Update' : 'Add'} Menu Item
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              setShowItemForm(false);
                              setEditingItem(null);
                              setItemForm({
                                name: '',
                                description: '',
                                price: '',
                                category_id: '',
                                image_url: '',
                                is_available: true
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                  {menuItems.map(item => (
                    <div key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          )}
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ${parseFloat(item.price).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Category: {categories.find(c => c.id === item.category_id)?.name}
                          </p>
                          {!item.is_available && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                              Not Available
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setItemForm({
                                name: item.name,
                                description: item.description || '',
                                price: item.price.toString(),
                                category_id: item.category_id,
                                image_url: item.image_url || '',
                                is_available: item.is_available
                              });
                              setShowItemForm(true);
                              setShowCategoryForm(false);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {menuItems.length === 0 && (
                    <p className="p-4 text-gray-500">No menu items found</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MenuManagementPage;