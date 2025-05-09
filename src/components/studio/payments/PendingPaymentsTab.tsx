
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
  onSwitchToHistoryTab?: () => void;
  onMarkAsPaid: (paymentId: number) => void;
}

const PendingPaymentsTab: React.FC<PendingPaymentsTabProps> = ({
  washTypeSubTab,
  setWashTypeSubTab,
  pendingPayments,
  formatDate,
  selectedPayments,
  setSelectedPayments,
  onMarkSelectedAsPaid,
  onSwitchToHistoryTab,
  onMarkAsPaid
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <WashTypeSubTabs value={washTypeSubTab} onChange={setWashTypeSubTab} />
        
        <BulkPaymentHandler
          selectedPayments={selectedPayments}
          pendingPayments={pendingPayments}
          onMarkSelectedAsPaid={onMarkSelectedAsPaid}
          onSwitchToHistoryTab={onSwitchToHistoryTab}
        />
      </div>
      
      <PendingPaymentsTable 
        payments={pendingPayments} 
        formatDate={formatDate}
        selectedPayments={selectedPayments}
        setSelectedPayments={setSelectedPayments}
        onSwitchToHistoryTab={onSwitchToHistoryTab}
        onMarkAsPaid={onMarkAsPaid}
      />
    </>
  );
};

export default PendingPaymentsTab;
