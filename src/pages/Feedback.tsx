
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { FeedbackTable } from '@/components/feedback/FeedbackTable';
import { FeedbackFilters } from '@/components/feedback/FeedbackFilters';
import { RatingOverview } from '@/components/ratings/RatingOverview';

// Updated mock data for feedback - all with "App Experience" category
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
    category: "App Experience",
    date: "2023-09-13T16:45:00",
    flagged: false
  },
  {
    id: 4,
    userName: "Emily Davis",
    rating: 5,
    feedbackText: "Customer support was excellent! Had an issue with my order and they resolved it immediately.",
    category: "App Experience",
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
    category: "App Experience",
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
    category: "App Experience",
    date: "2023-09-07T10:30:00",
    flagged: false
  },
  {
    id: 10,
    userName: "Jennifer Jackson",
    rating: 2,
    feedbackText: "Had trouble reaching customer support. Waited for over an hour on the phone.",
    category: "App Experience",
    date: "2023-09-06T13:15:00",
    flagged: false
  },
  {
    id: 11,
    userName: "Kevin Richardson",
    rating: 4,
    feedbackText: "Great app interface, easy to navigate and place orders.",
    category: "App Experience",
    date: "2023-09-05T09:45:00",
    flagged: false
  },
  {
    id: 12,
    userName: "Michelle Garcia",
    rating: 3,
    feedbackText: "App works fine but could use some UI improvements for better user experience.",
    category: "App Experience",
    date: "2023-09-04T16:20:00",
    flagged: false
  },
  {
    id: 13,
    userName: "Charles Rodriguez",
    rating: 5,
    feedbackText: "Perfect service every time! The app is flawless and the delivery is always on time.",
    category: "App Experience",
    date: "2023-09-03T11:30:00",
    flagged: false
  },
  {
    id: 14,
    userName: "Patricia Lewis",
    rating: 2,
    feedbackText: "App crashes frequently when trying to schedule pickups.",
    category: "App Experience",
    date: "2023-09-02T14:10:00",
    flagged: false
  },
  {
    id: 15,
    userName: "Thomas Lee",
    rating: 4,
    feedbackText: "Very good experience with the app. Scheduling is easy and tracking works well.",
    category: "App Experience",
    date: "2023-09-01T10:05:00",
    flagged: false
  }
];

const Feedback = () => {
  // Calculate average rating
  const totalRatings = mockFeedback.length;
  const averageRating = mockFeedback.reduce((sum, item) => sum + item.rating, 0) / totalRatings;

  // Filter states
  const [selectedDateRange, setSelectedDateRange] = useState<'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom'>('last30days');
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(undefined);
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState('all');
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
    
    return true;
  });

  return (
    <Layout activeSection="feedback">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        </div>
        
        {/* Rating Overview Section - Removed Total Reviews tile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Average Rating</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                based on {totalRatings} customer ratings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2">Total Ratings</h3>
              <div className="text-3xl font-bold">
                {totalRatings}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ratings received
              </p>
            </CardContent>
          </Card>
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
