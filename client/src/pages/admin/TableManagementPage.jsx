import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { tableAPI } from '../../api/api';

const TableManagementPage = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  // Form state
  const [tableForm, setTableForm] = useState({
    number: '',
    capacity: '',
    status: 'available',
    x_position: '',
    y_position: ''
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // Fetch tables
  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await tableAPI.getAllTables();
        setTables(response.data);
      } catch (err) {
        console.error('Error fetching tables:', err);
        setError('Failed to load tables');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Form handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tableData = {
        number: parseInt(tableForm.number),
        capacity: parseInt(tableForm.capacity),
        status: tableForm.status,
        x_position: parseInt(tableForm.x_position),
        y_position: parseInt(tableForm.y_position)
      };

      if (editingTable) {
        await tableAPI.updateTable(editingTable.id, tableData);
      } else {
        await tableAPI.createTable(tableData);
      }

      // Refresh tables list
      const response = await tableAPI.getAllTables();
      setTables(response.data);

      // Reset form
      setTableForm({
        number: '',
        capacity: '',
        status: 'available',
        x_position: '',
        y_position: ''
      });
      setShowForm(false);
      setEditingTable(null);
    } catch (err) {
      console.error('Error saving table:', err);
      alert('Failed to save table. Please try again.');
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!window.confirm('Are you sure you want to delete this table?')) {
      return;
    }

    try {
      await tableAPI.deleteTable(tableId);
      setTables(tables.filter(table => table.id !== tableId));
    } catch (err) {
      console.error('Error deleting table:', err);
      alert('Failed to delete table. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Table Management</h1>
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingTable(null);
                setTableForm({
                  number: '',
                  capacity: '',
                  status: 'available',
                  x_position: '',
                  y_position: ''
                });
              }}
            >
              Add Table
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 p-4 rounded-md border border-red-300 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading tables...</p>
            </div>
          ) : (
            <>
              {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Table Number"
                        type="number"
                        value={tableForm.number}
                        onChange={(e) => setTableForm({
                          ...tableForm,
                          number: e.target.value
                        })}
                        required
                      />
                      <Input
                        label="Capacity"
                        type="number"
                        value={tableForm.capacity}
                        onChange={(e) => setTableForm({
                          ...tableForm,
                          capacity: e.target.value
                        })}
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={tableForm.status}
                          onChange={(e) => setTableForm({
                            ...tableForm,
                            status: e.target.value
                          })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="reserved">Reserved</option>
                        </select>
                      </div>
                      <Input
                        label="Position X"
                        type="number"
                        value={tableForm.x_position}
                        onChange={(e) => setTableForm({
                          ...tableForm,
                          x_position: e.target.value
                        })}
                        required
                      />
                      <Input
                        label="Position Y"
                        type="number"
                        value={tableForm.y_position}
                        onChange={(e) => setTableForm({
                          ...tableForm,
                          y_position: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <Button type="submit">
                        {editingTable ? 'Update' : 'Add'} Table
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowForm(false);
                          setEditingTable(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Table Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Capacity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Server
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tables.map(table => (
                        <tr key={table.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            #{table.number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {table.capacity} seats
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              table.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : table.status === 'occupied'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {table.server_name || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ({table.x_position}, {table.y_position})
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingTable(table);
                                setTableForm({
                                  number: table.number.toString(),
                                  capacity: table.capacity.toString(),
                                  status: table.status,
                                  x_position: table.x_position.toString(),
                                  y_position: table.y_position.toString()
                                });
                                setShowForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTable(table.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={table.status === 'occupied'}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {tables.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No tables found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default TableManagementPage;