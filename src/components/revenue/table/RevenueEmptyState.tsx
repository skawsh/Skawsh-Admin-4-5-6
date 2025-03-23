
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

export const RevenueEmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={8} className="h-24 text-center">
        No revenue data found.
      </TableCell>
    </TableRow>
  );
};
