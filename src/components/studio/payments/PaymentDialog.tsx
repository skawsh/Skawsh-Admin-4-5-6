
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Payment } from '@/hooks/useStudioPayments';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onConfirm: (payment: Payment, referenceNumber: string) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
  open, 
  onOpenChange, 
  payment, 
  onConfirm 
}) => {
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  
  const handleConfirm = () => {
    if (payment) {
      onConfirm(payment, referenceNumber);
      setReferenceNumber('');
      onOpenChange(false);
    }
  };
  
  if (!payment) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment for Order {payment.transactionId}</DialogTitle>
          <p className="text-muted-foreground">Enter payment details for order {payment.transactionId}</p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Order ID</label>
            <div className="bg-muted/50 p-3 rounded-md">
              {payment.transactionId}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Amount</label>
            <div className="bg-muted/50 p-3 rounded-md">
              ₹{payment.amount.toFixed(2)}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Reference / UTR</label>
            <Input
              type="text"
              placeholder="Enter payment reference or UTR number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="green" onClick={handleConfirm}>
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
