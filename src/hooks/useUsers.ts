
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: number;
  name: string;
  mobile: string;
  email: string;
  location: string;
  device: string;
  ordersCount: number;
  totalOrderValue: number;
  lastOrderDate: string;
}

export const useUsers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Mock user data
  const mockUsers: User[] = [
    {
      id: 1,
      name: "John Smith",
      mobile: "+91 9876543210",
      email: "john.smith@example.com",
      location: "Mumbai",
      device: "iPhone 13",
      ordersCount: 8,
      totalOrderValue: 4850,
      lastOrderDate: "2024-05-10"
    },
    {
      id: 2,
      name: "Priya Sharma",
      mobile: "+91 8765432109",
      email: "priya.sharma@example.com",
      location: "Delhi",
      device: "Samsung Galaxy S22",
      ordersCount: 12,
      totalOrderValue: 7230,
      lastOrderDate: "2024-05-12"
    },
    {
      id: 3,
      name: "Arun Kumar",
      mobile: "+91 7890123456",
      email: "arun.kumar@example.com",
      location: "Bangalore",
      device: "OnePlus 10",
      ordersCount: 5,
      totalOrderValue: 2900,
      lastOrderDate: "2024-05-08"
    },
    {
      id: 4,
      name: "Meera Patel",
      mobile: "+91 9988776655",
      email: "meera.patel@example.com",
      location: "Hyderabad",
      device: "iPhone 14 Pro",
      ordersCount: 15,
      totalOrderValue: 9450,
      lastOrderDate: "2024-05-14"
    },
    {
      id: 5,
      name: "Rajesh Singh",
      mobile: "+91 8877665544",
      email: "rajesh.singh@example.com",
      location: "Chennai",
      device: "Xiaomi 12",
      ordersCount: 3,
      totalOrderValue: 1850,
      lastOrderDate: "2024-05-01"
    },
    {
      id: 6,
      name: "Neha Gupta",
      mobile: "+91 7766554433",
      email: "neha.gupta@example.com",
      location: "Kolkata",
      device: "Samsung Galaxy A53",
      ordersCount: 9,
      totalOrderValue: 5320,
      lastOrderDate: "2024-05-11"
    }
  ];

  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        try {
          setUsers(mockUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load user data"
          });
        } finally {
          setLoading(false);
        }
      }, 800);
    };

    fetchUsers();
  }, [toast]);

  // Filter users by search term
  const filteredBySearch = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users by date range
  const filteredUsers = filteredBySearch.filter(user => {
    if (!dateRange.from && !dateRange.to) {
      return true;
    }
    
    const userDate = new Date(user.lastOrderDate);
    
    if (dateRange.from && dateRange.to) {
      return userDate >= dateRange.from && userDate <= dateRange.to;
    } else if (dateRange.from) {
      return userDate >= dateRange.from;
    } else if (dateRange.to) {
      return userDate <= dateRange.to;
    }
    
    return true;
  });

  // User statistics for tiles
  const userStats = {
    totalDownloads: 15800,
    registeredUsers: users.length + 438, // Mock total count
    activeUsers: Math.floor((users.length + 438) * 0.78), // ~78% active rate
    uninstalls: 2340
  };

  return {
    users: filteredUsers,
    loading,
    searchTerm,
    setSearchTerm,
    userStats,
    dateRange,
    setDateRange
  };
};
