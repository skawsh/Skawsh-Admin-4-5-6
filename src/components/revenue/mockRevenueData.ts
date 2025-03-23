
import { RevenueOrder } from './RevenueTable';

// Create mock data for revenue orders
export const mockOrders: RevenueOrder[] = [
  {
    id: 1,
    orderId: 'ORD-2025-001',
    orderDate: new Date(2025, 2, 20), // March 20, 2025
    washType: 'Regular',
    paymentStatus: 'Paid',
    amount: 450,
    deliveredDate: new Date(2025, 2, 22), // March 22, 2025
  },
  {
    id: 2,
    orderId: 'ORD-2025-002',
    orderDate: new Date(2025, 2, 21), // March 21, 2025
    washType: 'Express',
    paymentStatus: 'Paid',
    amount: 750,
    deliveredDate: new Date(2025, 2, 22), // March 22, 2025
  },
  {
    id: 3,
    orderId: 'ORD-2025-003',
    orderDate: new Date(2025, 2, 22), // March 22, 2025
    washType: 'Delicate',
    paymentStatus: 'Pending',
    amount: 800,
    deliveredDate: null,
  },
  {
    id: 4,
    orderId: 'ORD-2025-004',
    orderDate: new Date(2025, 2, 22), // March 22, 2025
    washType: 'Dry Clean',
    paymentStatus: 'Paid',
    amount: 1200,
    deliveredDate: new Date(2025, 2, 24), // March 24, 2025
  },
  {
    id: 5,
    orderId: 'ORD-2025-005',
    orderDate: new Date(2025, 2, 22), // March 22, 2025
    washType: 'Regular',
    paymentStatus: 'Failed',
    amount: 350,
    deliveredDate: null,
  },
  {
    id: 6,
    orderId: 'ORD-2025-006',
    orderDate: new Date(2025, 2, 23), // March 23, 2025
    washType: 'Express',
    paymentStatus: 'Paid',
    amount: 650,
    deliveredDate: new Date(2025, 2, 24), // March 24, 2025
  },
  {
    id: 7,
    orderId: 'ORD-2025-007',
    orderDate: new Date(2025, 2, 23), // March 23, 2025
    washType: 'Regular',
    paymentStatus: 'Pending',
    amount: 400,
    deliveredDate: null,
  },
];

// Function to filter orders based on time period
export const getFilteredOrders = (timeFilter: string) => {
  const now = new Date();
  
  switch (timeFilter) {
    case 'today':
      return mockOrders.filter(order => 
        order.orderDate.toDateString() === now.toDateString()
      );
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return mockOrders.filter(order => 
        order.orderDate.toDateString() === yesterday.toDateString()
      );
    }
    case 'last15Minutes': {
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);
      return mockOrders.filter(order => order.orderDate >= fifteenMinutesAgo);
    }
    case 'last60Minutes': {
      const sixtyMinutesAgo = new Date(now.getTime() - 60 * 60000);
      return mockOrders.filter(order => order.orderDate >= sixtyMinutesAgo);
    }
    case 'last4Hours': {
      const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60000);
      return mockOrders.filter(order => order.orderDate >= fourHoursAgo);
    }
    case 'last24Hours': {
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60000);
      return mockOrders.filter(order => order.orderDate >= twentyFourHoursAgo);
    }
    case 'daily': {
      // All orders from today
      return mockOrders.filter(order => 
        order.orderDate.toDateString() === now.toDateString()
      );
    }
    case 'weekly': {
      // Orders from the last 7 days
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return mockOrders.filter(order => order.orderDate >= sevenDaysAgo);
    }
    case 'monthly': {
      // Orders from the last 30 days
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return mockOrders.filter(order => order.orderDate >= thirtyDaysAgo);
    }
    case 'yearly': {
      // Orders from the last 365 days
      const yearAgo = new Date(now);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return mockOrders.filter(order => order.orderDate >= yearAgo);
    }
    case 'dateRange':
    case 'dateTimeRange':
      // For custom date ranges, we'll return all mock data in this example
      // In a real app, this would filter based on the actual date range
      return mockOrders;
    case 'all':
    default:
      return mockOrders;
  }
};
