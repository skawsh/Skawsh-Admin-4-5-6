import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
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
  toDate: [
    'today',
    'weekToDate',
    'monthToDate',
    'yearToDate'
  ],
  last: [
    'last7Days',
    'last30Days'
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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    relative: false,
    toDate: false,
    last: false,
    dateRange: false
  });
  
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

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const handleFilterChange = (value: string) => {
    setTimeFilter(value);
  };
  
  const handleDateRangeSelect = () => {
    if (dateRange.from && dateRange.to) {
      console.log(`Selected date range: ${format(dateRange.from, 'yyyy-MM-dd')} to ${format(dateRange.to, 'yyyy-MM-dd')}`);
      setTimeFilter('dateRange');
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[180px] justify-between bg-white">
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
                    open={openCategories.toDate}
                    className="w-full"
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-100" onClick={() => toggleCategory('toDate')}>
                      <span className="font-medium">To Date</span>
                      {openCategories.toDate ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="grid grid-cols-2 gap-1">
                      <div className="space-y-1 p-2">
                        {filterCategories.toDate.slice(0, 2).map((filter) => (
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
                        {filterCategories.toDate.slice(2).map((filter) => (
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
                    open={openCategories.last}
                    className="w-full"
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-100" onClick={() => toggleCategory('last')}>
                      <span className="font-medium">Last</span>
                      {openCategories.last ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="grid grid-cols-2 gap-1">
                      <div className="space-y-1 p-2">
                        {filterCategories.last.map((filter) => (
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
                              <Button variant="outline" className="justify-start text-left font-normal">
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
                    </CollapsibleContent>
                  </Collapsible>
                </DropdownMenuContent>
              </DropdownMenu>
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
