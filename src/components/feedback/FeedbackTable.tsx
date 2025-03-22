
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Eye, X } from 'lucide-react';
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
  orderId: string;
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
  const itemsPerPage = 8;
  
  // Apply sorting
  const sortedFeedback = [...feedback].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === 'highest') {
      return b.rating - a.rating;
    } else if (sortOrder === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });
  
  const totalPages = Math.ceil(sortedFeedback.length / itemsPerPage);
  const paginatedFeedback = sortedFeedback.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%] bg-gray-50 font-semibold">S.NO</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">Order ID</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">Customer Name</TableHead>
              <TableHead className="w-[10%] bg-gray-50 font-semibold">Rating</TableHead>
              <TableHead className="w-[25%] bg-gray-50 font-semibold">Review</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">Date & Time</TableHead>
              <TableHead className="w-[15%] text-right bg-gray-50 font-semibold">Actions</TableHead>
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
                  <TableCell>
                    <span className="font-mono text-xs bg-gray-100 py-1 px-2 rounded">
                      {item.orderId}
                    </span>
                  </TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>
                    {item.rating > 0 ? (
                      <StarRating rating={item.rating} />
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.feedbackText === "N/A" ? (
                      <span className="text-gray-400 italic">N/A</span>
                    ) : (
                      <span>{item.feedbackText}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {format(new Date(item.date), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-blue-600 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Order
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-red-600 flex items-center"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Hide
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
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
