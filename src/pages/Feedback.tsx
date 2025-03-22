
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { FeedbackTable } from '@/components/feedback/FeedbackTable';
import { FeedbackFilters } from '@/components/feedback/FeedbackFilters';

// Mock data for feedback with order IDs
const mockFeedback = [
  {
    id: 1,
    userName: "Ava Anderson",
    orderId: "ORD10001000",
    rating: 3,
    feedbackText: "Disappointed with the result, some stains remained.",
    category: "Service Quality",
    date: "2023-03-22T12:07:00",
    flagged: false
  },
  {
    id: 2,
    userName: "Robert Thomas",
    orderId: "ORD10001001",
    rating: 2,
    feedbackText: "N/A",
    category: "App Experience",
    date: "2023-03-21T12:07:00",
    flagged: false
  },
  {
    id: 3,
    userName: "John Smith",
    orderId: "ORD10001002",
    rating: 0,
    feedbackText: "Good job, but delivery was a bit late.",
    category: "Service Quality",
    date: "2023-03-20T12:07:00",
    flagged: false
  },
  {
    id: 4,
    userName: "Mia Harris",
    orderId: "ORD10001003",
    rating: 3,
    feedbackText: "Clothing came back damaged, not happy.",
    category: "Service Quality",
    date: "2023-03-19T12:07:00",
    flagged: false
  },
  {
    id: 5,
    userName: "David Wilson",
    orderId: "ORD10001004",
    rating: 4,
    feedbackText: "App is good but needs more payment options.",
    category: "App Experience",
    date: "2023-03-11T12:00:00",
    flagged: false
  },
  {
    id: 6,
    userName: "Lisa Martinez",
    orderId: "ORD10001005",
    rating: 1,
    feedbackText: "Terrible experience. My clothes came back with stains.",
    category: "Service Quality",
    date: "2023-03-10T15:20:00",
    flagged: true
  },
  {
    id: 7,
    userName: "Robert Taylor",
    orderId: "ORD10001006",
    rating: 5,
    feedbackText: "Best laundry service I've ever used! Very convenient.",
    category: "App Experience",
    date: "2023-03-09T11:10:00",
    flagged: false
  },
  {
    id: 8,
    userName: "Amanda Anderson",
    orderId: "ORD10001007",
    rating: 4,
    feedbackText: "Love the app, but would like to see more discounts for regular users.",
    category: "App Experience",
    date: "2023-03-08T14:25:00",
    flagged: false
  },
  {
    id: 9,
    userName: "James Thomas",
    orderId: "ORD10001008",
    rating: 5,
    feedbackText: "The service is consistently excellent. Always on time and great quality.",
    category: "Service Quality",
    date: "2023-03-07T10:30:00",
    flagged: false
  },
  {
    id: 10,
    userName: "Jennifer Jackson",
    orderId: "ORD10001009",
    rating: 2,
    feedbackText: "Had trouble reaching customer support. Waited for over an hour on the phone.",
    category: "Customer Support",
    date: "2023-03-06T13:15:00",
    flagged: false
  }
];

const Feedback = () => {
  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState<'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom'>('last30days');
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(undefined);
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'highest' | 'lowest'>('latest');

  // Filter the feedback based on the selected filters
  const filteredFeedback = mockFeedback.filter(item => {
    const itemDate = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    
    // Date Range Filter
    if (selectedDateRange === 'today' && itemDate < today) {
      return false;
    } else if (selectedDateRange === 'yesterday' && (itemDate < yesterday || itemDate >= today)) {
      return false;
    } else if (selectedDateRange === 'last7days' && itemDate < last7Days) {
      return false;
    } else if (selectedDateRange === 'last30days' && itemDate < last30Days) {
      return false;
    } else if (selectedDateRange === 'custom' && customDateFrom && customDateTo) {
      const fromDate = new Date(customDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      
      const toDate = new Date(customDateTo);
      toDate.setHours(23, 59, 59, 999);
      
      if (itemDate < fromDate || itemDate > toDate) {
        return false;
      }
    }
    
    // Rating Filter
    if (selectedRating !== 'all' && item.rating !== parseInt(selectedRating)) {
      return false;
    }
    
    // Category Filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });

  // Calculate statistics
  const totalRatings = mockFeedback.length;
  const totalReviews = mockFeedback.filter(item => item.feedbackText && item.feedbackText !== "N/A").length;
  const averageRating = mockFeedback.reduce((sum, item) => sum + item.rating, 0) / totalRatings || 0;

  return (
    <Layout activeSection="feedback">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Average Rating</h3>
                <div className="flex items-center">
                  <span className="text-4xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                  <span className="text-yellow-400 text-2xl">★</span>
                </div>
                <p className="text-sm text-gray-500">based on {totalRatings} customer ratings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Total Ratings</h3>
                <div className="text-4xl font-bold">{totalRatings}</div>
                <p className="text-sm text-gray-500">ratings received</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Total Reviews</h3>
                <div className="text-4xl font-bold">{totalReviews}</div>
                <p className="text-sm text-gray-500">reviews received</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">Filter by:</span>
            <FeedbackFilters 
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              customDateFrom={customDateFrom}
              setCustomDateFrom={setCustomDateFrom}
              customDateTo={customDateTo}
              setCustomDateTo={setCustomDateTo}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
        </div>
        
        {/* Feedback Table */}
        <div>
          <FeedbackTable 
            feedback={filteredFeedback}
            sortOrder={sortOrder}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
