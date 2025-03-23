
import { RevenueOrder } from '../RevenueTable';

// Types of time filters available
export type TimeFilterType = 
  | 'all' 
  | 'today' 
  | 'yesterday' 
  | 'last15Minutes' 
  | 'last60Minutes' 
  | 'last4Hours' 
  | 'last24Hours'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'dateRange'
  | 'dateTimeRange';

// Function to filter orders based on time period
export const filterOrdersByTime = (orders: RevenueOrder[], timeFilter: TimeFilterType): RevenueOrder[] => {
  const now = new Date();
  
  switch (timeFilter) {
    case 'today':
      return orders.filter(order => 
        order.orderDate.toDateString() === now.toDateString()
      );
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return orders.filter(order => 
        order.orderDate.toDateString() === yesterday.toDateString()
      );
    }
    case 'last15Minutes': {
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);
      return orders.filter(order => order.orderDate >= fifteenMinutesAgo);
    }
    case 'last60Minutes': {
      const sixtyMinutesAgo = new Date(now.getTime() - 60 * 60000);
      return orders.filter(order => order.orderDate >= sixtyMinutesAgo);
    }
    case 'last4Hours': {
      const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60000);
      return orders.filter(order => order.orderDate >= fourHoursAgo);
    }
    case 'last24Hours': {
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60000);
      return orders.filter(order => order.orderDate >= twentyFourHoursAgo);
    }
    case 'daily': {
      // All orders from today
      return orders.filter(order => 
        order.orderDate.toDateString() === now.toDateString()
      );
    }
    case 'weekly': {
      // Orders from the last 7 days
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return orders.filter(order => order.orderDate >= sevenDaysAgo);
    }
    case 'monthly': {
      // Orders from the last 30 days
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orders.filter(order => order.orderDate >= thirtyDaysAgo);
    }
    case 'yearly': {
      // Orders from the last 365 days
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return orders.filter(order => order.orderDate >= yearAgo);
    }
    case 'dateRange':
    case 'dateTimeRange':
      // For custom date ranges, we'll return all mock data in this example
      // In a real app, this would filter based on the actual date range
      return orders;
    case 'all':
    default:
      return orders;
  }
};
