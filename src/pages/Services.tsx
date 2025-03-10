import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Search, Plus, ArrowLeft, Package, Layers, Shirt } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
}

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();
  
  const tabs = [
    { id: 'services', label: 'Services', icon: Package },
    { id: 'sub-services', label: 'Sub-services', icon: Layers },
    { id: 'clothing-items', label: 'Clothing Items', icon: Shirt }
  ];

  const handleAddService = () => {
    if (!newServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name cannot be empty",
      });
      return;
    }

    const newService = {
      id: Date.now().toString(),
      name: newServiceName.trim()
    };

    setServices([...services, newService]);
    setNewServiceName('');
    setIsAddServiceOpen(false);
    
    toast({
      title: "Success",
      description: "Service added successfully",
    });
  };

  return (
    <Layout activeSection="services">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
            <p className="text-gray-500">Manage all laundry services, subservices, and clothing items</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm border border-gray-100' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-laundry-blue' : 'text-gray-500'} />
                <span className={activeTab === tab.id ? 'font-medium' : ''}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-laundry-blue focus:border-transparent"
            />
          </div>
          
          <Button 
            className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white"
            onClick={() => setIsAddServiceOpen(true)}
          >
            <Plus size={18} />
            <span>Add Service</span>
          </Button>
        </div>
        
        <div className="bg-white p-8 min-h-[300px] rounded-lg border border-gray-100 shadow-sm">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-800">{service.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">No services found. Try adjusting your search.</p>
            </div>
          )}
        </div>

        <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter service name"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setNewServiceName('');
                  setIsAddServiceOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddService}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Services;
