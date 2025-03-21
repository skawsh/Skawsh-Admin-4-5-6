
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOptionsProps {
  option: {
    id: string;
    label: string;
  };
  expandedFilter: string | null;
  toggleFilterExpansion: (filterId: string) => void;
  handleFilterChange: (value: string) => void;
}

export const FilterOptions: React.FC<FilterOptionsProps> = ({
  option,
  expandedFilter,
  toggleFilterExpansion,
  handleFilterChange
}) => {
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
        {expandedFilter === option.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        {option.id === 'relativeTime' && (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('last15Minutes')}
              >
                Last 15 minutes
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('last30Minutes')}
              >
                Last 30 minutes
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('last60Minutes')}
              >
                Last 60 minutes
              </Button>
            </div>
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('last4Hours')}
              >
                Last 4 hours
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('last24Hours')}
              >
                Last 24 hours
              </Button>
            </div>
          </div>
        )}
        
        {option.id === 'relativeDate' && (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('daily')}
              >
                Daily
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('yesterday')}
              >
                Yesterday
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('weekly')}
              >
                Weekly
              </Button>
            </div>
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('monthly')}
              >
                Monthly
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('yearly')}
              >
                Yearly
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-blue-500 font-normal hover:bg-gray-50 hover:text-blue-600"
                onClick={() => handleFilterChange('allTime')}
              >
                All time
              </Button>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
