
import React from 'react';
import { Search, CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PaymentFiltersProps {
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  dateRangeDialogOpen: boolean;
  setDateRangeDialogOpen: (open: boolean) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  dateFilter,
  onDateFilterChange,
  dateRange,
  dateRangeDialogOpen,
  setDateRangeDialogOpen,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="flex items-center gap-4">
      <Select value={dateFilter} onValueChange={onDateFilterChange}>
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
  );
};

export default PaymentFilters;
