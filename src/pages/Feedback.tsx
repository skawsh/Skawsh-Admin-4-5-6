
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { FeedbackFilters } from '@/components/feedback/FeedbackFilters';
import { FeedbackHeader } from '@/components/feedback/FeedbackHeader';
import { FeedbackStats } from '@/components/feedback/FeedbackStats';
import { FeedbackTabs } from '@/components/feedback/FeedbackTabs';
import { FeedbackContent } from '@/components/feedback/FeedbackContent';
import { useFeedbackFilters, calculateAverageRating } from '@/components/feedback/FeedbackUtils';
import { mockFeedback, mockReportedStudios } from '@/components/feedback/mockFeedbackData';

const Feedback = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'feedback' | 'reportedStudios'>('feedback');
  
  // Use our custom hook for feedback filtering and sorting
  const {
    selectedDateRange,
    setSelectedDateRange,
    customDateFrom,
    setCustomDateFrom,
    customDateTo,
    setCustomDateTo,
    selectedRating,
    setSelectedRating,
    sortOrder,
    setSortOrder,
    sortedFeedback
  } = useFeedbackFilters(mockFeedback);
  
  // Calculate metrics
  const averageRating = calculateAverageRating(mockFeedback);
  const totalRatings = mockFeedback.length;

  return (
    <Layout activeSection="feedback">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header with Back Button */}
        <FeedbackHeader title="Feedback" />
        
        {/* Rating Overview Section */}
        <FeedbackStats 
          averageRating={averageRating} 
          totalRatings={totalRatings} 
        />
        
        {/* Filters Section */}
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
        
        {/* Tab Navigation */}
        <FeedbackTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reportedStudiosCount={mockReportedStudios.length}
        />
        
        {/* Content based on active tab */}
        <FeedbackContent 
          activeTab={activeTab}
          sortedFeedback={sortedFeedback}
          reportedStudios={mockReportedStudios}
          sortOrder={sortOrder}
        />
      </div>
    </Layout>
  );
};

export default Feedback;
