
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, XCircle, FolderTree, Truck, Users, Clock, Package, CheckCircle, AlertTriangle, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServicesData } from '@/hooks/useServicesData';
import OrdersSection from '@/components/dashboard/OrdersSection';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { services, subServices } = useServicesData();
  const [studios, setStudios] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  useEffect(() => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios) {
      const parsedStudios = JSON.parse(savedStudios);
      setStudios(parsedStudios);
    }
    
    setDrivers([
      { id: 1, name: 'John Doe', status: true },
      { id: 2, name: 'Jane Smith', status: true },
      { id: 3, name: 'Bob Johnson', status: true },
      { id: 4, name: 'Alice Brown', status: true },
      { id: 5, name: 'Charlie Wilson', status: true },
      { id: 6, name: 'Diana Lee', status: true },
      { id: 7, name: 'Edward Miller', status: true },
      { id: 8, name: 'Fiona Clark', status: true },
      { id: 9, name: 'George Davis', status: true },
      { id: 10, name: 'Helen Taylor', status: false },
      { id: 11, name: 'Ian Jackson', status: false },
    ]);
  }, []);

  const totalStudios = studios.length;
  const activeStudios = studios.filter(studio => studio.status).length;
  const inactiveStudios = totalStudios - activeStudios;
  
  const totalServices = services.length;
  const activeServices = services.filter(service => service.active).length;
  const inactiveServices = totalServices - activeServices;
  
  const totalSubServices = subServices.length;
  const activeSubServices = subServices.filter(subService => subService.active).length;
  const inactiveSubServices = totalSubServices - activeSubServices;

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(driver => driver.status).length;
  const inactiveDrivers = totalDrivers - activeDrivers;

  return (
    <Layout activeSection="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your laundry management dashboard</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Orders</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">26</p>
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
                  <p className="text-3xl font-bold text-gray-800 mt-2">10</p>
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
                  <p className="text-3xl font-bold text-gray-800 mt-2">2</p>
                </div>
                <div className="bg-amber-50 rounded-full p-3 text-white">
                  <Package className="h-5 w-5" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-yellow-50 border-yellow-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm">Ready for Collection</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">7</p>
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
                  <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
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
                  <p className="text-3xl font-bold text-gray-800 mt-2">1</p>
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
                  <p className="text-3xl font-bold text-gray-800 mt-2">10</p>
                </div>
                <div className="bg-cyan-500 rounded-full p-3 text-white">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Studios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-blue-500">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Studios</p>
                  <p className="text-2xl font-bold text-gray-800">{totalStudios}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-green-50 border-green-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Active Studios</p>
                  <p className="text-2xl font-bold text-gray-800">{activeStudios}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-red-50 border-red-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-red-500">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Inactive Studios</p>
                  <p className="text-2xl font-bold text-gray-800">{inactiveStudios}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-purple-50 border-purple-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-purple-500">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Avg. Sack Value</p>
                  <p className="text-2xl font-bold text-gray-800">₹396</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Drivers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-6 bg-bright-blue border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Drivers</p>
                  <p className="text-3xl font-bold text-gray-800">{totalDrivers}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full text-white">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-bright-green border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Drivers</p>
                  <p className="text-3xl font-bold text-gray-800">{activeDrivers}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full text-white">
                  <Truck className="h-6 w-6" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-bright-purple border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Inactive Drivers</p>
                  <p className="text-3xl font-bold text-gray-800">{inactiveDrivers}</p>
                </div>
                <div className="p-3 bg-gray-500 rounded-full text-white">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Services and Sub-services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-blue-500">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Services</p>
                  <p className="text-2xl font-bold text-gray-800">{totalServices}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-green-50 border-green-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-green-500">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Active Services</p>
                  <p className="text-2xl font-bold text-gray-800">{activeServices}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-red-50 border-red-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-red-500">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Inactive Services</p>
                  <p className="text-2xl font-bold text-gray-800">{inactiveServices}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-purple-50 border-purple-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-purple-500">
                  <FolderTree className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Sub-services</p>
                  <p className="text-2xl font-bold text-gray-800">{totalSubServices}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-emerald-50 border-emerald-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-emerald-500">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Active Sub-services</p>
                  <p className="text-2xl font-bold text-gray-800">{activeSubServices}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-orange-50 border-orange-100 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg text-orange-500">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Inactive Sub-services</p>
                  <p className="text-2xl font-bold text-gray-800">{inactiveSubServices}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
