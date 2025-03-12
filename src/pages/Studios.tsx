import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { 
  Filter, 
  BarChart2, 
  Plus, 
  Star, 
  Search, 
  ChevronDown, 
  MoreHorizontal, 
  ArrowUpDown,
  CreditCard,
  Settings,
  Package,
  BarChart,
  Trash 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface Studio {
  id: number;
  studioId: string;
  studioName: string;
  ownerName: string;
  contact: string;
  services: number;
  rating: number;
  status: boolean;
}

const Studios: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [studiosData, setStudiosData] = useState<Studio[]>([]);

  const defaultStudios: Studio[] = [
    {
      id: 1,
      studioId: 'STU10001',
      studioName: 'Saiteja Laundry',
      ownerName: 'Saiteja',
      contact: '8099830308',
      services: 56,
      rating: 4.5,
      status: true
    },
    {
      id: 2,
      studioId: 'STU10002',
      studioName: 'Sparkle Clean Laundry',
      ownerName: 'Ravi Kumar',
      contact: '9876543210',
      services: 48,
      rating: 4.7,
      status: true
    },
    {
      id: 3,
      studioId: 'STU10003',
      studioName: 'Fresh & Clean',
      ownerName: 'Priya Sharma',
      contact: '7654321098',
      services: 42,
      rating: 4.3,
      status: true
    },
    {
      id: 4,
      studioId: 'STU10004',
      studioName: 'Express Wash',
      ownerName: 'Ajay Patel',
      contact: '9988776655',
      services: 38,
      rating: 4.1,
      status: true
    },
    {
      id: 5,
      studioId: 'STU10005',
      studioName: 'Royal Laundry',
      ownerName: 'Sneha Reddy',
      contact: '8765432109',
      services: 52,
      rating: 4.6,
      status: true
    },
    {
      id: 6,
      studioId: 'STU10006',
      studioName: 'Quick Clean',
      ownerName: 'Vikram Singh',
      contact: '9876123450',
      services: 35,
      rating: 3.9,
      status: false
    },
    {
      id: 7,
      studioId: 'STU10007',
      studioName: 'Urban Laundry',
      ownerName: 'Meera Desai',
      contact: '8123456789',
      services: 44,
      rating: 4.2,
      status: false
    },
    {
      id: 8,
      studioId: 'STU10008',
      studioName: 'Elite Washing',
      ownerName: 'Rahul Gupta',
      contact: '7890123456',
      services: 39,
      rating: 3.8,
      status: false
    }
  ];

  useEffect(() => {
    const savedStudios = localStorage.getItem('laundryStudios');
    
    if (savedStudios) {
      setStudiosData(JSON.parse(savedStudios));
    } else {
      setStudiosData(defaultStudios);
      localStorage.setItem('laundryStudios', JSON.stringify(defaultStudios));
    }
  }, []);

  const filteredStudios = studiosData.filter((studio) => {
    const matchesSearch = searchTerm === '' || 
      studio.studioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.studioId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.contact.includes(searchTerm);
    
    const matchesStatus = statusFilter === null || 
      (statusFilter === 'active' && studio.status) ||
      (statusFilter === 'inactive' && !studio.status);
    
    const matchesRating = ratingFilter === null ||
      (ratingFilter === 'above4.5' && studio.rating >= 4.5) ||
      (ratingFilter === '4to4.5' && studio.rating >= 4 && studio.rating < 4.5) ||
      (ratingFilter === 'below4' && studio.rating < 4);
    
    return matchesSearch && matchesStatus && matchesRating;
  }).sort((a, b) => {
    return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
  });

  const totalStudios = studiosData.length;
  const activeStudios = studiosData.filter(s => s.status).length;
  const inactiveStudios = studiosData.filter(s => !s.status).length;
  const avgSackValue = 396;

  const handleStatusToggle = (id: number, currentStatus: boolean) => {
    const updatedStudios = studiosData.map(studio => 
      studio.id === id ? { ...studio, status: !currentStatus } : studio
    );
    
    setStudiosData(updatedStudios);
    localStorage.setItem('laundryStudios', JSON.stringify(updatedStudios));
    
    toast({
      title: `Studio ${currentStatus ? 'Deactivated' : 'Activated'}`,
      description: `The studio has been ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
    });
  };

  const handleDeleteStudio = (id: number) => {
    const updatedStudios = studiosData.filter(studio => studio.id !== id);
    setStudiosData(updatedStudios);
    localStorage.setItem('laundryStudios', JSON.stringify(updatedStudios));
    
    toast({
      title: "Studio Deleted",
      description: "The studio has been deleted successfully.",
    });
  };

  const handleAddNew = () => {
    navigate('/studios/add');
  };

  const handleViewEditStudio = (id: number) => {
    navigate(`/studios/edit/${id}`);
  };

  return (
    <Layout activeSection="studios">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Studios</h1>
              <p className="text-gray-500">Manage all your laundry partners</p>
            </div>
            <Button onClick={handleAddNew} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add New Studio
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Studios</p>
                  <h3 className="text-2xl font-bold">{totalStudios}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Filter className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Studios</p>
                  <h3 className="text-2xl font-bold">{activeStudios}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Filter className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Inactive Studios</p>
                  <h3 className="text-2xl font-bold">{inactiveStudios}</h3>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Sack Value</p>
                  <h3 className="text-2xl font-bold">₹{avgSackValue}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search studios..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Select 
                value={statusFilter || ''} 
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={ratingFilter || ''} 
                onValueChange={(value) => setRatingFilter(value || null)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="above4.5">Above 4.5</SelectItem>
                  <SelectItem value="4to4.5">4.0 - 4.5</SelectItem>
                  <SelectItem value="below4">Below 4.0</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="w-full md:w-auto"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortDirection === 'asc' ? 'Oldest First' : 'Newest First'}
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Studio ID</TableHead>
                  <TableHead>Studio Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudios.length > 0 ? (
                  filteredStudios.map((studio) => (
                    <TableRow key={studio.id}>
                      <TableCell className="font-medium">{studio.studioId}</TableCell>
                      <TableCell>{studio.studioName}</TableCell>
                      <TableCell>{studio.ownerName}</TableCell>
                      <TableCell>{studio.contact}</TableCell>
                      <TableCell>{studio.services}</TableCell>
                      <TableCell className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        {studio.rating.toFixed(1)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={studio.status} 
                            onCheckedChange={() => handleStatusToggle(studio.id, studio.status)}
                          />
                          <span className={studio.status ? "text-green-600" : "text-gray-400"}>
                            {studio.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Payments
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleViewEditStudio(studio.id)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              View/Edit Studio Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Package className="h-4 w-4 mr-2" />
                              View/Edit Services
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <BarChart className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteStudio(studio.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Studio
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No studios found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Studios;
