
import React, { useState } from 'react';
import { Payment } from '@/hooks/useStudioPayments';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import PaymentDialog from './PaymentDialog';

interface BulkPaymentHandlerProps {
  selectedPayments: number[];
  pendingPayments: Payment[];
  onMarkSelectedAsPaid: () => void;
}

const BulkPaymentHandler: React.FC<BulkPaymentHandlerProps> = ({
  selectedPayments,
  pendingPayments,
  onMarkSelectedAsPaid,
}) => {
  const [bulkPaymentDialogOpen, setBulkPaymentDialogOpen] = useState(false);
  const [bulkPayment, setBulkPayment] = useState<Payment | null>(null);
  const [selectedPaymentItems, setSelectedPaymentItems] = useState<Payment[]>([]);

  const handleOpenBulkPaymentDialog = () => {
    if (selectedPayments.length > 0) {
      const selectedItems = pendingPayments.filter(p => 
        selectedPayments.includes(p.id)
      );
      
      const totalAmount = selectedItems.reduce((sum, p) => sum + p.amount, 0);
      
      setBulkPayment({
        id: 0,
        transactionId: `BULK-${selectedPayments.length}-ORDERS`,
        amount: totalAmount,
        date: new Date().toISOString(),
        status: 'Pending',
        serviceType: 'Standard',
        customerName: `${selectedPayments.length} Orders`
      });
      
      setSelectedPaymentItems(selectedItems);
      setBulkPaymentDialogOpen(true);
    }
  };

  const handleConfirmBulkPayment = (payment: Payment, referenceNumber: string) => {
    // Handle the bulk payment confirmation
    onMarkSelectedAsPaid();
    setBulkPaymentDialogOpen(false);
    setBulkPayment(null);
    setSelectedPaymentItems([]);
  };

  if (selectedPayments.length === 0) {
    return null;
  }

  return (
    <>
      <Button 
        variant="green"
        onClick={handleOpenBulkPaymentDialog}
        className="ml-auto"
      >
        <CheckSquare className="mr-2 h-4 w-4" />
        Mark Selected as Paid ({selectedPayments.length})
      </Button>

      <PaymentDialog
        open={bulkPaymentDialogOpen}
        onOpenChange={setBulkPaymentDialogOpen}
        payment={bulkPayment}
        onConfirm={handleConfirmBulkPayment}
        selectedPayments={selectedPaymentItems}
      />
    </>
  );
};

export default BulkPaymentHandler;
