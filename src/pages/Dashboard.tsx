import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Building2, Package, ShoppingBag, ArrowRight, Check, XCircle, FolderTree, Truck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServicesData } from '@/hooks/useServicesData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { services, subServices } = useServicesData();
  const [studios, setStudios] = useState<any[]>([]);
  
  useEffect(() => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios) {
      const parsedStudios = JSON.parse(savedStudios);
      setStudios(parsedStudios);
    }
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

  return (
    <Layout activeSection="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your laundry management dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <div className="glass-card p-6 space-y-2 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold">1,257</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>
          
          <div className="glass-card p-6 space-y-2 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-gray-500">Active Studios</h3>
            <p className="text-3xl font-bold">{activeStudios}</p>
            <p className="text-sm text-green-600">+{activeStudios > 0 ? Math.floor(activeStudios / totalStudios * 100) : 0}% active</p>
          </div>
          
          <div className="glass-card p-6 space-y-2 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
            <p className="text-3xl font-bold">₹24,568</p>
            <p className="text-sm text-green-600">+18% from last month</p>
          </div>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          <Card className="p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Studios</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/studios')}
                className="text-laundry-blue hover:text-laundry-blue-dark"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-blue rounded-lg p-4 flex items-center shadow-sm">
                <div className="p-3 bg-white/80 rounded-lg text-blue-500 mr-3">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Studios</p>
                  <p className="text-2xl font-bold">{totalStudios}</p>
                </div>
              </div>
              
              <div className="bg-gradient-green rounded-lg p-4 flex items-center shadow-sm">
                <div className="p-3 bg-white/80 rounded-lg text-green-500 mr-3">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Studios</p>
                  <p className="text-2xl font-bold">{activeStudios}</p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[220px] rounded-md border p-4">
              <div className="space-y-4">
                {studios.length > 0 ? (
                  studios.slice(0, 4).map((studio) => (
                    <div 
                      key={studio.id} 
                      className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded-md"
                      onClick={() => navigate(`/studios/${studio.id}`)}
                    >
                      <div>
                        <p className="font-medium">{studio.studioName}</p>
                        <p className="text-sm text-gray-500">{studio.ownerName} • {studio.services} services</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${studio.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {studio.status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No studios yet. Add your first studio.</p>
                    <Button 
                      className="mt-4 bg-laundry-blue hover:bg-laundry-blue-dark text-white"
                      onClick={() => navigate('/studios/add')}
                    >
                      Add Studio
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
          
          <Card className="p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Services</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/services')}
                className="text-laundry-blue hover:text-laundry-blue-dark"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-purple rounded-lg p-4 flex items-center shadow-sm">
                <div className="p-3 bg-white/80 rounded-lg text-purple-500 mr-3">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold">{totalServices}</p>
                </div>
              </div>
              
              <div className="bg-gradient-teal rounded-lg p-4 flex items-center shadow-sm">
                <div className="p-3 bg-white/80 rounded-lg text-teal-500 mr-3">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Services</p>
                  <p className="text-2xl font-bold">{activeServices}</p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[220px] rounded-md border p-4">
              <div className="space-y-4">
                {services.length > 0 ? (
                  services.slice(0, 4).map((service) => (
                    <div 
                      key={service.id} 
                      className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded-md"
                      onClick={() => navigate('/services')}
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-500">Service ID: {service.id.substring(0, 8)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${service.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {service.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <p>No services yet. Add your first service.</p>
                    <Button 
                      className="mt-4 bg-laundry-blue hover:bg-laundry-blue-dark text-white"
                      onClick={() => navigate('/services')}
                    >
                      Add Service
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Order #{1000 + item}</p>
                    <p className="text-sm text-gray-500">Standard Wash • 2 items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹24.99</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
              <button className="text-laundry-blue font-medium hover:text-laundry-blue-dark transition-colors">
                View all orders
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Popular Services</h2>
            <div className="space-y-4">
              {[
                { name: 'Standard Wash', percentage: 45 },
                { name: 'Premium Wash', percentage: 30 },
                { name: 'Dry Cleaning', percentage: 15 },
                { name: 'Ironing', percentage: 10 },
              ].map((service) => (
                <div key={service.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">{service.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-laundry-blue to-blue-600 h-2 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
