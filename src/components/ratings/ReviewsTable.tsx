
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { StarRating } from './StarRating';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Review {
  id: number;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  hidden: boolean;
}

interface ReviewsTableProps {
  reviews: Review[];
  onViewOrderDetails: (orderId: string) => void;
  onHideReview: (reviewId: number) => void;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({ 
  reviews, 
  onViewOrderDetails, 
  onHideReview 
}) => {
  const [page, setPage] = React.useState(1);
  const reviewsPerPage = 8;
  
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice(
    (page - 1) * reviewsPerPage,
    page * reviewsPerPage
  );
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[40%]">Review</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((review) => (
                <TableRow key={review.id} className={review.hidden ? "bg-gray-50" : ""}>
                  <TableCell className="font-medium">{review.orderId}</TableCell>
                  <TableCell>{review.customerName}</TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} />
                  </TableCell>
                  <TableCell>
                    {review.hidden ? (
                      <span className="text-gray-400 italic">This review is hidden</span>
                    ) : (
                      review.comment || <span className="text-gray-400 italic">No comment provided</span>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(review.date), 'MMM d, yyyy h:mm a')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewOrderDetails(review.orderId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Order
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onHideReview(review.id)}
                      >
                        {review.hidden ? (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Show
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Hide
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No reviews found with the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={page === pageNum}
                  onClick={() => setPage(pageNum)}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
