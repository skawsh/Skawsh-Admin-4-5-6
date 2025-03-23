import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getFilteredOrders, calculateRevenueMetrics } from '@/components/revenue/mockRevenueData';
import { RevenueFilterDropdown } from '@/components/revenue/RevenueFilterDropdown';
import { RevenueTiles } from '@/components/revenue/RevenueTiles';
import { RevenueTableSection } from '@/components/revenue/RevenueTableSection';

const formatIndianCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('₹', '₹ ');
};

const Revenue: React.FC = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
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
  
  const [allOrders, setAllOrders] = useState(getFilteredOrders('all'));
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setAllOrders(getFilteredOrders(timeFilter));
  }, [timeFilter]);

  const pendingOrders = allOrders.filter(order => order.paymentStatus === 'Pending');
  const paidOrders = allOrders.filter(order => order.paymentStatus === 'Paid');

  const revenueMetrics = calculateRevenueMetrics(allOrders);

  const filterDisplayNames: Record<string, string> = {
    all: "All Time",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    today: "Today",
    yesterday: "Yesterday",
    last15Minutes: "Last 15 Minutes",
    last60Minutes: "Last 60 Minutes",
    last4Hours: "Last 4 Hours",
    last24Hours: "Last 24 Hours",
    dateRange: "Custom Date Range",
    dateTimeRange: "Custom Date & Time Range"
  };

  const filterOptions = [
    { id: 'relativeTime', label: 'Relative Time' },
    { id: 'relativeDate', label: 'Relative Date' },
    { id: 'dateRange', label: 'Date Range' },
    { id: 'dateTimeRange', label: 'Date & Time Range' }
  ];

  const toggleFilterExpansion = (filterId: string) => {
    setExpandedFilter(expandedFilter === filterId ? null : filterId);
  };

  const handleFilterChange = (value: string) => {
    setTimeFilter(value);
  };

  const handleDateRangeSelect = () => {
    if (dateRange.from && dateRange.to) {
      setTimeFilter('dateRange');
    }
  };

  const handleDateTimeRangeSelect = () => {
    if (dateRange.from && dateRange.to) {
      setTimeFilter('dateTimeRange');
    }
  };

  return (
    <Layout activeSection="revenue">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="rounded-full h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Revenue</h1>
              <p className="text-gray-600 mt-1">Monitor your financial performance</p>
            </div>
          </div>
          <div>
            <RevenueFilterDropdown
              timeFilter={timeFilter}
              filterDisplayNames={filterDisplayNames}
              filterOptions={filterOptions}
              expandedFilter={expandedFilter}
              toggleFilterExpansion={toggleFilterExpansion}
              handleFilterChange={handleFilterChange}
              dateRange={dateRange}
              setDateRange={setDateRange}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              handleDateRangeSelect={handleDateRangeSelect}
              handleDateTimeRangeSelect={handleDateTimeRangeSelect}
            />
          </div>
        </div>
        
        <RevenueTiles 
          revenueMetrics={revenueMetrics}
          formatIndianCurrency={formatIndianCurrency}
        />
        
        <RevenueTableSection
          allOrders={allOrders}
          pendingOrders={pendingOrders}
          paidOrders={paidOrders}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </Layout>
  );
};

export default Revenue;
