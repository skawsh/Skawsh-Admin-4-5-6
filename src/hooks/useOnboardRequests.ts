
import { useState } from 'react';
import { format } from 'date-fns';
import { OnboardRequest } from '@/types/onboard-requests';

export const useOnboardRequests = () => {
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  
  const [requests, setRequests] = useState<OnboardRequest[]>([
    {
      id: 1,
      studioName: 'Fresh Laundry Services',
      ownerName: 'John Doe',
      mobileNumber: '+91 9876543210',
      emailId: 'john@freshlaundry.com',
      requestDate: new Date(2025, 2, 15),
      status: 'pending'
    },
    {
      id: 2,
      studioName: 'SparkClean Laundromat',
      ownerName: 'Jane Smith',
      mobileNumber: '+91 9876543211',
      emailId: 'jane@sparkclean.com',
      requestDate: new Date(2025, 2, 14),
      status: 'pending'
    },
    {
      id: 3,
      studioName: 'Urban Wash Studio',
      ownerName: 'Mike Johnson',
      mobileNumber: '+91 9876543212',
      emailId: 'mike@urbanwash.com',
      requestDate: new Date(2025, 2, 10),
      status: 'approved'
    },
    {
      id: 4,
      studioName: 'Bubble & Fold',
      ownerName: 'Sarah Williams',
      mobileNumber: '+91 9876543213',
      emailId: 'sarah@bubblefold.com',
      requestDate: new Date(2025, 2, 5),
      status: 'rejected'
    }
  ]);

  const handleStatusChange = (requestId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
  };

  const toggleFilterExpansion = (filterId: string) => {
    setExpandedFilter(expandedFilter === filterId ? null : filterId);
  };
  
  const handleFilterChange = (value: string) => {
    setTimeFilter(value);
  };
  
  const handleDateRangeSelect = () => {
    if (dateRange.from && dateRange.to) {
      console.log(`Selected date range: ${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}`);
      setTimeFilter('dateRange');
      setExpandedFilter(null);
    }
  };

  const filterRequestsByDate = (requests: OnboardRequest[]): OnboardRequest[] => {
    if (timeFilter === 'all') return requests;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    switch (timeFilter) {
      case 'today':
        return requests.filter(request => request.requestDate >= today);
      case 'yesterday':
        return requests.filter(request => 
          request.requestDate >= yesterday && request.requestDate < today
        );
      case 'weekly':
        return requests.filter(request => request.requestDate >= startOfWeek);
      case 'monthly':
        return requests.filter(request => request.requestDate >= startOfMonth);
      case 'yearly':
        return requests.filter(request => request.requestDate >= startOfYear);
      case 'weekToDate':
        return requests.filter(request => request.requestDate >= startOfWeek);
      case 'monthToDate':
        return requests.filter(request => request.requestDate >= startOfMonth);
      case 'yearToDate':
        return requests.filter(request => request.requestDate >= startOfYear);
      case 'last7Days':
        return requests.filter(request => request.requestDate >= sevenDaysAgo);
      case 'last30Days':
        return requests.filter(request => request.requestDate >= thirtyDaysAgo);
      case 'dateRange':
        return requests.filter(request => 
          dateRange.from && dateRange.to && 
          request.requestDate >= dateRange.from && 
          request.requestDate <= dateRange.to
        );
      default:
        return requests;
    }
  };

  const filteredRequests = filterRequestsByDate(requests);
  const pendingRequests = filteredRequests.filter(request => request.status === 'pending');
  const reviewedRequests = filteredRequests.filter(request => request.status === 'approved' || request.status === 'rejected');

  return {
    requests,
    pendingRequests,
    reviewedRequests,
    timeFilter,
    dateRange,
    expandedFilter,
    handleStatusChange,
    handleFilterChange,
    toggleFilterExpansion,
    setDateRange,
    handleDateRangeSelect
  };
};
