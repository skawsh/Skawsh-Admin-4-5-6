
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  onApply: () => void;
}

const DateRangeDialog: React.FC<DateRangeDialogProps> = ({
  open,
  onOpenChange,
  dateRange,
  setDateRange,
  timeRange,
  setTimeRange,
  onApply
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={onApply}
            disabled={!dateRange.from || !dateRange.to}
          >
            Apply Range
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangeDialog;
