
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface RevenueFilterDropdownProps {
  timeFilter: string;
  filterDisplayNames: Record<string, string>;
  filterOptions: Array<{ id: string; label: string }>;
  expandedFilter: string | null;
  toggleFilterExpansion: (filterId: string) => void;
  handleFilterChange: (value: string) => void;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: React.Dispatch<React.SetStateAction<{
    from: Date | undefined;
    to: Date | undefined;
  }>>;
  timeRange: {
    from: string;
    to: string;
  };
  setTimeRange: React.Dispatch<React.SetStateAction<{
    from: string;
    to: string;
  }>>;
  handleDateRangeSelect: () => void;
  handleDateTimeRangeSelect: () => void;
}

export const RevenueFilterDropdown: React.FC<RevenueFilterDropdownProps> = ({
  timeFilter,
  filterDisplayNames,
  filterOptions,
  expandedFilter,
  toggleFilterExpansion,
  handleFilterChange,
  dateRange,
  setDateRange,
  timeRange,
  setTimeRange,
  handleDateRangeSelect,
  handleDateTimeRangeSelect
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[180px] justify-between bg-white">
          {filterDisplayNames[timeFilter] || 'Select Time Frame'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] bg-white p-0" align="end">
        {filterOptions.map((option) => {
          if (option.id === 'relativeTime') {
            return (
              <Collapsible
                key={option.id}
                open={expandedFilter === option.id}
                className="w-full border-b border-gray-100"
              >
                <CollapsibleTrigger
                  onClick={() => toggleFilterExpansion(option.id)}
                  className="flex w-full items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium">{option.label}</span>
                  {expandedFilter === option.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-2">
                    {['last15Minutes', 'last60Minutes', 'last4Hours', 'last24Hours'].map((filter) => (
                      <Button
                        key={filter}
                        variant="ghost"
                        className="justify-start hover:bg-gray-100 w-full text-blue-600"
                        onClick={() => handleFilterChange(filter)}
                      >
                        {filterDisplayNames[filter]}
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          } else if (option.id === 'relativeDate') {
            return (
              <Collapsible
                key={option.id}
                open={expandedFilter === option.id}
                className="w-full border-b border-gray-100"
              >
                <CollapsibleTrigger
                  onClick={() => toggleFilterExpansion(option.id)}
                  className="flex w-full items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium">{option.label}</span>
                  {expandedFilter === option.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-2">
                    {['today', 'yesterday', 'daily', 'weekly', 'monthly', 'yearly', 'all'].map((filter) => (
                      <Button
                        key={filter}
                        variant="ghost"
                        className="justify-start hover:bg-gray-100 w-full text-blue-600"
                        onClick={() => handleFilterChange(filter)}
                      >
                        {filterDisplayNames[filter]}
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          } else if (option.id === 'dateRange') {
            return (
              <Collapsible
                key={option.id}
                open={expandedFilter === option.id}
                className="w-full border-b border-gray-100"
              >
                <CollapsibleTrigger
                  onClick={() => toggleFilterExpansion(option.id)}
                  className="flex w-full items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium">{option.label}</span>
                  {expandedFilter === option.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From:</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {dateRange.from ? format(dateRange.from, 'PPP') : <span>Select start date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">To:</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {dateRange.to ? format(dateRange.to, 'PPP') : <span>Select end date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <Button 
                      onClick={handleDateRangeSelect}
                      disabled={!dateRange.from || !dateRange.to}
                      className="w-full"
                    >
                      Apply Date Range
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          } else {
            return (
              <Collapsible
                key={option.id}
                open={expandedFilter === option.id}
                className="w-full border-b border-gray-100 last:border-0"
              >
                <CollapsibleTrigger
                  onClick={() => toggleFilterExpansion(option.id)}
                  className="flex w-full items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium">{option.label}</span>
                  {expandedFilter === option.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From Date:</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {dateRange.from ? format(dateRange.from, 'PPP') : <span>Select start date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From Time:</label>
                      <Input
                        type="time"
                        value={timeRange.from}
                        onChange={(e) => setTimeRange(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">To Date:</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {dateRange.to ? format(dateRange.to, 'PPP') : <span>Select end date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">To Time:</label>
                      <Input
                        type="time"
                        value={timeRange.to}
                        onChange={(e) => setTimeRange(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleDateTimeRangeSelect}
                      disabled={!dateRange.from || !dateRange.to}
                      className="w-full"
                    >
                      Apply Date & Time Range
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
