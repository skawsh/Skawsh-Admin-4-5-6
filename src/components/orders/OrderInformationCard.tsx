
import React from 'react';
import { Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { RevenueOrder } from '@/components/revenue/RevenueTable';

interface OrderInformationCardProps {
  order: RevenueOrder;
}

const OrderInformationCard: React.FC<OrderInformationCardProps> = ({ order }) => {
  return (
    <Card className="p-6 border-l-4 border-l-green-500">
      <div className="flex items-center gap-2 text-xl font-semibold text-green-700 mb-6">
        <Package className="h-6 w-6" />
        <h2>Order Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
        <div>
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="font-medium">{order.orderId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ordered Date & Time</p>
          <p className="font-medium">{format(order.orderDate, 'dd MMM yyyy, h:mm a')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Order Delivered Date & Time</p>
          <p className="font-medium">
            {order.deliveredDate ? format(order.deliveredDate, 'dd MMM yyyy, h:mm a') : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Wash Type</p>
          <p className="font-medium text-red-600">{order.washType}</p>
        </div>
      </div>
    </Card>
  );
};

export default OrderInformationCard;
