
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface StatusDropdownProps {
  currentStatus: string;
  orderId: string;
  onStatusChange: (orderId: string, newStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded') => void;
}

export const getStatusOptions = (currentStatus: string) => {
  switch (currentStatus) {
    case 'Pending':
      return [
        { label: 'Mark as Paid', value: 'Paid' }, 
        { label: 'Mark as Failed', value: 'Failed' },
        { label: 'Mark as Refunded', value: 'Refunded' }
      ];
    case 'Paid':
      return [
        { label: 'Mark as Pending', value: 'Pending' }, 
        { label: 'Mark as Failed', value: 'Failed' },
        { label: 'Mark as Refunded', value: 'Refunded' }
      ];
    case 'Failed':
      return [
        { label: 'Mark as Pending', value: 'Pending' }, 
        { label: 'Mark as Paid', value: 'Paid' },
        { label: 'Mark as Refunded', value: 'Refunded' }
      ];
    case 'Refunded':
      return [
        { label: 'Mark as Pending', value: 'Pending' }, 
        { label: 'Mark as Paid', value: 'Paid' },
        { label: 'Mark as Failed', value: 'Failed' }
      ];
    default:
      return [{ label: 'Mark as Paid', value: 'Paid' }];
  }
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  currentStatus,
  orderId,
  onStatusChange
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Status</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {getStatusOptions(currentStatus).map((option) => (
          <DropdownMenuItem 
            key={option.value}
            onClick={() => onStatusChange(orderId, option.value as 'Paid' | 'Pending' | 'Failed' | 'Refunded')}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
