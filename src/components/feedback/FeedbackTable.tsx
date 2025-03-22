
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { StarRating } from '@/components/ratings/StarRating';

interface FeedbackItem {
  id: number;
  userName: string;
  rating: number;
  feedbackText: string;
  category: string;
  date: string;
  flagged: boolean;
}

interface FeedbackTableProps {
  feedback: FeedbackItem[];
  sortOrder: 'latest' | 'highest' | 'lowest';
}

export const FeedbackTable: React.FC<FeedbackTableProps> = ({ 
  feedback,
  sortOrder
}) => {
  const [page, setPage] = useState(1);
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null);
  const itemsPerPage = 8;
  
  // No need to re-sort here - we're now receiving pre-sorted data
  const paginatedFeedback = feedback.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(feedback.length / itemsPerPage);
  
  const toggleExpand = (id: number) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%] bg-gray-50 font-semibold">S.NO</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">User Name</TableHead>
              <TableHead className="w-[10%] bg-gray-50 font-semibold">Rating</TableHead>
              <TableHead className="w-[45%] bg-gray-50 font-semibold">Feedback Text</TableHead>
              <TableHead className="w-[10%] bg-gray-50 font-semibold">Category</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFeedback.length > 0 ? (
              paginatedFeedback.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className={item.flagged ? "bg-red-50" : "hover:bg-gray-50"}
                >
                  <TableCell className="font-medium text-center">
                    {(page - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>
                    <StarRating rating={item.rating} />
                  </TableCell>
                  <TableCell>
                    {expandedFeedback === item.id 
                      ? item.feedbackText 
                      : (
                        <>
                          {item.feedbackText.length > 100 
                            ? `${item.feedbackText.substring(0, 100)}... `
                            : item.feedbackText
                          }
                          {item.feedbackText.length > 100 && (
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-blue-600"
                              onClick={() => toggleExpand(item.id)}
                            >
                              Read more
                            </Button>
                          )}
                        </>
                      )}
                    {expandedFeedback === item.id && item.feedbackText.length > 100 && (
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 ml-2"
                        onClick={() => toggleExpand(item.id)}
                      >
                        Show less
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {format(new Date(item.date), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="font-medium">No feedback found</p>
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
