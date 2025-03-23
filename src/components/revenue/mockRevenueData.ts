
import { RevenueOrder } from './RevenueTable';
import { mockOrders } from './data/orderData';
import { filterOrdersByTime, TimeFilterType } from './utils/filterUtils';

// Function to filter orders based on time period
export const getFilteredOrders = (timeFilter: string) => {
  return filterOrdersByTime(mockOrders, timeFilter as TimeFilterType);
};

// Calculate additional revenue metrics
export const calculateRevenueMetrics = (orders: RevenueOrder[]) => {
  // Calculate total order amounts from raw data
  const totalOrderAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingPayments = orders
    .filter(order => order.paymentStatus === 'Pending')
    .reduce((sum, order) => sum + order.amount, 0);
  const receivedPayments = totalOrderAmount - pendingPayments;
  const pendingCount = orders.filter(order => order.paymentStatus === 'Pending').length;
  
  // Calculate subtotal - This is the base service cost
  // For example, ORD-RT011 has a subtotal of 1596 (based on item pricing)
  const subtotal = Math.round(totalOrderAmount * 0.85); // Using 85% as approximation for all orders
  
  // Calculate markup revenue - 10% of subtotal
  // For ORD-RT011, markup revenue would be 159.6 (10% of 1596)
  const markupRevenue = Math.round(subtotal * 0.1);
  
  // Delivery revenue - varies by distance, approximated as flat fee
  // This is the delivery fee (e.g., 50 per order)
  const totalDeliveryRevenue = Math.round(totalOrderAmount * 0.05); // Using 5% approximation
  
  // Calculate taxes
  // Services Tax: 18% on subtotal
  const servicesTax = Math.round(subtotal * 0.18);
  
  // Delivery Tax: 5% on delivery revenue
  const deliveryTax = Math.round(totalDeliveryRevenue * 0.05);
  
  // Calculate total revenue as the sum of components:
  // subtotal + delivery revenue + services tax + delivery tax
  const totalRevenue = subtotal + totalDeliveryRevenue + servicesTax + deliveryTax;
  
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
