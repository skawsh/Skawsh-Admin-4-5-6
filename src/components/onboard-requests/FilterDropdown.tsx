
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FilterOptions } from './FilterOptions';
import { DateRangeFilter } from './DateRangeFilter';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

interface FilterDropdownProps {
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
  handleDateRangeSelect: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  timeFilter,
  filterDisplayNames,
  filterOptions,
  expandedFilter,
  toggleFilterExpansion,
  handleFilterChange,
  dateRange,
  setDateRange,
  handleDateRangeSelect
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
          if (option.id === 'relativeTime' || option.id === 'relativeDate') {
            return (
              <FilterOptions
                key={option.id}
                option={option}
                expandedFilter={expandedFilter}
                toggleFilterExpansion={toggleFilterExpansion}
                handleFilterChange={handleFilterChange}
              />
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
                    <svg className="h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m18 15-6-6-6 6"/></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m6 9 6 6 6-6"/></svg>
                  )}
                </CollapsibleTrigger>
                <DateRangeFilter
                  option={option}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  handleDateRangeSelect={handleDateRangeSelect}
                />
              </Collapsible>
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
