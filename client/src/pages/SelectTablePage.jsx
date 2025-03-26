import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import TableItem from '../components/tables/TableItem';
import Button from '../components/ui/Button';
import { useCart } from '../contexts/CartContext';

const SelectTablePage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setSelectedTableId } = useCart();

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
    const connectWebSocket = () => {
      try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
        const wsUrl = `${wsProtocol}//${wsHost}/ws/tables`;

        console.log('Connecting to WebSocket at:', wsUrl);
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle connection message
            if (data.type === 'connection') {
              console.log('WebSocket message:', data.message);
              return;
            }

            // Handle table update
            console.log('Table update received:', data);

            setTables(prevTables =>
              prevTables.map(table =>
                table.id === data.id ? data : table
              )
            );
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          // Try to reconnect with exponential backoff
          setTimeout(connectWebSocket, 3000);
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
        // Try to reconnect with exponential backoff
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

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
      // Use a try-catch block to handle any errors during table status update
      const response = await tableAPI.updateStatus(selectedTable.id, 'occupied');

      if (response && response.data) {
        console.log('Table status updated successfully:', response.data);

        // Store selected table ID in context
        setSelectedTableId(selectedTable.id);

        // Close the confirmation modal
        setIsConfirmModalOpen(false);

        // Navigate to the menu page
        navigate('/menu');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error updating table status:', err);

      // Display a more specific error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Failed to reserve table: ${err.response.data.message}`);
      } else {
        setError('Failed to reserve table. Please try again.');
      }

      // Keep the modal open if there was an error
      // setIsConfirmModalOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner with Texture Overlay */}
        <div className="relative overflow-hidden">
          {/* Main background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://img.freepik.com/free-photo/restaurant-interior_1127-3394.jpg)',
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
              <span className="text-white font-medium text-sm tracking-wide">Find Your Perfect Spot</span>
            </div>
            <h1 className="menu-banner-title mb-4 transform hover:scale-105 transition-transform duration-500 text-white">
              Select Your Table
            </h1>
            <p className="menu-banner-text max-w-2xl mx-auto text-white">
              Choose where you'd like to be seated and we'll bring your order right to you
            </p>

            {/* Table icon decoration */}
            <div className="absolute left-10 top-20 opacity-20 hidden lg:block">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                <path d="M22 10v12h-2v-12h-5.5v12h-2v-12h-5.5v12h-2v-12h-4v-2h19v2h-4zm-7.5-6h-1v3h1v-3zm-5 0h-1v3h1v-3zm11-4v2h-20v-2h20z"/>
              </svg>
            </div>

            <div className="absolute right-10 bottom-20 opacity-20 hidden lg:block">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                <path d="M22 10v12h-2v-12h-5.5v12h-2v-12h-5.5v12h-2v-12h-4v-2h19v2h-4zm-7.5-6h-1v3h1v-3zm-5 0h-1v3h1v-3zm11-4v2h-20v-2h20z"/>
              </svg>
            </div>
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
                    <p className="text-ui-bold text-lg">
                      Please select an available table
                    </p>
                    <p className="text-body-sm mt-1">
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
                  <p className="heading-5 text-gray-800 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="section-title">Restaurant Layout</h2>
                  <p className="text-body-sm">Click on an available table to select it</p>
                </div>

                <div className="relative border-2 border-gray-300 rounded-xl bg-gray-50 overflow-hidden" style={{
                  height: '500px',
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
                  backgroundSize: 'cover'
                }}>
                  <div className="absolute inset-0 bg-black/5"></div>

                  {/* Restaurant sections */}
                  <div className="absolute inset-x-6 top-6 bottom-6 border-2 border-dashed border-gray-400 rounded-lg p-4 overflow-hidden">
                    <div className="text-ui-bold text-gray-500 mb-4">Main Dining Area</div>

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
                        <p className="text-body-lg text-gray-500">No tables available at the moment</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-6 justify-center">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-green-500 mr-2 shadow-sm"></div>
                    <span className="text-ui">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-red-500 mr-2 shadow-sm"></div>
                    <span className="text-ui">Occupied</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-yellow-500 mr-2 shadow-sm"></div>
                    <span className="text-ui">Reserved</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="heading-6 text-gray-800">Real-time Updates</h3>
                      <p className="text-body-sm mt-1">Table availability is updated instantly</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <h3 className="heading-6 text-gray-800">Need Assistance?</h3>
                      <p className="text-body-sm mt-1">Call us: (555) 123-4567</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="heading-6 text-gray-800">Reservations</h3>
                      <p className="text-body-sm mt-1">Book in advance for special occasions</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="heading-4 mb-4">Confirm Table Selection</h3>
              <p className="text-body mb-6">
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
      </div>
    </MainLayout>
  );
};

export default SelectTablePage;