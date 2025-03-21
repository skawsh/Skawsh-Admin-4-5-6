import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { ReviewsTable } from '@/components/ratings/ReviewsTable';
import { RatingOverview } from '@/components/ratings/RatingOverview';
import { RatingFilters } from '@/components/ratings/RatingFilters';
import { getStudioById } from '@/utils/studioUtils';

const StudioRatings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studio, setStudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [sortOption, setSortOption] = useState<string>("latest");

  useEffect(() => {
    if (id) {
      const foundStudio = getStudioById(parseInt(id));
      setStudio(foundStudio);
      
      const mockReviews = generateMockReviews(foundStudio);
      
      const validReviews = mockReviews.filter(review => 
        review.rating !== null || (review.comment && review.comment.trim() !== '')
      );
      
      setReviews(validReviews);
      setFilteredReviews(validReviews);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (reviews.length > 0) {
      let filtered = [...reviews];
      
      if (ratingFilter) {
        const rating = parseInt(ratingFilter);
        filtered = filtered.filter(review => review.rating === rating);
      }
      
      if (dateRange.from) {
        filtered = filtered.filter(review => {
          const reviewDate = new Date(review.date);
          return reviewDate >= dateRange.from!;
        });
      }
      
      if (dateRange.to) {
        filtered = filtered.filter(review => {
          const reviewDate = new Date(review.date);
          return reviewDate <= dateRange.to!;
        });
      }
      
      switch (sortOption) {
        case "latest":
          filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          break;
        case "highest":
          filtered = filtered.sort((a, b) => {
            if (a.rating === null && b.rating === null) return 0;
            if (a.rating === null) return 1;
            if (b.rating === null) return -1;
            return b.rating - a.rating;
          });
          break;
        case "lowest":
          filtered = filtered.sort((a, b) => {
            if (a.rating === null && b.rating === null) return 0;
            if (a.rating === null) return 1;
            if (b.rating === null) return -1;
            return a.rating - b.rating;
          });
          break;
        default:
          break;
      }
      
      setFilteredReviews(filtered);
    }
  }, [reviews, ratingFilter, dateRange, sortOption]);

  const handleBackClick = () => {
    navigate('/studios');
  };

  const handleViewOrderDetails = (orderId: string) => {
    toast({
      title: "View Order Details",
      description: `Viewing order details for order ${orderId}`,
    });
  };

  const handleHideReview = (reviewId: number) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId ? { ...review, hidden: !review.hidden } : review
    );
    
    setReviews(updatedReviews);
    
    toast({
      title: "Review Status Updated",
      description: `Review has been ${updatedReviews.find(r => r.id === reviewId)?.hidden ? 'hidden' : 'shown'}`,
    });
  };

  const generateMockReviews = (studio: any) => {
    if (!studio) return [];
    
    const names = [
      "John Smith", "Emma Johnson", "Michael Brown", "Sophia Martinez", 
      "William Davis", "Olivia Wilson", "James Taylor", "Ava Anderson", 
      "Robert Thomas", "Isabella Jackson", "David White", "Mia Harris",
      "Joseph Martin", "Charlotte Thompson", "Daniel Garcia", "Amelia Moore"
    ];
    
    const comments = [
      "Great service! My clothes came back perfectly clean.",
      "The laundry was done quickly and efficiently.",
      "Very satisfied with the quality of the service.",
      "Good job, but delivery was a bit late.",
      "Excellent service as always!",
      "The clothes smell fresh and are well folded.",
      "Average service, nothing special.",
      "Disappointed with the result, some stains remained.",
      "Fantastic experience from start to finish.",
      "Will definitely use this service again!",
      "Not bad, but prices are a bit high for the quality.",
      "Superb attention to detail.",
      "Clothing came back damaged, not happy.",
      "Highly professional service.",
      "Quick turnaround time, impressed!",
      "Staff was very friendly and helpful."
    ];
    
    const orderIdPrefix = studio.studioId.replace("STU", "ORD");
    
    return Array.from({ length: 20 }, (_, i) => {
      const reviewType = i % 4;
      
      let rating = null;
      let comment = "";
      
      if (reviewType === 0 || reviewType === 1 || reviewType === 3) {
        rating = Math.floor(Math.random() * 5) + 1;
      }
      
      if (reviewType === 0 || reviewType === 2 || reviewType === 3) {
        comment = comments[Math.floor(Math.random() * comments.length)];
      }
      
      const daysAgo = [
        0, 1, 2, 3, 4, 5, 6,
        10, 15, 20, 25,
        45, 60, 75, 90,
        120, 150, 180, 250, 300
      ][i % 20];
      
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      return {
        id: i + 1,
        orderId: `${orderIdPrefix}${(1000 + i).toString()}`,
        customerName: names[Math.floor(Math.random() * names.length)],
        rating: rating,
        comment: comment,
        date: date.toISOString(),
        hidden: false
      };
    }).filter(review => review.rating !== null || (review.comment && review.comment.trim() !== ''));
  };

  if (loading) {
    return (
      <Layout activeSection="studios">
        <div className="p-6">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!studio) {
    return (
      <Layout activeSection="studios">
        <div className="p-6">
          <p>Studio not found</p>
        </div>
      </Layout>
    );
  }

  const validReviews = reviews.filter(review => 
    review.rating !== null || (review.comment && review.comment.trim() !== '')
  );
  
  const averageRating = validReviews.reduce((acc, review) => 
    acc + (review.rating || 0), 0) / validReviews.filter(review => review.rating !== null).length;
  
  const totalRatings = validReviews.filter(review => review.rating !== null).length;
  const totalReviews = validReviews.filter(review => review.comment && review.comment.trim() !== '').length;

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleBackClick}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{studio.studioName} - Ratings & Reviews</h1>
            <p className="text-sm text-gray-500">Manage and monitor customer feedback</p>
          </div>
        </div>

        <RatingOverview 
          averageRating={averageRating} 
          totalRatings={totalRatings} 
          totalReviews={totalReviews} 
        />

        <RatingFilters
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        <ReviewsTable 
          reviews={filteredReviews} 
          onViewOrderDetails={handleViewOrderDetails}
          onHideReview={handleHideReview}
        />
      </div>
    </Layout>
  );
};

export default StudioRatings;
