
import { RevenueOrder } from './RevenueTable';
import { mockOrders } from './data/orderData';
import { filterOrdersByTime, TimeFilterType } from './utils/filterUtils';

// Function to filter orders based on time period
export const getFilteredOrders = (timeFilter: string) => {
  return filterOrdersByTime(mockOrders, timeFilter as TimeFilterType);
};

// Calculate additional revenue metrics
export const calculateRevenueMetrics = (orders: RevenueOrder[]) => {
  // Calculate basic totals
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingPayments = orders
    .filter(order => order.paymentStatus === 'Pending')
    .reduce((sum, order) => sum + order.amount, 0);
  const receivedPayments = totalRevenue - pendingPayments;
  const pendingCount = orders.filter(order => order.paymentStatus === 'Pending').length;
  
  // Calculate markup revenue (subtotal + 10%)
  // First, we calculate the base subtotal (without delivery fees)
  const baseSubtotal = Math.round(totalRevenue * 0.85); // Assuming 15% of total is delivery
  const markupRevenue = Math.round(baseSubtotal * 1.1); // 10% markup on the subtotal
  
  // Delivery revenue calculation - varies by order based on distance
  const totalDeliveryRevenue = Math.round(totalRevenue * 0.15); // Assuming 15% of total amount
  
  // Calculate taxes
  const servicesTaxRate = 0.18; // 18% on services
  const deliveryTaxRate = 0.05; // 5% on delivery
  
  const servicesTax = Math.round(baseSubtotal * servicesTaxRate);
  const deliveryTax = Math.round(totalDeliveryRevenue * deliveryTaxRate);
  
  return {
    totalRevenue,
    pendingPayments,
    receivedPayments,
    pendingCount,
    markupRevenue,
    totalDeliveryRevenue,
    servicesTax,
    deliveryTax
  };
};

// Re-export the mockOrders data for direct access if needed
export { mockOrders };
