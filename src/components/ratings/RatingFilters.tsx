import React from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RatingFiltersProps {
  ratingFilter: string | null;
  setRatingFilter: (rating: string | null) => void;
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}

export const RatingFilters: React.FC<RatingFiltersProps> = ({
  ratingFilter,
  setRatingFilter,
  dateRange,
  setDateRange,
  sortOption,
  setSortOption
}) => {
  const handleDateFilterSelect = (option: string) => {
    const today = new Date();
    
    switch (option) {
      case 'daily':
        // Just today
        setDateRange({ 
          from: new Date(today.setHours(0, 0, 0, 0)),
          to: new Date(today.setHours(23, 59, 59, 999))
        });
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setDateRange({ 
          from: new Date(yesterday.setHours(0, 0, 0, 0)),
          to: new Date(yesterday.setHours(23, 59, 59, 999))
        });
        break;
      case 'weekly':
        const weekStart = new Date();
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
        setDateRange({ 
          from: new Date(weekStart.setHours(0, 0, 0, 0)),
          to: new Date(weekEnd.setHours(23, 59, 59, 999))
        });
        break;
      case 'monthly':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        setDateRange({ 
          from: new Date(monthStart.setHours(0, 0, 0, 0)),
          to: new Date(monthEnd.setHours(23, 59, 59, 999))
        });
        break;
      case 'yearly':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31);
        setDateRange({ 
          from: new Date(yearStart.setHours(0, 0, 0, 0)),
          to: new Date(yearEnd.setHours(23, 59, 59, 999))
        });
        break;
      case 'allTime':
        // Clear the date filters
        setDateRange({ from: undefined, to: undefined });
        break;
      default:
        // If no valid option, don't change the date range
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-4 justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-gray-500">Filter by:</p>
        
        <Select 
          value={ratingFilter || "all"} 
          onValueChange={(value) => setRatingFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[120px]">
            <span className="flex items-center gap-2">
              <span>Rating</span>
              <ChevronDown size={16} />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d, yyyy")} -{" "}
                    {format(dateRange.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM d, yyyy")
                )
              ) : (
                <span>All Reviews & Ratings</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => handleDateFilterSelect('daily')}>
              Daily
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDateFilterSelect('yesterday')}>
              Yesterday
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDateFilterSelect('weekly')}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDateFilterSelect('monthly')}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDateFilterSelect('yearly')}>
              Yearly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDateFilterSelect('allTime')}>
              All time
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <span className="flex items-center justify-between w-full cursor-pointer">
                    Date Range
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      setDateRange({
                        from: range?.from,
                        to: range?.to,
                      });
                    }}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <span className="flex items-center gap-2">
              <span>Sort by</span>
              {sortOption === "highest" && <ArrowDown size={16} className="ml-1 text-gray-500" />}
              {sortOption === "lowest" && <ArrowUp size={16} className="ml-1 text-gray-500" />}
              {sortOption === "latest" && <ChevronDown size={16} />}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest reviews</SelectItem>
            <SelectItem value="highest">
              <div className="flex items-center">
                Highest to lowest
                <ArrowDown size={16} className="ml-1 text-gray-500" />
              </div>
            </SelectItem>
            <SelectItem value="lowest">
              <div className="flex items-center">
                Lowest to highest
                <ArrowUp size={16} className="ml-1 text-gray-500" />
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
