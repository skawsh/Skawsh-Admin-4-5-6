import React, { useState } from 'react';
import { Package, CheckCircle, Truck, AlertTriangle, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

const mockOrdersData = {
  all: {
    total: 26,
    new: 10,
    inProgress: 2,
    readyForCollection: 7,
    delivered: 5,
    cancelled: 1,
    assigned: 10
  },
  daily: {
    total: 8,
    new: 4,
    inProgress: 1,
    readyForCollection: 2,
    delivered: 1,
    cancelled: 0,
    assigned: 3
  },
  weekly: {
    total: 15,
    new: 7,
    inProgress: 2,
    readyForCollection: 3,
    delivered: 2,
    cancelled: 1,
    assigned: 5
  },
  monthly: {
    total: 26,
    new: 10,
    inProgress: 2,
    readyForCollection: 7,
    delivered: 5,
    cancelled: 1,
    assigned: 10
  },
  today: {
    total: 5,
    new: 3,
    inProgress: 1,
    readyForCollection: 1,
    delivered: 0,
    cancelled: 0,
    assigned: 2
  },
  yesterday: {
    total: 6,
    new: 2,
    inProgress: 1,
    readyForCollection: 2,
    delivered: 1,
    cancelled: 0,
    assigned: 3
  },
  weekToDate: {
    total: 12,
    new: 5,
    inProgress: 2,
    readyForCollection: 3,
    delivered: 2,
    cancelled: 0,
    assigned: 5
  },
  businessWeekToDate: {
    total: 10,
    new: 4,
    inProgress: 2,
    readyForCollection: 2,
    delivered: 2,
    cancelled: 0,
    assigned: 4
  },
  monthToDate: {
    total: 20,
    new: 8,
    inProgress: 2,
    readyForCollection: 5,
    delivered: 4,
    cancelled: 1,
    assigned: 8
  },
  yearToDate: {
    total: 120,
    new: 45,
    inProgress: 15,
    readyForCollection: 30,
    delivered: 25,
    cancelled: 5,
    assigned: 50
  },
  previousWeek: {
    total: 14,
    new: 6,
    inProgress: 2,
    readyForCollection: 3,
    delivered: 2,
    cancelled: 1,
    assigned: 6
  },
  previousBusinessWeek: {
    total: 12,
    new: 5,
    inProgress: 2,
    readyForCollection: 3,
    delivered: 1,
    cancelled: 1,
    assigned: 5
  },
  previousMonth: {
    total: 25,
    new: 10,
    inProgress: 3,
    readyForCollection: 6,
    delivered: 5,
    cancelled: 1,
    assigned: 11
  },
  previousYear: {
    total: 200,
    new: 80,
    inProgress: 25,
    readyForCollection: 45,
    delivered: 40,
    cancelled: 10,
    assigned: 85
  },
  last15Minutes: {
    total: 1,
    new: 1,
    inProgress: 0,
    readyForCollection: 0,
    delivered: 0,
    cancelled: 0,
    assigned: 0
  },
  last60Minutes: {
    total: 2,
    new: 2,
    inProgress: 0,
    readyForCollection: 0,
    delivered: 0,
    cancelled: 0,
    assigned: 1
  },
  last4Hours: {
    total: 4,
    new: 3,
    inProgress: 1,
    readyForCollection: 0,
    delivered: 0,
    cancelled: 0,
    assigned: 2
  },
  last24Hours: {
    total: 7,
    new: 4,
    inProgress: 1,
    readyForCollection: 1,
    delivered: 1,
    cancelled: 0,
    assigned: 3
  },
  last7Days: {
    total: 15,
    new: 7,
    inProgress: 2,
    readyForCollection: 3,
    delivered: 2,
    cancelled: 1,
    assigned: 6
  },
  last30Days: {
    total: 26,
    new: 10,
    inProgress: 3,
    readyForCollection: 7,
    delivered: 5,
    cancelled: 1,
    assigned: 11
  },
  allTime: {
    total: 350,
    new: 150,
    inProgress: 40,
    readyForCollection: 80,
    delivered: 70,
    cancelled: 10,
    assigned: 150
  }
};

const filterDisplayNames: Record<string, string> = {
  daily: "Daily",
  yesterday: "Yesterday",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  allTime: "All time",
  last15Minutes: "Last 15 minutes",
  last30Minutes: "Last 30 minutes",
  last60Minutes: "Last 60 minutes",
  last4Hours: "Last 4 hours",
  last24Hours: "Last 24 hours",
  today: "Today",
  weekToDate: "Week to date",
  businessWeekToDate: "Business week to date",
  monthToDate: "Month to date",
  yearToDate: "Year to date",
  previousWeek: "Previous week",
  previousBusinessWeek: "Previous business week",
  previousMonth: "Previous month",
  previousYear: "Previous year",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  all: "All Orders",
  dateRange: "Custom Date Range",
  dateTimeRange: "Custom Date & Time Range"
};

const filterCategories = {
  relative: [
    'daily',
    'yesterday',
    'weekly',
    'monthly',
    'yearly',
    'allTime'
  ],
  relativeInTime: [
    'last15Minutes',
    'last30Minutes',
    'last60Minutes',
    'last4Hours',
    'last24Hours'
  ]
};

const OrdersSection: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    relative: true,
    relativeInTime: false,
    dateRange: false,
    dateTimeRange: false
  });
  
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
  
  const orderData = mockOrdersData[timeFilter as keyof typeof mockOrdersData] || mockOrdersData.all;

  const handleFilterChange = (value: string) => {
    setTimeFilter(value);
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const handleDateRangeSelect = () => {
    if (dateRange.from && dateRange.to) {
      console.log(`Selected date range: ${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}`);
      setTimeFilter('dateRange');
    }
  };
  
  const handleDateTimeRangeSelect = () => {
    if (dateRange.from && dateRange.to) {
      console.log(`Selected date time range: ${format(dateRange.from, 'yyyy-MM-dd')} ${timeRange.from} to ${format(dateRange.to, 'yyyy-MM-dd')} ${timeRange.to}`);
      setTimeFilter('dateTimeRange');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[180px] justify-between">
                {filterDisplayNames[timeFilter] || 'Select Time Frame'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px] bg-white" align="end">
              <Collapsible
                open={openCategories.relative}
                className="w-full"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-100" onClick={() => toggleCategory('relative')}>
                  <span className="font-medium">Relative Date</span>
                  {openCategories.relative ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="grid grid-cols-2 gap-1">
                  <div className="space-y-1 p-2">
                    {filterCategories.relative.slice(0, 3).map((filter) => (
                      <DropdownMenuItem 
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className="cursor-pointer text-blue-500 hover:bg-gray-100"
                      >
                        {filterDisplayNames[filter]}
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="space-y-1 p-2">
                    {filterCategories.relative.slice(3).map((filter) => (
                      <DropdownMenuItem 
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className="cursor-pointer text-blue-500 hover:bg-gray-100"
                      >
                        {filterDisplayNames[filter]}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <DropdownMenuSeparator />
              
              <Collapsible
                open={openCategories.relativeInTime}
                className="w-full"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-100" onClick={() => toggleCategory('relativeInTime')}>
                  <span className="font-medium">Relative Time</span>
                  {openCategories.relativeInTime ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="grid grid-cols-2 gap-1">
                  <div className="space-y-1 p-2">
                    {filterCategories.relativeInTime.slice(0, 3).map((filter) => (
                      <DropdownMenuItem 
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className="cursor-pointer text-blue-500 hover:bg-gray-100"
                      >
                        {filterDisplayNames[filter]}
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="space-y-1 p-2">
                    {filterCategories.relativeInTime.slice(3).map((filter) => (
                      <DropdownMenuItem 
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className="cursor-pointer text-blue-500 hover:bg-gray-100"
                      >
                        {filterDisplayNames[filter]}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
              
              <DropdownMenuSeparator />
              
              <Collapsible
                open={openCategories.dateRange}
                className="w-full"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-100" onClick={() => toggleCategory('dateRange')}>
                  <span className="font-medium">Date Range</span>
                  {openCategories.dateRange ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-2 space-y-2">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">From:</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
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
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">To:</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
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
              
              <DropdownMenuSeparator />
              
              <Collapsible
                open={openCategories.dateTimeRange}
                className="w-full"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-100" onClick={() => toggleCategory('dateTimeRange')}>
                  <span className="font-medium">Date & Time Range</span>
                  {openCategories.dateTimeRange ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-2 space-y-2">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">From Date:</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
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
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">From Time:</span>
                      <Input
                        type="time"
                        value={timeRange.from}
                        onChange={(e) => setTimeRange(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">To Date:</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
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
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">To Time:</span>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orderData.total}</p>
            </div>
            <div className="bg-blue-500 rounded-full p-3 text-white">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">New Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orderData.new}</p>
            </div>
            <div className="bg-blue-500 rounded-full p-3 text-white">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-amber-50 border-amber-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orderData.inProgress}</p>
            </div>
            <div className="bg-amber-500 rounded-full p-3 text-white">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-yellow-50 border-yellow-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Ready for Collection</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orderData.readyForCollection}</p>
            </div>
            <div className="bg-yellow-500 rounded-full p-3 text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-green-50 border-green-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orderData.delivered}</p>
            </div>
            <div className="bg-green-500 rounded-full p-3 text-white">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-red-50 border-red-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Cancelled</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orderData.cancelled}</p>
            </div>
            <div className="bg-red-500 rounded-full p-3 text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-cyan-50 border-cyan-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm">Assigned</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{orderData.assigned}</p>
            </div>
            <div className="bg-cyan-500 rounded-full p-3 text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrdersSection;
