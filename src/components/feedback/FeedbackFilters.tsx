
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface FeedbackFiltersProps {
  selectedDateRange: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';
  setSelectedDateRange: (range: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom') => void;
  customDateFrom: Date | undefined;
  setCustomDateFrom: (date: Date | undefined) => void;
  customDateTo: Date | undefined;
  setCustomDateTo: (date: Date | undefined) => void;
  selectedRating: string;
  setSelectedRating: (rating: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOrder: 'latest' | 'highest' | 'lowest';
  setSortOrder: (order: 'latest' | 'highest' | 'lowest') => void;
}

export const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  selectedDateRange,
  setSelectedDateRange,
  customDateFrom,
  setCustomDateFrom,
  customDateTo,
  setCustomDateTo,
  selectedRating,
  setSelectedRating,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Rating Filter */}
      <Select
        value={selectedRating}
        onValueChange={setSelectedRating}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
          <SelectItem value="4">4 Stars</SelectItem>
          <SelectItem value="3">3 Stars</SelectItem>
          <SelectItem value="2">2 Stars</SelectItem>
          <SelectItem value="1">1 Star</SelectItem>
          <SelectItem value="0">No Rating</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 w-[220px]">
            <CalendarIcon className="h-4 w-4" />
            <span>All Reviews & Ratings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Filter by date</h4>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={selectedDateRange === 'today' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setSelectedDateRange('today')}
                >
                  Today
                </Button>
                <Button 
                  variant={selectedDateRange === 'yesterday' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setSelectedDateRange('yesterday')}
                >
                  Yesterday
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={selectedDateRange === 'last7days' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setSelectedDateRange('last7days')}
                >
                  Last 7 Days
                </Button>
                <Button 
                  variant={selectedDateRange === 'last30days' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setSelectedDateRange('last30days')}
                >
                  Last 30 Days
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-sm">From</span>
                  <Calendar
                    mode="single"
                    selected={customDateFrom}
                    onSelect={(date) => {
                      setCustomDateFrom(date);
                      setSelectedDateRange('custom');
                    }}
                    className="border rounded-md p-3"
                    initialFocus
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-sm">To</span>
                  <Calendar
                    mode="single"
                    selected={customDateTo}
                    onSelect={(date) => {
                      setCustomDateTo(date);
                      setSelectedDateRange('custom');
                    }}
                    className="border rounded-md p-3"
                    initialFocus
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Sort Order filter, moved to right side */}
      <div className="ml-auto">
        <Select
          value={sortOrder}
          onValueChange={(value: any) => setSortOrder(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
