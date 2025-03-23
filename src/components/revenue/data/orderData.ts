import { RevenueOrder } from '../RevenueTable';

// Create mock data for revenue orders
export const mockOrders: RevenueOrder[] = [
  {
    id: 1,
    orderId: 'ORD-RT001',
    orderDate: new Date(2025, 2, 23), // March 23, 2025
    washType: 'Express',
    paymentStatus: 'Paid',
    amount: 3000,
    deliveredDate: null,
  },
  {
    id: 2,
    orderId: 'ORD-RT002',
    orderDate: new Date(2025, 2, 21), // March 21, 2025
    washType: 'Standard',
    paymentStatus: 'Paid',
    amount: 750,
    deliveredDate: new Date(2025, 2, 22), // March 22, 2025
  },
  {
    id: 3,
    orderId: 'ORD-RT003',
    orderDate: new Date(2025, 2, 22), // March 22, 2025
    washType: 'Standard & Express',
    paymentStatus: 'Pending',
    amount: 800,
    deliveredDate: null,
  },
  {
    id: 4,
    orderId: 'ORD-RT004',
    orderDate: new Date(2025, 2, 22), // March 22, 2025
    washType: 'Express',
    paymentStatus: 'Paid',
    amount: 1200,
    deliveredDate: new Date(2025, 2, 24), // March 24, 2025
  },
  {
    id: 5,
    orderId: 'ORD-RT005',
    orderDate: new Date(2025, 2, 22), // March 22, 2025
    washType: 'Standard',
    paymentStatus: 'Failed',
    amount: 350,
    deliveredDate: null,
  },
  {
    id: 6,
    orderId: 'ORD-RT006',
    orderDate: new Date(2025, 2, 23), // March 23, 2025
    washType: 'Express',
    paymentStatus: 'Paid',
    amount: 650,
    deliveredDate: new Date(2025, 2, 24), // March 24, 2025
  },
  {
    id: 7,
    orderId: 'ORD-RT007',
    orderDate: new Date(2025, 2, 23), // March 23, 2025
    washType: 'Standard & Express',
    paymentStatus: 'Pending',
    amount: 400,
    deliveredDate: null,
  },
  {
    id: 8,
    orderId: 'ORD-RT008',
    orderDate: new Date(2025, 2, 10), // March 10, 2025 - for monthly view
    washType: 'Standard',
    paymentStatus: 'Paid',
    amount: 1500,
    deliveredDate: new Date(2025, 2, 12), // March 12, 2025
  },
  {
    id: 9,
    orderId: 'ORD-RT009',
    orderDate: new Date(2025, 1, 15), // February 15, 2025 - for monthly view
    washType: 'Express',
    paymentStatus: 'Paid',
    amount: 2100,
    deliveredDate: new Date(2025, 1, 16), // February 16, 2025
  },
  {
    id: 10,
    orderId: 'ORD-RT010',
    orderDate: new Date(2025, 0, 5), // January 5, 2025 - for yearly view
    washType: 'Standard & Express',
    paymentStatus: 'Paid',
    amount: 3200,
    deliveredDate: new Date(2025, 0, 7), // January 7, 2025
  },
  {
    id: 11,
    orderId: 'ORD-RT011',
    orderDate: new Date(new Date().setMinutes(new Date().getMinutes() - 10)), // 10 minutes ago - for last15Minutes view
    washType: 'Express',
    paymentStatus: 'Pending',
    amount: 1935.78, // Updated to match calculated grand total (400 + 1196 + 50 + 287.28 + 2.50 = 1935.78)
    deliveredDate: null,
  },
  {
    id: 12,
    orderId: 'ORD-RT012',
    orderDate: new Date(new Date().setMinutes(new Date().getMinutes() - 30)), // 30 minutes ago - for last60Minutes view
    washType: 'Standard',
    paymentStatus: 'Paid',
    amount: 850,
    deliveredDate: null,
  },
  {
    id: 13,
    orderId: 'ORD-RT013',
    orderDate: new Date(new Date().setHours(new Date().getHours() - 2)), // 2 hours ago - for last4Hours view
    washType: 'Standard & Express',
    paymentStatus: 'Paid',
    amount: 2400,
    deliveredDate: null,
  },
  {
    id: 14,
    orderId: 'ORD-RT014',
    orderDate: new Date(new Date().setHours(new Date().getHours() - 18)), // 18 hours ago - for last24Hours view
    washType: 'Express',
    paymentStatus: 'Failed',
    amount: 300,
    deliveredDate: null,
  },
  {
    id: 15,
    orderId: 'ORD-RT015',
    orderDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    washType: 'Standard',
    paymentStatus: 'Paid',
    amount: 1100,
    deliveredDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
];
