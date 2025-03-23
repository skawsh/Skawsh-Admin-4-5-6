
import { RevenueOrder } from './types/RevenueTypes';
import { mockOrders } from './data/orderData';
import { filterOrdersByTime, TimeFilterType } from './utils/filterUtils';

// Function to filter orders based on time period
export const getFilteredOrders = (timeFilter: string) => {
  return filterOrdersByTime(mockOrders, timeFilter as TimeFilterType);
};

// Calculate additional revenue metrics
export const calculateRevenueMetrics = (orders: RevenueOrder[]) => {
  // Calculate total order amounts from filtered orders
  const totalOrderAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingPayments = orders
    .filter(order => order.paymentStatus === 'Pending')
    .reduce((sum, order) => sum + order.amount, 0);
  const receivedPayments = orders
    .filter(order => order.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + order.amount, 0);
  const pendingCount = orders.filter(order => order.paymentStatus === 'Pending').length;
  
  // Calculate total service revenue - This is the sum of all service costs
  // Using 85% as approximation of each order's service cost
  // Fix: Ensure we're calculating the correct value by multiplying each order amount by 0.85 and then rounding
  const subtotal = orders.reduce((sum, order) => {
    const serviceAmount = Math.round(order.amount * 0.85);
    return sum + serviceAmount;
  }, 0);
  
  // Calculate markup revenue - 10% of subtotal
  const markupRevenue = Math.round(subtotal * 0.1);
  
  // Delivery revenue - varies by distance, approximated as flat fee
  const totalDeliveryRevenue = Math.round(totalOrderAmount * 0.05); // Using 5% approximation
  
  // Calculate taxes
  // Services Tax: 18% on subtotal
  const servicesTax = Math.round(subtotal * 0.18);
  
  // Delivery Tax: 5% on delivery revenue
  const deliveryTax = Math.round(totalDeliveryRevenue * 0.05);
  
  // Total revenue is the direct sum of all order amounts
  const totalRevenue = totalOrderAmount;
  
  return {
    totalRevenue,
    pendingPayments,
    receivedPayments,
    pendingCount,
    markupRevenue,
    totalDeliveryRevenue,
    servicesTax,
    deliveryTax,
    subtotal
  };
};

// Re-export the mockOrders data for direct access if needed
export { mockOrders };
