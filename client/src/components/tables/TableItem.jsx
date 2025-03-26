import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const TableItem = ({ table, isSelectable = false, onSelect, isSelected = false }) => {
  const navigate = useNavigate();
  const { setTableId } = useCart();

  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect(table);
    }
  };

  // Define different styles based on table status and selection state
  const getTableStyle = () => {
    const baseStyle = 'transition-all duration-300 ease-in-out';

    if (isSelected) {
      return `${baseStyle} bg-blue-100 border-blue-600 shadow-blue-200/50`;
    }

    switch (table.status) {
      case 'available':
        return `${baseStyle} bg-green-100 border-green-600 shadow-green-200/50`;
      case 'occupied':
        return `${baseStyle} bg-red-100 border-red-600 shadow-red-200/50`;
      case 'reserved':
        return `${baseStyle} bg-yellow-100 border-yellow-600 shadow-yellow-200/50`;
      default:
        return `${baseStyle} bg-gray-100 border-gray-600 shadow-gray-200/50`;
    }
  };

  // Get table shape - round or rectangular
  const getTableShape = () => {
    return table.number % 2 === 0 ? 'rounded-lg' : 'rounded-full';
  };

  // Get hover effect styles
  const getHoverStyles = () => {
    if (!isSelectable) return '';
    return 'hover:scale-105 hover:shadow-xl hover:z-10 cursor-pointer';
  };

  // Get status indicator styles
  const getStatusStyles = () => {
    switch (table.status) {
      case 'available':
        return 'bg-green-200 text-green-800 border-green-300';
      case 'occupied':
        return 'bg-red-200 text-red-800 border-red-300';
      case 'reserved':
        return 'bg-yellow-200 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-200 text-gray-800 border-gray-300';
    }
  };

  // Calculate size based on capacity
  const getTableSize = () => {
    // Base size calculation increases with capacity
    const baseSize = Math.min(100 + (table.capacity * 10), 160);

    if (table.number % 2 === 0) {
      // Rectangular tables
      return {
        width: `${baseSize}px`,
        height: `${baseSize * 0.8}px`,
      };
    } else {
      // Round tables - slightly smaller
      return {
        width: `${baseSize * 0.9}px`,
        height: `${baseSize * 0.9}px`,
      };
    }
  };

  // Calculate z-index to ensure larger tables don't overlap smaller ones
  const getZIndex = () => {
    return isSelected ? 20 : 10 - table.capacity;
  };

  const size = getTableSize();

  return (
    <div
      className={`
        absolute border-2 shadow-lg transform
        ${getTableStyle()}
        ${getTableShape()}
        ${getHoverStyles()}
        ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
      `}
      style={{
        ...size,
        left: `${table.x_position}px`,
        top: `${table.y_position}px`,
        transform: `translate(-50%, -50%)`,
        zIndex: getZIndex(),
      }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center p-3">
          <div className="text-2xl font-bold font-display">{table.number}</div>
          <div className="text-sm font-medium mt-1">{table.capacity} Seats</div>
          <div
            className={`
              text-xs mt-2 px-2 py-1 rounded-full mx-auto inline-block font-bold border
              ${getStatusStyles()}
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
      </div>

      {/* Table decoration */}
      {table.number % 2 === 0 ? (
        <>
          {/* Rectangular table decorations */}
          <div className="absolute -bottom-3 left-1/4 h-3 w-2 bg-gray-700 rounded-b-lg"></div>
          <div className="absolute -bottom-3 right-1/4 h-3 w-2 bg-gray-700 rounded-b-lg"></div>
          <div className="absolute inset-3 border border-gray-300 rounded opacity-50"></div>
        </>
      ) : (
        <>
          {/* Round table decorations */}
          <div className="absolute inset-4 rounded-full border border-gray-300 opacity-50"></div>
          <div className="absolute inset-8 rounded-full border border-gray-300 opacity-30"></div>
        </>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default TableItem;