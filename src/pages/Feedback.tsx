
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { FeedbackTable } from '@/components/feedback/FeedbackTable';
import { FeedbackFilters } from '@/components/feedback/FeedbackFilters';

// Mock data for feedback
const mockFeedback = [
  {
    id: 1,
    userName: "John Smith",
    rating: 5,
    feedbackText: "The app is amazing! I've been using it for all my laundry needs. The delivery was prompt and my clothes came back perfectly clean. The user interface is also very intuitive and easy to navigate.",
    category: "App Experience",
    date: "2023-09-15T14:30:00",
    flagged: false
  },
  {
    id: 2,
    userName: "Sarah Johnson",
    rating: 4,
    feedbackText: "Good service overall. The app works well but sometimes lags when I'm trying to track my order.",
    category: "App Experience",
    date: "2023-09-14T10:15:00",
    flagged: false
  },
  {
    id: 3,
    userName: "Michael Brown",
    rating: 2,
    feedbackText: "Had issues with my last order. The delivery was late and some of my items were missing.",
    category: "Service Quality",
    date: "2023-09-13T16:45:00",
    flagged: false
  },
  {
    id: 4,
    userName: "Emily Davis",
    rating: 5,
    feedbackText: "Customer support was excellent! Had an issue with my order and they resolved it immediately.",
    category: "Customer Support",
    date: "2023-09-12T09:30:00",
    flagged: false
  },
  {
    id: 5,
    userName: "David Wilson",
    rating: 3,
    feedbackText: "App is good but needs more payment options.",
    category: "App Experience",
    date: "2023-09-11T12:00:00",
    flagged: false
  },
  {
    id: 6,
    userName: "Lisa Martinez",
    rating: 1,
    feedbackText: "Terrible experience. My clothes came back with stains and customer service didn't help at all. This is completely unacceptable and I demand a full refund for this horrible service. Will not be using this app again!",
    category: "Service Quality",
    date: "2023-09-10T15:20:00",
    flagged: true
  },
  {
    id: 7,
    userName: "Robert Taylor",
    rating: 5,
    feedbackText: "Best laundry service I've ever used! Very convenient.",
    category: "App Experience",
    date: "2023-09-09T11:10:00",
    flagged: false
  },
  {
    id: 8,
    userName: "Amanda Anderson",
    rating: 4,
    feedbackText: "Love the app, but would like to see more discounts for regular users.",
    category: "App Experience",
    date: "2023-09-08T14:25:00",
    flagged: false
  },
  {
    id: 9,
    userName: "James Thomas",
    rating: 5,
    feedbackText: "The service is consistently excellent. Always on time and great quality.",
    category: "Service Quality",
    date: "2023-09-07T10:30:00",
    flagged: false
  },
  {
    id: 10,
    userName: "Jennifer Jackson",
    rating: 2,
    feedbackText: "Had trouble reaching customer support. Waited for over an hour on the phone.",
    category: "Customer Support",
    date: "2023-09-06T13:15:00",
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

  return (
    <Layout activeSection="feedback">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Feedback Filters
            </CardTitle>
            <CardDescription>
              Filter and sort feedback to find the information you need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackFilters 
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              customDateFrom={customDateFrom}
              setCustomDateFrom={setCustomDateFrom}
              customDateTo={customDateTo}
              setCustomDateTo={setCustomDateTo}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
              <CardDescription>
                View and manage feedback submitted by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackTable 
                feedback={filteredFeedback}
                sortOrder={sortOrder}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
