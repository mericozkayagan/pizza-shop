import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableAPI, orderAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import TableItem from '../components/tables/TableItem';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ServerPage = () => {
  const [tables, setTables] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not server or admin
  if (user && user.role !== 'server' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Fetch tables and ready orders
  const fetchData = async () => {
    setLoading(true);
    try {
      const [tablesResponse, ordersResponse] = await Promise.all([
        tableAPI.getAllTables(),
        orderAPI.getReadyOrders()
      ]);

      setTables(tablesResponse.data);
      setReadyOrders(ordersResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and every 30 seconds
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle table status update
  const handleTableStatusUpdate = async (tableId, newStatus) => {
    try {
      await tableAPI.updateTableStatus(tableId, { status: newStatus });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error updating table status:', err);
      alert('Failed to update table status. Please try again.');
    }
  };

  // Handle server assignment
  const handleAssignTable = async (tableId) => {
    try {
      await tableAPI.assignServer(tableId, { server_id: user.id });
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error assigning table:', err);
      alert('Failed to assign table. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Server Dashboard</h1>
          <Button
            variant="secondary"
            onClick={fetchData}
          >
            Refresh
          </Button>
        </div>

        {loading && tables.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-md border border-red-300 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <>
            {/* Ready Orders Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Orders Ready to Serve ({readyOrders.length})</h2>

              {readyOrders.length === 0 ? (
                <p className="text-gray-500">No orders are ready to be served at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {readyOrders.map(order => (
                    <div key={order.id} className="border border-green-200 bg-green-50 rounded-md p-4">
                      <div className="font-semibold text-green-800 mb-2">
                        Order #{order.id} - Table #{order.table_id}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                      <div className="text-sm mb-3">
                        {order.items && order.items.length} items
                      </div>
                      <Button
                        size="sm"
                        fullWidth
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tables Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Tables ({tables.length})</h2>

              <div className="relative border border-gray-300 rounded-md bg-gray-50 p-4" style={{ minHeight: '400px' }}>
                {tables.map(table => (
                  <div key={table.id} className="relative">
                    <TableItem table={table} />

                    {/* Table actions */}
                    {(table.server_id === user.id || !table.server_id) && (
                      <div className="absolute right-2 bottom-2 flex space-x-2">
                        {!table.server_id && (
                          <button
                            onClick={() => handleAssignTable(table.id)}
                            className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                          >
                            Assign to me
                          </button>
                        )}

                        {table.server_id === user.id && (
                          <>
                            {table.status === 'available' && (
                              <button
                                onClick={() => handleTableStatusUpdate(table.id, 'reserved')}
                                className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
                              >
                                Mark Reserved
                              </button>
                            )}
                            {table.status === 'occupied' && (
                              <button
                                onClick={() => handleTableStatusUpdate(table.id, 'available')}
                                className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                              >
                                Mark Available
                              </button>
                            )}
                            {table.status === 'reserved' && (
                              <button
                                onClick={() => handleTableStatusUpdate(table.id, 'occupied')}
                                className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                              >
                                Mark Occupied
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {tables.length === 0 && (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No tables available</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Reserved</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ServerPage;