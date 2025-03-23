
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

export const RevenueTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[60px]">S.No</TableHead>
        <TableHead>Order ID</TableHead>
        <TableHead>Ordered Date</TableHead>
        <TableHead>Wash Type</TableHead>
        <TableHead>Payment Status</TableHead>
        <TableHead>Grand Total</TableHead>
        <TableHead>Delivered Date</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
