
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
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaymentDialog from './PaymentDialog';

interface PendingPaymentsTableProps {
  payments: Payment[];
  formatDate: (dateString: string) => string;
  selectedPayments: number[];
  setSelectedPayments: React.Dispatch<React.SetStateAction<number[]>>;
}

const PendingPaymentsTable: React.FC<PendingPaymentsTableProps> = ({
  payments,
  formatDate,
  selectedPayments,
  setSelectedPayments
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  
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

  const handleOpenPaymentDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setPaymentDialogOpen(true);
  };

  const handleConfirmPayment = (payment: Payment, referenceNumber: string) => {
    // In a real application, this would make an API call to update the payment status
    toast({
      title: "Payment Recorded Successfully",
      description: `Payment for ${payment.transactionId} has been recorded with reference: ${referenceNumber || 'N/A'}`,
    });
    
    // Remove from selected payments if it was selected
    if (selectedPayments.includes(payment.id)) {
      setSelectedPayments(selectedPayments.filter(id => id !== payment.id));
    }
  };

  return (
    <>
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
                  <TableCell>{payment.deliveredDate ? formatDate(payment.deliveredDate) : "Pending"}</TableCell>
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
                          <DropdownMenuItem 
                            onClick={() => handleOpenPaymentDialog(payment)}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50 font-medium"
                          >
                            Mark as Paid
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
                    <p className="font-medium">No pending payments found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        payment={selectedPayment}
        onConfirm={handleConfirmPayment}
      />
    </>
  );
};

export default PendingPaymentsTable;
