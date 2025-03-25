import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const TableItem = ({ table, isSelectable = false }) => {
  const navigate = useNavigate();
  const { setTableId } = useCart();

  const handleTableSelect = () => {
    if (isSelectable) {
      setTableId(table.id);
      navigate('/menu');
    }
  };

  // Define different styles based on table status
  const getTableStyle = () => {
    switch (table.status) {
      case 'available':
        return 'bg-green-100 border-green-600 hover:bg-green-200 shadow-green-200/50';
      case 'occupied':
        return 'bg-red-100 border-red-600 hover:bg-red-200 shadow-red-200/50';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-600 hover:bg-yellow-200 shadow-yellow-200/50';
      default:
        return 'bg-gray-100 border-gray-600 hover:bg-gray-200 shadow-gray-200/50';
    }
  };

  // Get table shape - round or rectangular
  const getTableShape = () => {
    // For a more varied restaurant layout, make tables with odd numbers round
    return table.number % 2 === 0 ? 'rounded-lg' : 'rounded-full';
  };

  return (
    <div
      className={`
        absolute border-2 shadow-lg transform transition-all duration-300
        ${getTableStyle()}
        ${getTableShape()}
        ${isSelectable ? 'cursor-pointer hover:scale-110 hover:shadow-xl z-10' : ''}
      `}
      style={{
        width: table.number % 2 === 0 ? '140px' : '120px',
        height: table.number % 2 === 0 ? '140px' : '120px',
        left: `${table.x_position}px`,
        top: `${table.y_position}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleTableSelect}
    >
      <div className="text-center p-3">
        <div className="text-2xl font-bold font-display">{table.number}</div>
        <div className="text-sm font-medium mt-1">{table.capacity} Seats</div>
        <div
          className={`
            text-xs mt-2 px-2 py-1 rounded-full mx-auto inline-block font-bold
            ${table.status === 'available' ? 'bg-green-200 text-green-800' :
              table.status === 'occupied' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}
          `}
        >
          {table.status}
        </div>
        {table.server_name && (
          <div className="text-xs mt-2 truncate max-w-[100px] mx-auto">
            <span className="font-semibold">Server:</span> {table.server_name}
          </div>
        )}
      </div>

      {/* Table legs or decoration */}
      {table.number % 2 === 0 && (
        <>
          <div className="absolute -bottom-3 left-7 h-3 w-2 bg-gray-700 rounded-b-lg"></div>
          <div className="absolute -bottom-3 right-7 h-3 w-2 bg-gray-700 rounded-b-lg"></div>
        </>
      )}
    </div>
  );
};

export default TableItem;