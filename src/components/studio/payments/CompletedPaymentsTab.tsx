
import React from 'react';
import { Payment } from '@/hooks/useStudioPayments';
import WashTypeSubTabs from './WashTypeSubTabs';
import CompletedPaymentsTable from './CompletedPaymentsTable';

interface CompletedPaymentsTabProps {
  historyWashTypeSubTab: string;
  setHistoryWashTypeSubTab: (value: string) => void;
  completedPayments: Payment[];
  formatDate: (dateString: string) => string;
}

const CompletedPaymentsTab: React.FC<CompletedPaymentsTabProps> = ({
  historyWashTypeSubTab,
  setHistoryWashTypeSubTab,
  completedPayments,
  formatDate
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <WashTypeSubTabs value={historyWashTypeSubTab} onChange={setHistoryWashTypeSubTab} />
      </div>
      <CompletedPaymentsTable payments={completedPayments} formatDate={formatDate} />
    </>
  );
};

export default CompletedPaymentsTab;
