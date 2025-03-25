import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tableAPI } from '../api/api';
import MainLayout from '../components/layout/MainLayout';
import TableItem from '../components/tables/TableItem';
import Button from '../components/ui/Button';

const SelectTablePage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  }, []);

  return (
    <MainLayout>
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

      <div className="max-w-6xl mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 bg-red-50 border-b border-red-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium text-gray-800">
                  Please select an available table to place your order
                </p>
              </div>
              <Button
                onClick={() => navigate('/menu')}
                className="whitespace-nowrap"
              >
                View Menu
              </Button>
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
                <Button
                  onClick={() => window.location.reload()}
                >
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

              <div className="relative border-2 border-gray-300 rounded-xl bg-gray-50 overflow-hidden" style={{ height: '600px', backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}>
                {tables.map((table) => (
                  <TableItem
                    key={table.id}
                    table={table}
                    isSelectable={table.status === 'available'}
                  />
                ))}

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

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">Can't find a suitable table? Please ask our staff for assistance</p>
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Call us:</span> (555) 123-4567
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SelectTablePage;