
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
import { Check } from 'lucide-react';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onConfirm: (payment: Payment, referenceNumber: string) => void;
  selectedPayments?: Payment[];
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
  open, 
  onOpenChange, 
  payment, 
  onConfirm,
  selectedPayments = [] 
}) => {
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  
  const isBulkPayment = selectedPayments.length > 0;
  const totalAmount = isBulkPayment 
    ? selectedPayments.reduce((sum, p) => sum + p.amount, 0)
    : payment?.amount || 0;
  
  const handleConfirm = () => {
    if (payment) {
      onConfirm(payment, referenceNumber);
      setReferenceNumber('');
      onOpenChange(false);
    }
  };
  
  if (!payment && selectedPayments.length === 0) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isBulkPayment 
              ? `Record Payment for ${selectedPayments.length} Orders` 
              : `Record Payment for Order ${payment?.transactionId}`}
          </DialogTitle>
          <p className="text-muted-foreground">
            {isBulkPayment 
              ? `Enter payment details for ${selectedPayments.length} orders` 
              : `Enter payment details for order ${payment?.transactionId}`}
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {isBulkPayment ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Orders</label>
              <div className="border rounded-md max-h-[200px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-sm">Order ID</th>
                      <th className="px-3 py-2 text-right text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayments.map((payment) => (
                      <tr key={payment.id} className="border-t">
                        <td className="px-3 py-2">{payment.transactionId}</td>
                        <td className="px-3 py-2 text-right">₹{payment.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Order ID</label>
              <div className="bg-muted/50 p-3 rounded-md">
                {payment?.transactionId}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Total Amount</label>
            <div className="bg-muted/50 p-3 rounded-md">
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
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
