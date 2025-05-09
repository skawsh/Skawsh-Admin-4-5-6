
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Payment } from '@/hooks/useStudioPayments';
import PaymentFilters from './PaymentFilters';
import DateRangeDialog from './DateRangeDialog';
import PendingPaymentsTable from './PendingPaymentsTable';
import CompletedPaymentsTable from './CompletedPaymentsTable';
import WashTypeSubTabs from './WashTypeSubTabs';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import PaymentDialog from './PaymentDialog';

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
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [washTypeSubTab, setWashTypeSubTab] = useState<string>("all");
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [timeRange, setTimeRange] = useState<{
    from: string;
    to: string;
  }>({
    from: "00:00",
    to: "23:59"
  });
  const [bulkPaymentDialogOpen, setBulkPaymentDialogOpen] = useState(false);
  const [bulkPayment, setBulkPayment] = useState<Payment | null>(null);

  // Filter payments by wash type subtab first
  const filterByWashType = (payments: Payment[]) => {
    if (washTypeSubTab === "all") return payments;
    return payments.filter(payment => 
      payment.serviceType.toLowerCase() === washTypeSubTab.toLowerCase().replace(" wash", "")
    );
  };

  // Then filter by date range
  const filteredPendingPayments = filterByWashType(pendingPayments).filter(payment => {
    if (dateFilter === "all") return true;
    
    // Here you would implement date-based filtering logic
    // For now we'll keep it simple
    return true;
  });

  const filteredCompletedPayments = completedPayments.filter(payment => {
    if (dateFilter === "all") return true;
    
    // Here you would implement date-based filtering logic
    // For now we'll keep it simple
    return true;
  });

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    if (value === "custom") {
      setDateRangeDialogOpen(true);
    }
  };

  const handleApplyDateRange = () => {
    setDateRangeDialogOpen(false);
    // Apply the custom date range filter
    setDateFilter("custom");
  };

  const handleOpenBulkPaymentDialog = () => {
    // Create a mock bulk payment object
    if (selectedPayments.length > 0) {
      const totalAmount = filteredPendingPayments
        .filter(p => selectedPayments.includes(p.id))
        .reduce((sum, p) => sum + p.amount, 0);
      
      setBulkPayment({
        id: 0,
        transactionId: `BULK-${selectedPayments.length}-ORDERS`,
        amount: totalAmount,
        date: new Date().toISOString(),
        status: 'Pending',
        serviceType: 'Standard',
        customerName: `${selectedPayments.length} Orders`
      });
      
      setBulkPaymentDialogOpen(true);
    }
  };

  const handleConfirmBulkPayment = (payment: Payment, referenceNumber: string) => {
    // Handle the bulk payment confirmation
    // Here you would typically make an API call
    onMarkSelectedAsPaid();
    setBulkPaymentDialogOpen(false);
    setBulkPayment(null);
  };

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
          dateFilter={dateFilter}
          onDateFilterChange={handleDateFilterChange}
          dateRange={dateRange}
          dateRangeDialogOpen={dateRangeDialogOpen}
          setDateRangeDialogOpen={setDateRangeDialogOpen}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        <DateRangeDialog 
          open={dateRangeDialogOpen}
          onOpenChange={setDateRangeDialogOpen}
          dateRange={dateRange}
          setDateRange={setDateRange}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          onApply={handleApplyDateRange}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
        <TabsContent value="pending" className="mt-0">
          <div className="flex items-center justify-between">
            <WashTypeSubTabs value={washTypeSubTab} onChange={setWashTypeSubTab} />
            
            {selectedPayments.length > 0 && (
              <Button 
                variant="green"
                onClick={handleOpenBulkPaymentDialog}
                disabled={selectedPayments.length === 0}
                className="ml-auto"
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark Selected as Paid ({selectedPayments.length})
              </Button>
            )}
          </div>
          
          <PendingPaymentsTable 
            payments={filteredPendingPayments} 
            formatDate={formatDate}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <CompletedPaymentsTable payments={filteredCompletedPayments} formatDate={formatDate} />
        </TabsContent>
      </Tabs>
      
      <PaymentDialog
        open={bulkPaymentDialogOpen}
        onOpenChange={setBulkPaymentDialogOpen}
        payment={bulkPayment}
        onConfirm={handleConfirmBulkPayment}
      />
    </div>
  );
};

export default PaymentTables;
