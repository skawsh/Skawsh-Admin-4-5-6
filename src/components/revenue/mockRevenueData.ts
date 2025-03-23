
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
  
  // Calculate markup revenue (subtotal - 10%)
  const markupRevenue = Math.round(totalRevenue * 0.9);
  
  // Set delivery fee as 50 per order
  const deliveryFee = 50;
  const totalDeliveryRevenue = orders.length * deliveryFee;
  
  // Calculate taxes
  const subtotalTaxRate = 0.18; // 18%
  const deliveryTaxRate = 0.05; // 5%
  
  const subtotalTax = Math.round((totalRevenue - totalDeliveryRevenue) * subtotalTaxRate);
  const deliveryTax = Math.round(totalDeliveryRevenue * deliveryTaxRate);
  const totalTaxes = subtotalTax + deliveryTax;
  
  return {
    totalRevenue,
    pendingPayments,
    receivedPayments,
    pendingCount,
    markupRevenue,
    totalDeliveryRevenue,
    subtotalTax,
    deliveryTax,
    totalTaxes
  };
};

// Re-export the mockOrders data for direct access if needed
export { mockOrders };
