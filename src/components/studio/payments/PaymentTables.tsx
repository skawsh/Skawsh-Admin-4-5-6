
import React, { useState } from 'react';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

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
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [washTypeSubTab, setWashTypeSubTab] = useState<string>("all");
  const [customDate, setCustomDate] = useState<Date | undefined>(undefined);
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

  const handleCustomDateSelect = (date: Date | undefined) => {
    if (date) {
      setCustomDate(date);
      setDateFilter("custom");
    }
  };

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

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4">
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="custom">Custom Date Range</SelectItem>
            </SelectContent>
          </Select>
          
          {dateFilter === "custom" && !dateRangeDialogOpen && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setDateRangeDialogOpen(true)}
            >
              <span>
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                ) : (
                  "Select date range"
                )}
              </span>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          )}

          {/* Custom Date Range Dialog */}
          <Dialog open={dateRangeDialogOpen} onOpenChange={setDateRangeDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Select Custom Date Range</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Start Date</div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          {dateRange.from ? (
                            format(dateRange.from, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="font-medium text-sm mt-4">Start Time</div>
                    <Input
                      type="time"
                      value={timeRange.from}
                      onChange={(e) => setTimeRange(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-sm">End Date</div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          {dateRange.to ? (
                            format(dateRange.to, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="font-medium text-sm mt-4">End Time</div>
                    <Input
                      type="time"
                      value={timeRange.to}
                      onChange={(e) => setTimeRange(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDateRangeDialogOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApplyDateRange}
                  disabled={!dateRange.from || !dateRange.to}
                >
                  Apply Range
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search order ID..." 
              className="pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
        <TabsContent value="pending" className="mt-0">
          <Tabs defaultValue={washTypeSubTab} onValueChange={setWashTypeSubTab} className="mt-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Wash Types</TabsTrigger>
              <TabsTrigger value="standard">Standard Wash Type</TabsTrigger>
              <TabsTrigger value="express">Express Wash Type</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">S.NO</TableHead>
                  <TableHead>TRANSACTION ID</TableHead>
                  <TableHead>DATE & TIME</TableHead>
                  <TableHead>WASH TYPE</TableHead>
                  <TableHead className="text-right">AMOUNT (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendingPayments.length > 0 ? (
                  filteredPendingPayments.map((payment, index) => (
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
                          {payment.serviceType} Wash
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
                  <TableHead>WASH TYPE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="text-right">AMOUNT (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompletedPayments.length > 0 ? (
                  filteredCompletedPayments.map((payment, index) => (
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
                          {payment.serviceType} Wash
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
      </Tabs>
    </div>
  );
};

export default PaymentTables;
