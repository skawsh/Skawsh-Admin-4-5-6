
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1 font-medium">
          <CheckCircle className="h-3.5 w-3.5" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1 font-medium">
          <AlertCircle className="h-3.5 w-3.5" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 font-medium">
          <AlertCircle className="h-3.5 w-3.5" />
          Pending
        </Badge>
      );
  }
};
