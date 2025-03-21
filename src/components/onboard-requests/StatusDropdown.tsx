
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from './StatusBadge';
import { toast } from 'sonner';

interface StatusDropdownProps {
  requestId: number;
  status: 'pending' | 'approved' | 'rejected';
  onStatusChange: (requestId: number, newStatus: 'pending' | 'approved' | 'rejected') => void;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  requestId, 
  status,
  onStatusChange
}) => {
  const handleStatusChange = (newStatus: 'pending' | 'approved' | 'rejected') => {
    onStatusChange(requestId, newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 p-0">
          <StatusBadge status={status} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem 
          onClick={() => handleStatusChange('pending')}
          className="cursor-pointer"
        >
          <StatusBadge status="pending" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange('approved')}
          className="cursor-pointer"
        >
          <StatusBadge status="approved" />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange('rejected')}
          className="cursor-pointer"
        >
          <StatusBadge status="rejected" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
