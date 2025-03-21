
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

interface RatingOverviewProps {
  averageRating: number;
  totalRatings: number;
  totalReviews: number;
}

export const RatingOverview: React.FC<RatingOverviewProps> = ({ 
  averageRating, 
  totalRatings, 
  totalReviews 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Average Rating</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
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
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-2">Total Reviews</h3>
          <div className="text-3xl font-bold">
            {totalReviews}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            reviews received
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
