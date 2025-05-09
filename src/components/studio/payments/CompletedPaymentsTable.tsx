
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Payment } from '@/hooks/useStudioPayments';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CompletedPaymentsTableProps {
  payments: Payment[];
  formatDate: (dateString: string) => string;
}

const CompletedPaymentsTable: React.FC<CompletedPaymentsTableProps> = ({
  payments,
  formatDate
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleViewOrderDetails = (payment: Payment) => {
    navigate(`/orders/${payment.transactionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">S.NO</TableHead>
              <TableHead>ORDER ID</TableHead>
              <TableHead>CUSTOMER NAME</TableHead>
              <TableHead>ORDERED DATE</TableHead>
              <TableHead>WASH TYPE</TableHead>
              <TableHead>PAYMENT DATE</TableHead>
              <TableHead>REFERENCE NO</TableHead>
              <TableHead className="text-right">AMOUNT (₹)</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow key={payment.id}>
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
                      UTR12345678
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrderDetails(payment)}>
                            Order Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="font-medium">No payment history found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompletedPaymentsTable;
