
import { RevenueOrder } from './RevenueTable';
import { mockOrders } from './data/orderData';
import { filterOrdersByTime, TimeFilterType } from './utils/filterUtils';

// Function to filter orders based on time period
export const getFilteredOrders = (timeFilter: string) => {
  return filterOrdersByTime(mockOrders, timeFilter as TimeFilterType);
};

// Re-export the mockOrders data for direct access if needed
export { mockOrders };
