
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Payment } from '@/hooks/useStudioPayments';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PendingPaymentsTable from './PendingPaymentsTable';
import CompletedPaymentsTable from './CompletedPaymentsTable';

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
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <TabsList>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="completed">Completed Payments</TabsTrigger>
          </TabsList>

          <div className="flex w-full sm:w-auto gap-3 items-center">
            <div className="relative w-full sm:max-w-[260px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            
            {activeTab === 'pending' && selectedPayments.length > 0 && (
              <Button 
                variant="green" 
                className="whitespace-nowrap" 
                onClick={onMarkSelectedAsPaid}
              >
                Mark Selected as Paid ({selectedPayments.length})
              </Button>
            )}
          </div>
        </div>

        <div className="pt-6">
          <TabsContent value="pending">
            <PendingPaymentsTable 
              payments={pendingPayments}
              formatDate={formatDate}
              selectedPayments={selectedPayments}
              setSelectedPayments={setSelectedPayments}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <CompletedPaymentsTable
              payments={completedPayments}
              formatDate={formatDate}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PaymentTables;
