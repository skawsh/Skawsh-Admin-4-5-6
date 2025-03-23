
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
  
  // Calculate subtotal (base amount before delivery and taxes)
  // This represents the raw cost of services before any delivery fees or taxes
  const subtotal = Math.round(totalOrderAmount * 0.85); // Base subtotal (85% of order amount)
  
  // Delivery revenue calculation - varies by order based on distance
  const totalDeliveryRevenue = Math.round(totalOrderAmount * 0.15); // Assuming 15% of total amount
  
  // Calculate taxes
  const servicesTaxRate = 0.18; // 18% on services
  const deliveryTaxRate = 0.05; // 5% on delivery
  
  const servicesTax = Math.round(subtotal * servicesTaxRate);
  const deliveryTax = Math.round(totalDeliveryRevenue * deliveryTaxRate);
  
  // Updated markup revenue calculation: subtotal - 90% of subtotal (which equals 10% of subtotal)
  const markupRevenue = Math.round(subtotal * 0.1);
  
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
