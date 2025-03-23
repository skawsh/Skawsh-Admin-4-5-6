
// Define an order type for revenue data
export interface RevenueOrder {
  id: number;
  orderId: string;
  orderDate: Date;
  washType: 'Standard' | 'Express' | 'Standard & Express';
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  amount: number;
  deliveredDate: Date | null;
}

// Define a custom event for real-time updates
export type RevenueUpdateEvent = {
  type: 'status-update';
  orderId: string;
  newStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
}
