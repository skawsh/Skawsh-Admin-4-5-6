
import React from 'react';
import { Payment } from '@/hooks/useStudioPayments';
import WashTypeSubTabs from './WashTypeSubTabs';
import PendingPaymentsTable from './PendingPaymentsTable';
import BulkPaymentHandler from './BulkPaymentHandler';

interface PendingPaymentsTabProps {
  washTypeSubTab: string;
  setWashTypeSubTab: (value: string) => void;
  pendingPayments: Payment[];
  formatDate: (dateString: string) => string;
  selectedPayments: number[];
  setSelectedPayments: React.Dispatch<React.SetStateAction<number[]>>;
  onMarkSelectedAsPaid: () => void;
}

const PendingPaymentsTab: React.FC<PendingPaymentsTabProps> = ({
  washTypeSubTab,
  setWashTypeSubTab,
  pendingPayments,
  formatDate,
  selectedPayments,
  setSelectedPayments,
  onMarkSelectedAsPaid
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <WashTypeSubTabs value={washTypeSubTab} onChange={setWashTypeSubTab} />
        
        <BulkPaymentHandler
          selectedPayments={selectedPayments}
          pendingPayments={pendingPayments}
          onMarkSelectedAsPaid={onMarkSelectedAsPaid}
        />
      </div>
      
      <PendingPaymentsTable 
        payments={pendingPayments} 
        formatDate={formatDate}
        selectedPayments={selectedPayments}
        setSelectedPayments={setSelectedPayments}
      />
    </>
  );
};

export default PendingPaymentsTab;
