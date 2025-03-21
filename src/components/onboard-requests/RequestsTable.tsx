
import React from 'react';
import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { StatusDropdown } from './StatusDropdown';
import { OnboardRequest } from '@/types/onboard-requests';

interface RequestsTableProps {
  requests: OnboardRequest[];
  onStatusChange: (requestId: number, newStatus: 'pending' | 'approved' | 'rejected') => void;
}

export const RequestsTable: React.FC<RequestsTableProps> = ({ requests, onStatusChange }) => {
  return (
    <Card className="mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">S.No</TableHead>
            <TableHead>Studio Name</TableHead>
            <TableHead>Owner Name</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{request.studioName}</TableCell>
                <TableCell>{request.ownerName}</TableCell>
                <TableCell>{request.mobileNumber}</TableCell>
                <TableCell>{request.emailId}</TableCell>
                <TableCell>{format(request.requestDate, 'dd MMM yyyy')}</TableCell>
                <TableCell>
                  <StatusDropdown 
                    requestId={request.id} 
                    status={request.status} 
                    onStatusChange={onStatusChange}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
