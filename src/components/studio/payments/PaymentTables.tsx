
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Payment } from '@/hooks/useStudioPayments';
import PaymentFilters from './PaymentFilters';
import DateRangeDialog from './DateRangeDialog';
import useDateRangeState from './useDateRangeState';
import PendingPaymentsTab from './PendingPaymentsTab';
import CompletedPaymentsTab from './CompletedPaymentsTab';
import filterPaymentsByType from './filterPaymentsByType';

interface PaymentTablesProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  pendingPayments: Payment[];
  completedPayments: Payment[];
  formatDate: (dateString: string) => string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPayments: number[];
  setSelectedPayments: React.Dispatch<React.SetStateAction<number[]>>;
  onMarkSelectedAsPaid: () => void;
}

const PaymentTables: React.FC<PaymentTablesProps> = ({
  activeTab,
  setActiveTab,
  pendingPayments,
  completedPayments,
  formatDate,
  searchTerm,
  onSearchChange,
  selectedPayments,
  setSelectedPayments,
  onMarkSelectedAsPaid
}) => {
  // Use the custom hook for date range state
  const dateRangeState = useDateRangeState();
  
  const [washTypeSubTab, setWashTypeSubTab] = React.useState<string>("all");
  const [historyWashTypeSubTab, setHistoryWashTypeSubTab] = React.useState<string>("all");

  // Function to switch to history tab
  const switchToHistoryTab = () => {
    setActiveTab('history');
  };

  // Filter payments by wash type
  const filteredPendingPayments = filterPaymentsByType(pendingPayments, washTypeSubTab);
  const filteredCompletedPayments = filterPaymentsByType(completedPayments, historyWashTypeSubTab);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <PaymentFilters 
          dateFilter={dateRangeState.dateFilter}
          onDateFilterChange={dateRangeState.handleDateFilterChange}
          dateRange={dateRangeState.dateRange}
          dateRangeDialogOpen={dateRangeState.dateRangeDialogOpen}
          setDateRangeDialogOpen={dateRangeState.setDateRangeDialogOpen}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        <DateRangeDialog 
          open={dateRangeState.dateRangeDialogOpen}
          onOpenChange={dateRangeState.setDateRangeDialogOpen}
          dateRange={dateRangeState.dateRange}
          setDateRange={dateRangeState.setDateRange}
          timeRange={dateRangeState.timeRange}
          setTimeRange={dateRangeState.setTimeRange}
          onApply={dateRangeState.handleApplyDateRange}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
        <TabsContent value="pending" className="mt-0">
          <PendingPaymentsTab
            washTypeSubTab={washTypeSubTab}
            setWashTypeSubTab={setWashTypeSubTab}
            pendingPayments={filteredPendingPayments}
            formatDate={formatDate}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
            onMarkSelectedAsPaid={onMarkSelectedAsPaid}
            onSwitchToHistoryTab={switchToHistoryTab}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <CompletedPaymentsTab
            historyWashTypeSubTab={historyWashTypeSubTab}
            setHistoryWashTypeSubTab={setHistoryWashTypeSubTab}
            completedPayments={filteredCompletedPayments}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentTables;
