
import React from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronRight } from "lucide-react";
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
    const from = new Date();
    
    switch (option) {
      case 'relativeTime':
        // This would typically show a time-based filter
        setDateRange({ from: undefined, to: undefined });
        break;
      case 'relativeDate':
        // This would typically show relative dates (today, yesterday, etc.)
        setDateRange({ from: undefined, to: undefined });
        break;
      case 'dateRange':
        // Keep the current implementation
        break;
      case 'dateTimeRange':
        // This would typically include time in the date range
        setDateRange({ from: undefined, to: undefined });
        break;
      default:
        setDateRange({ from: undefined, to: undefined });
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
            <DropdownMenuItem onClick={() => handleDateFilterSelect('relativeTime')}>
              <span className="flex items-center justify-between w-full">
                Relative Time
                <ChevronRight className="h-4 w-4" />
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDateFilterSelect('relativeDate')}>
              <span className="flex items-center justify-between w-full">
                Relative Date
                <ChevronRight className="h-4 w-4" />
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <span className="flex items-center justify-between w-full cursor-pointer">
                    All Reviews & Ratings
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
            <DropdownMenuItem onClick={() => handleDateFilterSelect('dateTimeRange')}>
              <span className="flex items-center justify-between w-full">
                Date & Time Range
                <ChevronRight className="h-4 w-4" />
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <span className="flex items-center gap-2">
              <span>Sort by</span>
              <ChevronDown size={16} />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest reviews</SelectItem>
            <SelectItem value="highest">Highest to lowest</SelectItem>
            <SelectItem value="lowest">Lowest to highest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
