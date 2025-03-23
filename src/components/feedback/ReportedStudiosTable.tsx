
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
import { ReportedStudio } from './FeedbackUtils';

interface ReportedStudiosTableProps {
  reportedStudios: ReportedStudio[];
}

export const ReportedStudiosTable: React.FC<ReportedStudiosTableProps> = ({ 
  reportedStudios
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  
  const paginatedStudios = reportedStudios.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(reportedStudios.length / itemsPerPage);
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%] bg-gray-50 font-semibold">S.NO</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">User Name</TableHead>
              <TableHead className="w-[10%] bg-gray-50 font-semibold">Studio ID</TableHead>
              <TableHead className="w-[15%] bg-gray-50 font-semibold">Studio Name</TableHead>
              <TableHead className="w-[25%] bg-gray-50 font-semibold">Issue Reported</TableHead>
              <TableHead className="w-[10%] bg-gray-50 font-semibold">Reports Count</TableHead>
              <TableHead className="w-[20%] bg-gray-50 font-semibold">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudios.length > 0 ? (
              paginatedStudios.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-gray-50"
                >
                  <TableCell className="font-medium text-center">
                    {(page - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.studioId}</TableCell>
                  <TableCell>{item.studioName}</TableCell>
                  <TableCell>{item.issueReported}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium text-xs">
                      {item.reportsCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {format(new Date(item.date), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="font-medium">No reported studios found</p>
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
