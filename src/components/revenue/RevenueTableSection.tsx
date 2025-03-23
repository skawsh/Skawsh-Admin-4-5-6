
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RevenueTable, RevenueOrder } from '@/components/revenue/RevenueTable';

interface RevenueTableSectionProps {
  allOrders: RevenueOrder[];
  pendingOrders: RevenueOrder[];
  paidOrders: RevenueOrder[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const RevenueTableSection: React.FC<RevenueTableSectionProps> = ({
  allOrders,
  pendingOrders,
  paidOrders,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="mt-8">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Payments Pending</TabsTrigger>
            <TabsTrigger value="paid">Payments Received</TabsTrigger>
          </TabsList>
          <Button variant="outline">Export Data</Button>
        </div>
        
        <TabsContent value="all">
          <RevenueTable orders={allOrders} />
        </TabsContent>
        
        <TabsContent value="pending">
          <RevenueTable orders={pendingOrders} />
        </TabsContent>
        
        <TabsContent value="paid">
          <RevenueTable orders={paidOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
