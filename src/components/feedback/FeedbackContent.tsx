
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FeedbackTable } from '@/components/feedback/FeedbackTable';
import { ReportedStudiosTable } from '@/components/feedback/ReportedStudiosTable';
import { AlertTriangle } from 'lucide-react';
import { FeedbackItem, ReportedStudio, SortOrderType } from './FeedbackUtils';

interface FeedbackContentProps {
  activeTab: 'feedback' | 'reportedStudios';
  sortedFeedback: FeedbackItem[];
  reportedStudios: ReportedStudio[];
  sortOrder: SortOrderType;
}

export const FeedbackContent: React.FC<FeedbackContentProps> = ({
  activeTab,
  sortedFeedback,
  reportedStudios,
  sortOrder,
}) => {
  if (activeTab === 'feedback') {
    return (
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
              feedback={sortedFeedback}
              sortOrder={sortOrder}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Reported Studios
          </CardTitle>
          <CardDescription>
            Studios that have been reported by users for various issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportedStudiosTable 
            reportedStudios={reportedStudios}
          />
        </CardContent>
      </Card>
    </div>
  );
};
