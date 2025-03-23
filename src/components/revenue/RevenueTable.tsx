
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define an order type for revenue data
export interface RevenueOrder {
  id: number;
  orderId: string;
  orderDate: Date;
  washType: 'Standard' | 'Express' | 'Standard & Express';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  amount: number;
  deliveredDate: Date | null;
}

interface RevenueTableProps {
  orders: RevenueOrder[];
}

export const RevenueTable: React.FC<RevenueTableProps> = ({ orders }) => {
  const navigate = useNavigate();
  
  // Function to determine badge color based on payment status
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">S.No</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Ordered Date</TableHead>
            <TableHead>Wash Type</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Grand Total</TableHead>
            <TableHead>Delivered Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>#{order.orderId}</TableCell>
              <TableCell>{format(order.orderDate, 'dd MMM yyyy')}</TableCell>
              <TableCell>{order.washType}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getPaymentStatusColor(order.paymentStatus)}
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>{formatAmount(order.amount)}</TableCell>
              <TableCell>
                {order.deliveredDate 
                  ? format(order.deliveredDate, 'dd MMM yyyy') 
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleViewOrderDetails(order.orderId)}
                >
                  <Eye className="h-4 w-4" />
                  <span>Order Details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No revenue data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
