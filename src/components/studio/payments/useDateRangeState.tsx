
import { useState } from 'react';

export const useDateRangeState = () => {
  const [dateFilter, setDateFilter] = useState<string>("all");
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

  return {
    dateFilter,
    setDateFilter,
    dateRangeDialogOpen,
    setDateRangeDialogOpen,
    dateRange,
    setDateRange,
    timeRange,
    setTimeRange,
    handleDateFilterChange,
    handleApplyDateRange
  };
};

export default useDateRangeState;
