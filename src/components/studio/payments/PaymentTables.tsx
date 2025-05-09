
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Payment } from '@/hooks/useStudioPayments';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PaymentTablesProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  pendingPayments: Payment[];
  completedPayments: Payment[];
  formatDate: (dateString: string) => string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PaymentTables: React.FC<PaymentTablesProps> = ({
  activeTab,
  setActiveTab,
  pendingPayments,
  completedPayments,
  formatDate,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="text" 
            placeholder="Search payments..." 
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <TabsContent value="pending" className="mt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">S.NO</TableHead>
                <TableHead>TRANSACTION ID</TableHead>
                <TableHead>DATE & TIME</TableHead>
                <TableHead>SERVICE TYPE</TableHead>
                <TableHead className="text-right">AMOUNT (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPayments.length > 0 ? (
                pendingPayments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{payment.transactionId}</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.serviceType === 'Standard' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {payment.serviceType}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{payment.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="font-medium">No pending payments found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      
      <TabsContent value="history" className="mt-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">S.NO</TableHead>
                <TableHead>TRANSACTION ID</TableHead>
                <TableHead>DATE & TIME</TableHead>
                <TableHead>SERVICE TYPE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead className="text-right">AMOUNT (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedPayments.length > 0 ? (
                completedPayments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{payment.transactionId}</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.serviceType === 'Standard' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {payment.serviceType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium text-xs">
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{payment.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="font-medium">No payment history found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </div>
  );
};

export default PaymentTables;
