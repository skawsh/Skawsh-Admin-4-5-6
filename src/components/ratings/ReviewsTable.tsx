
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
  rating: number | null;
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
              <TableHead className="w-[12%] bg-gray-50 font-semibold">Order ID</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">Customer Name</TableHead>
              <TableHead className="w-[10%] bg-gray-50 font-semibold">Rating</TableHead>
              <TableHead className="w-[35%] bg-gray-50 font-semibold">Review</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">Date & Time</TableHead>
              <TableHead className="w-[13%] text-right bg-gray-50 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((review) => (
                <TableRow 
                  key={review.id} 
                  className={review.hidden ? "bg-gray-50 text-gray-500" : "hover:bg-gray-50"}
                >
                  <TableCell className="font-medium">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
                      {review.orderId}
                    </span>
                  </TableCell>
                  <TableCell>{review.customerName}</TableCell>
                  <TableCell>
                    {review.rating !== null ? (
                      <StarRating rating={review.rating} />
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {review.hidden ? (
                      <span className="text-gray-400 italic">This review is hidden</span>
                    ) : review.comment ? (
                      review.comment
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {format(new Date(review.date), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewOrderDetails(review.orderId)}
                        className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Order
                      </Button>
                      <Button
                        variant={review.hidden ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => onHideReview(review.id)}
                        className={review.hidden ? 
                          "bg-white hover:bg-blue-50 border-blue-200 text-blue-600" : 
                          "hover:bg-red-50 text-red-600"}
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
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="font-medium">No reviews found</p>
                    <p className="text-sm">Try adjusting your filters to see more results</p>
                  </div>
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
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-50"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={page === pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`cursor-pointer ${page === pageNum ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "hover:bg-gray-50"}`}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-gray-50"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
