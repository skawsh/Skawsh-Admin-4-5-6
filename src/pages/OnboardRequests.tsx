
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const OnboardRequests: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('pending');
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

  const pendingRequests = requests.filter(request => request.status === 'pending');
  const reviewedRequests = requests.filter(request => request.status === 'approved' || request.status === 'rejected');

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
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-4">
            {renderRequestsTable(pendingRequests)}
          </TabsContent>
          
          <TabsContent value="reviewed" className="mt-4">
            {renderRequestsTable(reviewedRequests)}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OnboardRequests;
