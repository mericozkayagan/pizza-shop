import React from 'react';
import { orderAPI } from '../../api/api';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'served':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const OrderItemRow = ({ item, orderId, onStatusUpdate }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      await orderAPI.updateItemStatus(orderId, item.id, newStatus);
      onStatusUpdate();
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  return (
    <div className="py-2 border-b last:border-b-0">
      <div className="flex justify-between items-start mb-1">
        <div>
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-gray-600">x{item.quantity}</span>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {item.notes && (
        <p className="text-sm text-gray-600 italic mb-2">{item.notes}</p>
      )}

      <div className="flex space-x-2 mt-2">
        {item.status === 'pending' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleStatusChange('preparing')}
          >
            Start Preparing
          </Button>
        )}

        {item.status === 'preparing' && (
          <Button
            size="sm"
            variant="success"
            onClick={() => handleStatusChange('ready')}
          >
            Mark as Ready
          </Button>
        )}

        {item.status === 'ready' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleStatusChange('served')}
          >
            Mark as Served
          </Button>
        )}

        {(item.status === 'pending' || item.status === 'preparing') && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleStatusChange('cancelled')}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

const OrderCard = ({ order, onStatusUpdate }) => {
  const orderTime = new Date(order.created_at).toLocaleTimeString();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order #{order.id} - Table {order.table_number}</CardTitle>
          <StatusBadge status={order.status} />
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Ordered at: {orderTime}
        </div>
      </CardHeader>

      <CardContent>
        <h4 className="font-medium mb-2">Items:</h4>
        <div className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <OrderItemRow
              key={item.id}
              item={item}
              orderId={order.id}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </div>

        {order.notes && (
          <div className="mt-4">
            <h4 className="font-medium mb-1">Order Notes:</h4>
            <p className="text-sm text-gray-600 italic">{order.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="text-sm text-gray-500">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;