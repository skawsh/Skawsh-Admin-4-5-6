
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { StatusDropdown } from './StatusDropdown';
import { RevenueOrder } from '../types/RevenueTypes';

interface RevenueTableRowProps {
  order: RevenueOrder;
  index: number;
  onStatusChange: (orderId: string, newStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded') => void;
}

export const RevenueTableRow: React.FC<RevenueTableRowProps> = ({ 
  order, 
  index,
  onStatusChange
}) => {
  const navigate = useNavigate();

  const handleViewOrderDetails = (orderId: string) => {
    navigate(`/orders/${orderId}/details`);
  };

  // Format amount to INR currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>#{order.orderId}</TableCell>
      <TableCell>{format(order.orderDate, 'dd MMM yyyy')}</TableCell>
      <TableCell>{order.washType}</TableCell>
      <TableCell>
        <PaymentStatusBadge status={order.paymentStatus} />
      </TableCell>
      <TableCell>{formatAmount(order.amount)}</TableCell>
      <TableCell>
        {order.deliveredDate 
          ? format(order.deliveredDate, 'dd MMM yyyy') 
          : '-'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {/* Status dropdown */}
          <StatusDropdown 
            currentStatus={order.paymentStatus}
            orderId={order.orderId}
            onStatusChange={onStatusChange}
          />
          
          {/* Order details button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleViewOrderDetails(order.orderId)}
          >
            <Eye className="h-4 w-4" />
            <span>Order Details</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
