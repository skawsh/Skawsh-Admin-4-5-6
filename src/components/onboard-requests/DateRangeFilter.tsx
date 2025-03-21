
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { CollapsibleContent } from '@/components/ui/collapsible';

interface DateRangeFilterProps {
  option: {
    id: string;
    label: string;
  };
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

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  option,
  dateRange,
  setDateRange,
  handleDateRangeSelect
}) => {
  return (
    <CollapsibleContent>
      {option.id === 'dateRange' && (
        <div className="p-4 space-y-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">From:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal w-full">
                  {dateRange.from ? format(dateRange.from, 'PPP') : <span>Select start date</span>}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
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
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">To:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal w-full">
                  {dateRange.to ? format(dateRange.to, 'PPP') : <span>Select end date</span>}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
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
      )}
      
      {option.id === 'dateTimeRange' && (
        <div className="p-4 space-y-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">From Date & Time:</span>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal flex-1">
                    {dateRange.from ? format(dateRange.from, 'PP') : <span>Date</span>}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Input 
                type="time" 
                className="flex-1"
                onChange={(e) => console.log(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">To Date & Time:</span>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal flex-1">
                    {dateRange.to ? format(dateRange.to, 'PP') : <span>Date</span>}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Input 
                type="time" 
                className="flex-1"
                onChange={(e) => console.log(e.target.value)} 
              />
            </div>
          </div>
          
          <Button 
            onClick={handleDateRangeSelect}
            disabled={!dateRange.from || !dateRange.to}
            className="w-full"
          >
            Apply Date & Time Range
          </Button>
        </div>
      )}
    </CollapsibleContent>
  );
};
