
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Payment } from '@/hooks/useStudioPayments';

interface CompletedPaymentsTableProps {
  payments: Payment[];
  formatDate: (dateString: string) => string;
}

const CompletedPaymentsTable: React.FC<CompletedPaymentsTableProps> = ({
  payments,
  formatDate
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">S.NO</TableHead>
            <TableHead>TRANSACTION ID</TableHead>
            <TableHead>DATE & TIME</TableHead>
            <TableHead>WASH TYPE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">AMOUNT (₹)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <TableRow key={payment.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.serviceType === 'Standard' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {payment.serviceType} Wash
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium text-xs">
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{payment.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="font-medium">No payment history found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompletedPaymentsTable;
