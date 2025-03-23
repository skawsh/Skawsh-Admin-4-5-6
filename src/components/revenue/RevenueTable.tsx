
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody 
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { RevenueTableHeader } from './table/RevenueTableHeader';
import { RevenueTableRow } from './table/RevenueTableRow';
import { RevenueEmptyState } from './table/RevenueEmptyState';
import { RevenueOrder, RevenueUpdateEvent } from './types/RevenueTypes';

interface RevenueTableProps {
  orders: RevenueOrder[];
  onRevenueUpdate?: (event: RevenueUpdateEvent) => void;
}

export const RevenueTable: React.FC<RevenueTableProps> = ({ 
  orders,
  onRevenueUpdate 
}) => {
  const [ordersData, setOrdersData] = useState<RevenueOrder[]>(orders);

  // Update local state when props change
  useEffect(() => {
    setOrdersData(orders);
  }, [orders]);

  const updateOrderStatus = (orderId: string, newStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded') => {
    const updatedOrders = ordersData.map(order => {
      if (order.orderId === orderId) {
        return { ...order, paymentStatus: newStatus };
      }
      return order;
    });
    
    setOrdersData(updatedOrders);
    
    // Emit the update event for real-time updates
    if (onRevenueUpdate) {
      onRevenueUpdate({
        type: 'status-update',
        orderId,
        newStatus
      });
    }
    
    // Show success toast
    toast({
      title: "Status Updated",
      description: `Order #${orderId} payment status changed to ${newStatus}`,
      variant: newStatus === 'Paid' ? 'default' : 'destructive',
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <RevenueTableHeader />
        <TableBody>
          {ordersData.map((order, index) => (
            <RevenueTableRow 
              key={order.id}
              order={order}
              index={index}
              onStatusChange={updateOrderStatus}
            />
          ))}
          {ordersData.length === 0 && <RevenueEmptyState />}
        </TableBody>
      </Table>
    </div>
  );
};

// Re-export types for backward compatibility
export type { RevenueOrder, RevenueUpdateEvent };
