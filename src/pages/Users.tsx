
import React from 'react';
import Layout from '../components/layout/Layout';
import { Search, Download, Users as UsersIcon, Activity, Trash, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUsers } from '@/hooks/useUsers';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Users: React.FC = () => {
  const { users, loading, searchTerm, setSearchTerm, userStats, dateRange, setDateRange } = useUsers();

  // Stat cards for user metrics
  const StatCard = ({ icon: Icon, value, label, color }: { 
    icon: React.ElementType, 
    value: number, 
    label: string, 
    color: string 
  }) => (
    <Card className="bg-white">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout activeSection="users">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Users</h1>
            <p className="text-gray-600 mt-1">Manage staff and customer accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar size={16} />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <span>
                          {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                        </span>
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span>Select date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3">
                    <CalendarComponent
                      mode="range"
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to,
                      }}
                      onSelect={(range) => {
                        setDateRange({
                          from: range?.from,
                          to: range?.to,
                        });
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                    {(dateRange.from || dateRange.to) && (
                      <Button
                        variant="ghost"
                        className="mt-2"
                        onClick={() => setDateRange({ from: undefined, to: undefined })}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={Download} 
            value={userStats.totalDownloads} 
            label="Total Downloads" 
            color="bg-blue-500"
          />
          <StatCard 
            icon={UsersIcon} 
            value={userStats.registeredUsers} 
            label="Registered Users" 
            color="bg-green-500"
          />
          <StatCard 
            icon={Activity} 
            value={userStats.activeUsers} 
            label="Active Users" 
            color="bg-orange-500"
          />
          <StatCard 
            icon={Trash} 
            value={userStats.uninstalls} 
            label="Uninstalls" 
            color="bg-red-500"
          />
        </div>

        {/* Search bar and user table */}
        <div className="glass-card p-6">
          <div className="pb-6 flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Sl No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Email ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Order Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>{user.device}</TableCell>
                        <TableCell className="text-right">{user.ordersCount}</TableCell>
                        <TableCell className="text-right">₹{user.totalOrderValue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Users;
