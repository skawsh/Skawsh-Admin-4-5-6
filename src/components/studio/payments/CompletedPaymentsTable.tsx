
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Payment } from '@/hooks/useStudioPayments';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface CompletedPaymentsTableProps {
  payments: Payment[];
  formatDate: (dateString: string) => string;
}

const CompletedPaymentsTable: React.FC<CompletedPaymentsTableProps> = ({
  payments,
  formatDate
}) => {
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(payments.map(payment => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (checked: boolean, paymentId: number) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter(id => id !== paymentId));
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={payments.length > 0 && selectedPayments.length === payments.length}
                onCheckedChange={handleSelectAll}
                aria-label="Select all payments"
              />
            </TableHead>
            <TableHead className="w-[50px]">S.NO</TableHead>
            <TableHead>ORDER ID</TableHead>
            <TableHead>CUSTOMER NAME</TableHead>
            <TableHead>ORDERED DATE</TableHead>
            <TableHead>WASH TYPE</TableHead>
            <TableHead>DELIVERED DATE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead className="text-right">AMOUNT (₹)</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <TableRow key={payment.id}>
                <TableCell className="px-4">
                  <Checkbox 
                    checked={selectedPayments.includes(payment.id)}
                    onCheckedChange={(checked) => handleSelectPayment(checked as boolean, payment.id)}
                    aria-label={`Select payment ${payment.transactionId}`}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payment.transactionId}</TableCell>
                <TableCell>{payment.customerName || "N/A"}</TableCell>
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
                <TableCell>{payment.deliveredDate ? formatDate(payment.deliveredDate) : "N/A"}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium text-xs">
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-10 text-gray-500">
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
