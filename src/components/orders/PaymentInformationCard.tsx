
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RevenueOrder } from '@/components/revenue/RevenueTable';
import { format } from 'date-fns';

interface PaymentInformationCardProps {
  order: RevenueOrder;
  getPaymentStatusColor: (status: string) => string;
}

const PaymentInformationCard: React.FC<PaymentInformationCardProps> = ({ 
  order, 
  getPaymentStatusColor 
}) => {
  return (
    <Card className="p-6 border-l-4 border-l-indigo-500">
      <div className="flex items-center gap-2 text-xl font-semibold text-indigo-700 mb-6">
        <CreditCard className="h-6 w-6" />
        <h2>Payment Information</h2>
      </div>
      
      {order.paymentStatus === 'Pending' ? (
        <div className="text-center py-6 text-yellow-600">
          <p className="font-medium text-lg">Payment details will be shown after payment completion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="font-medium">Credit Card</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-medium">TXN123456789</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Date & Time</p>
            <p className="font-medium">{format(order.orderDate, 'dd MMM yyyy, h:mm a')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Payment Status</p>
            <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PaymentInformationCard;
