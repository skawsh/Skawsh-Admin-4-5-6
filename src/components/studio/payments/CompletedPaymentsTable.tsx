
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
import { Checkbox } from '@/components/ui/checkbox';
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
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const handleViewOrderDetails = (payment: Payment) => {
    navigate(`/orders/${payment.transactionId}`);
  };
  
  const handleMarkSelectedAsPaid = () => {
    if (selectedPayments.length === 0) return;
    
    toast({
      title: "Payments Marked as Paid",
      description: `${selectedPayments.length} payments have been marked as paid.`,
    });
    
    // Reset selection after marking as paid
    setSelectedPayments([]);
  };

  return (
    <div>
      {selectedPayments.length > 1 && (
        <div className="flex justify-end mb-4">
          <Button 
            variant="blue" 
            onClick={handleMarkSelectedAsPaid}
            className="flex items-center gap-2"
          >
            <CheckSquare className="h-4 w-4" />
            Mark selected as paid
          </Button>
        </div>
      )}
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
    </div>
  );
};

export default CompletedPaymentsTable;
