import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import TableItem from '../components/tables/TableItem';
import Button from '../components/ui/Button';

const SelectTablePage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const response = await tableAPI.getAllTables();
        setTables(response.data);
      } catch (err) {
        console.error('Error fetching tables:', err);
        setError('Failed to load tables. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();

    // Set up real-time updates (using WebSocket)
    let ws;
    try {
      ws = new WebSocket('ws://localhost:8000/ws/tables');

      ws.onmessage = (event) => {
        const updatedTable = JSON.parse(event.data);
        setTables(prevTables =>
          prevTables.map(table =>
            table.id === updatedTable.id ? updatedTable : table
          )
        );
      };

      ws.onerror = (error) => {
        console.log('WebSocket error:', error);
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Calculate optimized table positions to prevent overlapping and overflow
  const tablesWithOptimizedPositions = useMemo(() => {
    // If no tables, return empty array
    if (!tables.length) return [];

    // Create a deep copy of tables to avoid mutating the original data
    const tablesCopy = JSON.parse(JSON.stringify(tables));

    // Get the dining area dimensions
    const diningAreaWidth = 700;  // Width of dining area in pixels (accounting for padding)
    const diningAreaHeight = 450; // Height of dining area in pixels (accounting for padding)

    // Calculate the maximum table size based on capacity
    const getMaxTableSize = (capacity) => {
      const baseSize = Math.min(100 + (capacity * 10), 160);
      return {
        width: baseSize,
        height: baseSize * 0.9
      };
    };

    // Find the table with maximum size to determine padding
    const maxTableSize = tablesCopy.reduce((max, table) => {
      const size = getMaxTableSize(table.capacity);
      return Math.max(max, size.width, size.height);
    }, 0);

    // Calculate padding to ensure tables don't overflow
    const padding = Math.ceil(maxTableSize / 2) + 20; // Half of max table size plus extra margin

    // Calculate the effective area where tables can be placed
    const effectiveWidth = diningAreaWidth - (padding * 2);
    const effectiveHeight = diningAreaHeight - (padding * 2);

    // Define spacing between tables (adjusted to fit more tables)
    const minSpacing = 140; // Minimum pixels between table centers

    // Calculate optimal grid layout
    const gridColumns = Math.max(1, Math.floor(effectiveWidth / minSpacing));
    const gridRows = Math.ceil(tablesCopy.length / gridColumns);

    // Determine actual spacing to distribute tables evenly
    const actualHSpacing = gridColumns > 1 ? effectiveWidth / (gridColumns - 1) : 0;
    const actualVSpacing = gridRows > 1 ? effectiveHeight / (gridRows - 1) : 0;

    // Calculate new positions for each table
    return tablesCopy.map((table, index) => {
      const row = Math.floor(index / gridColumns);
      const col = index % gridColumns;

      // Calculate centered positions with margin
      // If only one column/row, center the table(s)
      const x = gridColumns === 1
        ? diningAreaWidth / 2
        : padding + (col * (actualHSpacing > 0 ? actualHSpacing : effectiveWidth));

      const y = gridRows === 1
        ? diningAreaHeight / 2
        : padding + (row * (actualVSpacing > 0 ? actualVSpacing : effectiveHeight));

      // Update the table position
      return {
        ...table,
        optimizedX: x,
        optimizedY: y
      };
    });
  }, [tables]);

  const handleTableSelect = (table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmSelection = async () => {
    try {
      await tableAPI.updateStatus(selectedTable.id, 'occupied');
      setIsConfirmModalOpen(false);
      navigate('/menu');
    } catch (err) {
      console.error('Error updating table status:', err);
      setError('Failed to reserve table. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="w-full bg-[url('https://img.freepik.com/free-photo/wooden-table-product-background_53876-90321.jpg')] bg-cover bg-center py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-lg">
              Choose Your Table
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto drop-shadow-md">
              Select a table to enjoy our delicious menu at your preferred location
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 bg-red-50 border-b border-red-100">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      Please select an available table
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tables are updated in real-time
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate('/menu')}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    View Menu
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="whitespace-nowrap"
                  >
                    Refresh Tables
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64 bg-gray-50 p-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-6 border-t border-red-100">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-800 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 font-display">Restaurant Layout</h2>
                  <p className="text-gray-600">Click on an available table to select it</p>
                </div>

                <div className="relative border-2 border-gray-300 rounded-xl bg-gray-50 overflow-hidden" style={{
                  height: '500px',
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
                  backgroundSize: 'cover'
                }}>
                  <div className="absolute inset-0 bg-black/5"></div>

                  {/* Restaurant sections */}
                  <div className="absolute inset-x-6 top-6 bottom-6 border-2 border-dashed border-gray-400 rounded-lg p-4 overflow-hidden">
                    <div className="text-sm text-gray-500 font-medium mb-4">Main Dining Area</div>

                    {tablesWithOptimizedPositions.map((table) => (
                      <TableItem
                        key={table.id}
                        table={{
                          ...table,
                          x_position: table.optimizedX,
                          y_position: table.optimizedY
                        }}
                        isSelectable={table.status === 'available'}
                        onSelect={() => handleTableSelect(table)}
                        isSelected={selectedTable?.id === table.id}
                      />
                    ))}
                  </div>

                  {tables.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <p className="text-gray-500 text-lg">No tables available at the moment</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-6 justify-center">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-500 mr-2 shadow-sm"></div>
                    <span className="text-sm font-medium">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-red-500 mr-2 shadow-sm"></div>
                    <span className="text-sm font-medium">Occupied</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-500 mr-2 shadow-sm"></div>
                    <span className="text-sm font-medium">Reserved</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-semibold text-gray-800">Real-time Updates</h3>
                      <p className="text-sm text-gray-600 mt-1">Table availability is updated instantly</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <h3 className="font-semibold text-gray-800">Need Assistance?</h3>
                      <p className="text-sm text-gray-600 mt-1">Call us: (555) 123-4567</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="font-semibold text-gray-800">Reservations</h3>
                      <p className="text-sm text-gray-600 mt-1">Book in advance for special occasions</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Table Selection</h3>
            <p className="text-gray-600 mb-6">
              You are about to select Table {selectedTable?.number}. This table will be reserved for you while you place your order.
            </p>
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSelection}
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default SelectTablePage;