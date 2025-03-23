
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BarChart, Calendar, CreditCard, PieChart, TrendingUp, Wallet, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RevenueTable } from '@/components/revenue/RevenueTable';
import { getFilteredOrders } from '@/components/revenue/mockRevenueData';

// Mock revenue data for different time periods
const mockRevenueData = {
  all: {
    totalRevenue: 145280,
    pendingPayments: 12540,
    receivedPayments: 132740,
    totalGrowth: "+12.5%",
    receivedGrowth: "+8.2%",
    pendingCount: 5
  },
  daily: {
    totalRevenue: 4800,
    pendingPayments: 950,
    receivedPayments: 3850,
    totalGrowth: "+5.3%",
    receivedGrowth: "+4.1%",
    pendingCount: 2
  },
  weekly: {
    totalRevenue: 32600,
    pendingPayments: 3800,
    receivedPayments: 28800,
    totalGrowth: "+8.7%",
    receivedGrowth: "+6.2%",
    pendingCount: 3
  },
  monthly: {
    totalRevenue: 145280,
    pendingPayments: 12540,
    receivedPayments: 132740,
    totalGrowth: "+12.5%",
    receivedGrowth: "+8.2%",
    pendingCount: 5
  },
  yearly: {
    totalRevenue: 1652400,
    pendingPayments: 85600,
    receivedPayments: 1566800,
    totalGrowth: "+15.8%",
    receivedGrowth: "+14.3%",
    pendingCount: 12
  },
  today: {
    totalRevenue: 2300,
    pendingPayments: 450,
    receivedPayments: 1850,
    totalGrowth: "+3.2%",
    receivedGrowth: "+2.5%",
    pendingCount: 1
  },
  yesterday: {
    totalRevenue: 2500,
    pendingPayments: 500,
    receivedPayments: 2000,
    totalGrowth: "+4.1%",
    receivedGrowth: "+3.2%",
    pendingCount: 1
  },
  last15Minutes: {
    totalRevenue: 150,
    pendingPayments: 150,
    receivedPayments: 0,
    totalGrowth: "+0.0%",
    receivedGrowth: "+0.0%",
    pendingCount: 1
  },
  last60Minutes: {
    totalRevenue: 750,
    pendingPayments: 300,
    receivedPayments: 450,
    totalGrowth: "+1.2%",
    receivedGrowth: "+0.8%",
    pendingCount: 2
  },
  last4Hours: {
    totalRevenue: 1800,
    pendingPayments: 450,
    receivedPayments: 1350,
    totalGrowth: "+2.5%",
    receivedGrowth: "+1.9%",
    pendingCount: 2
  },
  last24Hours: {
    totalRevenue: 4800,
    pendingPayments: 950,
    receivedPayments: 3850,
    totalGrowth: "+5.3%",
    receivedGrowth: "+4.1%",
    pendingCount: 2
  }
};

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
  
  const [orders, setOrders] = useState(getFilteredOrders('all'));

  // Update orders when time filter changes
  useEffect(() => {
    setOrders(getFilteredOrders(timeFilter));
  }, [timeFilter]);

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

  // Get data based on selected filter
  const revenueData = mockRevenueData[timeFilter as keyof typeof mockRevenueData] || mockRevenueData.all;

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
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
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
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
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
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
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
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
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
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden bg-gradient-blue card-hover-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueData.totalRevenue)}</h3>
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{revenueData.totalGrowth} from last month</span>
                  </p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-gradient-purple card-hover-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium mb-1">Payments Pending</p>
                  <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueData.pendingPayments)}</h3>
                  <p className="text-amber-600 text-sm mt-1 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    <span>{revenueData.pendingCount} pending transactions</span>
                  </p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-gradient-green card-hover-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1">Payments Received</p>
                  <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueData.receivedPayments)}</h3>
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{revenueData.receivedGrowth} from last month</span>
                  </p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-hover-effect border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Revenue Breakdown</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PieChart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-gray-500">Revenue breakdown charts coming soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover-effect border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Monthly Trends</h3>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BarChart className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-gray-500">Monthly trend analysis coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Table Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Orders</h3>
            <Button variant="outline">Export Data</Button>
          </div>
          <RevenueTable orders={orders} />
        </div>
      </div>
    </Layout>
  );
};

export default Revenue;
