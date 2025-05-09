
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface BulkPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayments: Payment[];
  onConfirm: (payments: Payment[], referenceNumber: string) => void;
}

const BulkPaymentDialog: React.FC<BulkPaymentDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedPayments, 
  onConfirm 
}) => {
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  
  const handleConfirm = () => {
    if (selectedPayments.length > 0) {
      onConfirm(selectedPayments, referenceNumber);
      setReferenceNumber('');
      onOpenChange(false);
    }
  };
  
  if (selectedPayments.length === 0) return null;
  
  const totalAmount = selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Multiple Payments</DialogTitle>
          <p className="text-muted-foreground">Enter payment details for {selectedPayments.length} orders</p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Selected Orders</label>
            <ScrollArea className="h-[100px] w-full rounded-md border">
              <div className="p-3 space-y-1">
                {selectedPayments.map((payment, index) => (
                  <div key={payment.id} className="flex items-center justify-between text-sm">
                    <span>{index + 1}. {payment.transactionId}</span>
                    <span className="font-medium">₹{payment.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Amount</label>
            <div className="bg-muted/50 p-3 rounded-md font-medium">
              ₹{totalAmount.toFixed(2)}
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
            Record All Payments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkPaymentDialog;
