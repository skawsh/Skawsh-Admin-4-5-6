
import React, { useState } from 'react';
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
import { Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

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
  const [ordersData, setOrdersData] = useState<RevenueOrder[]>(orders);
  
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

  const updateOrderStatus = (orderId: string, newStatus: 'Paid' | 'Pending' | 'Failed') => {
    const updatedOrders = ordersData.map(order => {
      if (order.orderId === orderId) {
        return { ...order, paymentStatus: newStatus };
      }
      return order;
    });
    
    setOrdersData(updatedOrders);
    
    // Show success toast
    toast({
      title: "Status Updated",
      description: `Order #${orderId} payment status changed to ${newStatus}`,
      variant: newStatus === 'Paid' ? 'default' : newStatus === 'Pending' ? 'warning' : 'destructive',
    });
  };

  // Get the next status in the cycle
  const getStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending':
        return [{ label: 'Mark as Paid', value: 'Paid' }, { label: 'Mark as Failed', value: 'Failed' }];
      case 'Paid':
        return [{ label: 'Mark as Pending', value: 'Pending' }, { label: 'Mark as Failed', value: 'Failed' }];
      case 'Failed':
        return [{ label: 'Mark as Pending', value: 'Pending' }, { label: 'Mark as Paid', value: 'Paid' }];
      default:
        return [{ label: 'Mark as Paid', value: 'Paid' }];
    }
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
          {ordersData.map((order, index) => (
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
                <div className="flex justify-end gap-2">
                  {/* Status button with dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Status</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {getStatusOptions(order.paymentStatus).map((option) => (
                        <DropdownMenuItem 
                          key={option.value}
                          onClick={() => updateOrderStatus(order.orderId, option.value as 'Paid' | 'Pending' | 'Failed')}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
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
          ))}
          {ordersData.length === 0 && (
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
