
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { Search, Plus, ArrowLeft, Package, Layers, Shirt, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface Service {
  id: string;
  name: string;
  active: boolean;
}

interface SubService {
  id: string;
  name: string;
  active: boolean;
}

interface ClothingItem {
  id: string;
  name: string;
  active: boolean;
}

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddSubServiceOpen, setIsAddSubServiceOpen] = useState(false);
  const [isAddClothingItemOpen, setIsAddClothingItemOpen] = useState(false);
  
  const [newServiceName, setNewServiceName] = useState('');
  const [newSubServiceName, setNewSubServiceName] = useState('');
  const [newClothingItemName, setNewClothingItemName] = useState('');
  
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    const storedServices = localStorage.getItem('services');
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
    
    const storedSubServices = localStorage.getItem('subServices');
    if (storedSubServices) {
      setSubServices(JSON.parse(storedSubServices));
    }
    
    const storedClothingItems = localStorage.getItem('clothingItems');
    if (storedClothingItems) {
      setClothingItems(JSON.parse(storedClothingItems));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);
  
  useEffect(() => {
    localStorage.setItem('subServices', JSON.stringify(subServices));
  }, [subServices]);
  
  useEffect(() => {
    localStorage.setItem('clothingItems', JSON.stringify(clothingItems));
  }, [clothingItems]);

  const tabs = [
    { id: 'services', label: 'Services', icon: Package },
    { id: 'sub-services', label: 'Sub-services', icon: Layers },
    { id: 'clothing-items', label: 'Clothing Items', icon: Shirt }
  ];

  // Get the appropriate title and placeholder based on active tab
  const getTabInfo = () => {
    switch (activeTab) {
      case 'sub-services':
        return {
          title: 'Sub-services Management',
          description: 'Manage all sub-services for your laundry business',
          searchPlaceholder: 'Search sub-services...',
          addButtonText: 'Add Sub-service'
        };
      case 'clothing-items':
        return {
          title: 'Clothing Items Management',
          description: 'Manage all clothing items for your laundry services',
          searchPlaceholder: 'Search clothing items...',
          addButtonText: 'Add Clothing Item'
        };
      default:
        return {
          title: 'Services Management',
          description: 'Manage all laundry services, subservices, and clothing items',
          searchPlaceholder: 'Search services...',
          addButtonText: 'Add Service'
        };
    }
  };

  const handleAddService = () => {
    if (!newServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name cannot be empty"
      });
      return;
    }

    const newService = {
      id: Date.now().toString(),
      name: newServiceName.trim(),
      active: true
    };

    setServices([...services, newService]);
    setNewServiceName('');
    setIsAddServiceOpen(false);
    
    toast({
      title: "Success",
      description: "Service added successfully"
    });
  };

  const handleAddSubService = () => {
    if (!newSubServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sub-service name cannot be empty"
      });
      return;
    }

    const newSubService = {
      id: Date.now().toString(),
      name: newSubServiceName.trim(),
      active: true
    };

    setSubServices([...subServices, newSubService]);
    setNewSubServiceName('');
    setIsAddSubServiceOpen(false);
    
    toast({
      title: "Success",
      description: "Sub-service added successfully"
    });
  };

  const handleAddClothingItem = () => {
    if (!newClothingItemName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Clothing item name cannot be empty"
      });
      return;
    }

    const newClothingItem = {
      id: Date.now().toString(),
      name: newClothingItemName.trim(),
      active: true
    };

    setClothingItems([...clothingItems, newClothingItem]);
    setNewClothingItemName('');
    setIsAddClothingItemOpen(false);
    
    toast({
      title: "Success",
      description: "Clothing item added successfully"
    });
  };

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    ));
    
    const service = services.find(s => s.id === id);
    const newStatus = service ? !service.active : false;
    
    toast({
      title: "Status Updated",
      description: `Service ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  };

  const toggleSubServiceStatus = (id: string) => {
    setSubServices(subServices.map(subService => 
      subService.id === id ? { ...subService, active: !subService.active } : subService
    ));
    
    const subService = subServices.find(s => s.id === id);
    const newStatus = subService ? !subService.active : false;
    
    toast({
      title: "Status Updated",
      description: `Sub-service ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  };

  const toggleClothingItemStatus = (id: string) => {
    setClothingItems(clothingItems.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
    
    const item = clothingItems.find(i => i.id === id);
    const newStatus = item ? !item.active : false;
    
    toast({
      title: "Status Updated",
      description: `Clothing item ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  };

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    
    toast({
      title: "Service Deleted",
      description: "Service removed successfully"
    });
  };

  const deleteSubService = (id: string) => {
    setSubServices(subServices.filter(subService => subService.id !== id));
    
    toast({
      title: "Sub-service Deleted",
      description: "Sub-service removed successfully"
    });
  };

  const deleteClothingItem = (id: string) => {
    setClothingItems(clothingItems.filter(item => item.id !== id));
    
    toast({
      title: "Clothing Item Deleted",
      description: "Clothing item removed successfully"
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter the current active tab items
  const getFilteredItems = () => {
    switch (activeTab) {
      case 'sub-services':
        return subServices.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 'clothing-items':
        return clothingItems.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return services.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
  };

  const filteredItems = getFilteredItems();
  const tabInfo = getTabInfo();

  const handleAddButtonClick = () => {
    switch (activeTab) {
      case 'sub-services':
        setIsAddSubServiceOpen(true);
        break;
      case 'clothing-items':
        setIsAddClothingItemOpen(true);
        break;
      default:
        setIsAddServiceOpen(true);
        break;
    }
  };

  return (
    <Layout activeSection="services">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{tabInfo.title}</h1>
            <p className="text-gray-500">{tabInfo.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab.id ? 'bg-white shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-50'
                }`} 
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-laundry-blue' : 'text-gray-500'} />
                <span className={activeTab === tab.id ? 'font-medium' : ''}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Search and Add Button */}
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={tabInfo.searchPlaceholder} 
              className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-laundry-blue focus:border-transparent" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <Button 
            className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white"
            onClick={handleAddButtonClick}
          >
            <Plus size={18} />
            <span>{tabInfo.addButtonText}</span>
          </Button>
        </div>
        
        {/* Items List */}
        <div className="bg-white p-8 min-h-[300px] rounded-lg border border-gray-100 shadow-sm">
          {filteredItems.length > 0 ? (
            <div className="space-y-2">
              {filteredItems.map(item => {
                // Determine which icon to use based on the active tab
                const IconComponent = activeTab === 'sub-services' ? Layers : 
                                      activeTab === 'clothing-items' ? Shirt : Package;
                
                // Determine which toggle and delete functions to use based on the active tab
                const toggleStatus = activeTab === 'sub-services' ? toggleSubServiceStatus : 
                                    activeTab === 'clothing-items' ? toggleClothingItemStatus : toggleServiceStatus;
                
                const deleteItem = activeTab === 'sub-services' ? deleteSubService : 
                                  activeTab === 'clothing-items' ? deleteClothingItem : deleteService;
                
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch 
                        checked={item.active} 
                        onCheckedChange={() => toggleStatus(item.id)} 
                        className="data-[state=checked]:bg-green-500"
                      />
                      <button 
                        onClick={() => deleteItem(item.id)} 
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${activeTab === 'sub-services' ? 'sub-service' : 
                                           activeTab === 'clothing-items' ? 'clothing item' : 'service'}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">
                {searchTerm 
                  ? `No ${activeTab === 'sub-services' ? 'sub-services' : 
                       activeTab === 'clothing-items' ? 'clothing items' : 'services'} found. Try adjusting your search.` 
                  : `No ${activeTab === 'sub-services' ? 'sub-services' : 
                       activeTab === 'clothing-items' ? 'clothing items' : 'services'} found. Add ${
                         activeTab === 'sub-services' ? 'a sub-service' : 
                         activeTab === 'clothing-items' ? 'a clothing item' : 'a service'
                       } to get started.`}
              </p>
            </div>
          )}
        </div>

        {/* Add Service Dialog */}
        <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input 
                placeholder="Enter service name" 
                value={newServiceName} 
                onChange={e => setNewServiceName(e.target.value)} 
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

        {/* Add Sub-service Dialog */}
        <Dialog open={isAddSubServiceOpen} onOpenChange={setIsAddSubServiceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sub-service</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input 
                placeholder="Enter sub-service name" 
                value={newSubServiceName} 
                onChange={e => setNewSubServiceName(e.target.value)} 
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewSubServiceName('');
                  setIsAddSubServiceOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddSubService}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Clothing Item Dialog */}
        <Dialog open={isAddClothingItemOpen} onOpenChange={setIsAddClothingItemOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Clothing Item</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input 
                placeholder="Enter clothing item name" 
                value={newClothingItemName} 
                onChange={e => setNewClothingItemName(e.target.value)} 
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewClothingItemName('');
                  setIsAddClothingItemOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddClothingItem}>
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
