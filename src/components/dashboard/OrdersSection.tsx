
import React, { useState } from 'react';
import { Package, CheckCircle, Truck, AlertTriangle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Mock order data with dates for filtering
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
  }
};

const OrdersSection: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const orderData = mockOrdersData[timeFilter];

  const handleFilterChange = (value: string) => {
    setTimeFilter(value as 'all' | 'daily' | 'weekly' | 'monthly');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Orders</h2>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
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
