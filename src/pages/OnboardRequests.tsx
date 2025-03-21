
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Calendar, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface OnboardRequest {
  id: number;
  studioName: string;
  ownerName: string;
  mobileNumber: string;
  emailId: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const filterOptions = [
  { id: 'relativeTime', label: 'Relative Time' },
  { id: 'relativeDate', label: 'Relative Date' },
  { id: 'dateRange', label: 'Date Range' },
  { id: 'dateTimeRange', label: 'Date & Time Range' },
];

const filterDisplayNames: Record<string, string> = {
  all: "All Requests",
  daily: "Daily",
  yesterday: "Yesterday",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
  allTime: "All time",
  today: "Today",
  weekToDate: "Week to date",
  monthToDate: "Month to date",
  yearToDate: "Year to date",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  dateRange: "Custom Date Range",
  dateTimeRange: "Date & Time Range",
  relativeTime: "Relative Time",
  relativeDate: "Relative Date",
  last15Minutes: "Last 15 minutes",
  last30Minutes: "Last 30 minutes",
  last60Minutes: "Last 60 minutes",
  last4Hours: "Last 4 hours",
  last24Hours: "Last 24 hours",
};

const filterCategories = {
  relativeTime: [
    'last15Minutes',
    'last30Minutes',
    'last60Minutes',
    'last4Hours',
    'last24Hours'
  ],
  relativeDate: [
    'daily',
    'yesterday',
    'weekly',
    'monthly',
    'yearly',
    'allTime'
  ],
  dateRange: [
    'custom'
  ],
  dateTimeRange: [
    'customDateTime'
  ]
};

const OnboardRequests: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  
  const [requests, setRequests] = useState<OnboardRequest[]>([
    {
      id: 1,
      studioName: 'Fresh Laundry Services',
      ownerName: 'John Doe',
      mobileNumber: '+91 9876543210',
      emailId: 'john@freshlaundry.com',
      requestDate: new Date(2025, 2, 15),
      status: 'pending'
    },
    {
      id: 2,
      studioName: 'SparkClean Laundromat',
      ownerName: 'Jane Smith',
      mobileNumber: '+91 9876543211',
      emailId: 'jane@sparkclean.com',
      requestDate: new Date(2025, 2, 14),
      status: 'pending'
    },
    {
      id: 3,
      studioName: 'Urban Wash Studio',
      ownerName: 'Mike Johnson',
      mobileNumber: '+91 9876543212',
      emailId: 'mike@urbanwash.com',
      requestDate: new Date(2025, 2, 10),
      status: 'approved'
    },
    {
      id: 4,
      studioName: 'Bubble & Fold',
      ownerName: 'Sarah Williams',
      mobileNumber: '+91 9876543213',
      emailId: 'sarah@bubblefold.com',
      requestDate: new Date(2025, 2, 5),
      status: 'rejected'
    }
  ]);

  const handleStatusChange = (requestId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
    
    toast.success(`Status updated to ${newStatus}`);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            Pending
          </Badge>
        );
    }
  };

  const renderStatusDropdown = (request: OnboardRequest) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 p-0">
          {renderStatusBadge(request.status)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem 
          onClick={() => handleStatusChange(request.id, 'pending')}
          className="cursor-pointer"
        >
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            Pending
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange(request.id, 'approved')}
          className="cursor-pointer"
        >
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 font-medium">
            <CheckCircle className="h-3.5 w-3.5" />
            Approved
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleStatusChange(request.id, 'rejected')}
          className="cursor-pointer"
        >
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1 font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            Rejected
          </Badge>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const toggleFilterExpansion = (filterId: string) => {
    setExpandedFilter(expandedFilter === filterId ? null : filterId);
  };
  
  const handleFilterChange = (value: string) => {
    setTimeFilter(value);
  };
  
  const handleDateRangeSelect = () => {
    if (dateRange.from && dateRange.to) {
      console.log(`Selected date range: ${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}`);
      setTimeFilter('dateRange');
      setExpandedFilter(null);
    }
  };

  const filterRequestsByDate = (requests: OnboardRequest[]): OnboardRequest[] => {
    if (timeFilter === 'all') return requests;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    switch (timeFilter) {
      case 'today':
        return requests.filter(request => request.requestDate >= today);
      case 'yesterday':
        return requests.filter(request => 
          request.requestDate >= yesterday && request.requestDate < today
        );
      case 'weekly':
        return requests.filter(request => request.requestDate >= startOfWeek);
      case 'monthly':
        return requests.filter(request => request.requestDate >= startOfMonth);
      case 'yearly':
        return requests.filter(request => request.requestDate >= startOfYear);
      case 'weekToDate':
        return requests.filter(request => request.requestDate >= startOfWeek);
      case 'monthToDate':
        return requests.filter(request => request.requestDate >= startOfMonth);
      case 'yearToDate':
        return requests.filter(request => request.requestDate >= startOfYear);
      case 'last7Days':
        return requests.filter(request => request.requestDate >= sevenDaysAgo);
      case 'last30Days':
        return requests.filter(request => request.requestDate >= thirtyDaysAgo);
      case 'dateRange':
        return requests.filter(request => 
          dateRange.from && dateRange.to && 
          request.requestDate >= dateRange.from && 
          request.requestDate <= dateRange.to
        );
      default:
        return requests;
    }
  };

  const filteredRequests = filterRequestsByDate(requests);
  const pendingRequests = filteredRequests.filter(request => request.status === 'pending');
  const reviewedRequests = filteredRequests.filter(request => request.status === 'approved' || request.status === 'rejected');

  const renderRequestsTable = (requestsToRender: OnboardRequest[]) => (
    <Card className="mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">S.No</TableHead>
            <TableHead>Studio Name</TableHead>
            <TableHead>Owner Name</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestsToRender.length > 0 ? (
            requestsToRender.map((request, index) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{request.studioName}</TableCell>
                <TableCell>{request.ownerName}</TableCell>
                <TableCell>{request.mobileNumber}</TableCell>
                <TableCell>{request.emailId}</TableCell>
                <TableCell>{format(request.requestDate, 'dd MMM yyyy')}</TableCell>
                <TableCell>{renderStatusDropdown(request)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );

  const renderFilterDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[180px] justify-between bg-white">
          {filterDisplayNames[timeFilter] || 'Select Time Frame'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] bg-white p-0" align="end">
        {filterOptions.map((option) => (
          <div key={option.id} className="w-full border-b border-gray-100 last:border-0">
            <CollapsibleTrigger
              onClick={() => toggleFilterExpansion(option.id)}
              className="flex w-full items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
            >
              <span className="font-medium">{option.label}</span>
              {expandedFilter === option.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            
            <Collapsible open={expandedFilter === option.id} className="w-full">
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
            </Collapsible>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Layout activeSection="studios">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="bg-white" 
            onClick={() => navigate('/studios')}
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Onboard Requests</h1>
            <p className="text-gray-600 mt-1">Manage studio onboarding requests</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed Requests</TabsTrigger>
            </TabsList>
            
            <div className="flex justify-end mt-4">
              {renderFilterDropdown()}
            </div>
            
            <TabsContent value="pending" className="mt-4">
              {renderRequestsTable(pendingRequests)}
            </TabsContent>
            
            <TabsContent value="reviewed" className="mt-4">
              {renderRequestsTable(reviewedRequests)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default OnboardRequests;
