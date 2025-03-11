
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useToast } from "@/hooks/use-toast";
import { Service, SubService, ClothingItem, ItemType } from '../types/services';
import TabNavigation from '../components/services/TabNavigation';
import ServicesList from '../components/services/ServicesList';
import SubServicesList from '../components/services/SubServicesList';
import ClothingItemsList from '../components/services/ClothingItemsList';
import ServicesHeader from '../components/services/ServicesHeader';
import AddItemDialog from '../components/services/AddItemDialog';
import EditItemDialog from '../components/services/EditItemDialog';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // State for services, sub-services, and clothing items
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  // State for add dialogs
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddSubServiceOpen, setIsAddSubServiceOpen] = useState(false);
  const [isAddClothingItemOpen, setIsAddClothingItemOpen] = useState(false);
  
  // State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemType | null>(null);
  const [editItemName, setEditItemName] = useState('');
  
  // State for new item names
  const [newServiceName, setNewServiceName] = useState('');
  const [newSubServiceName, setNewSubServiceName] = useState('');
  const [newClothingItemName, setNewClothingItemName] = useState('');

  // Load data from localStorage
  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved data"
      });
    }
  }, []);

  // Function to get tab information based on active tab
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

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchTerm('');
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle add button click
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

  // Handle add service
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

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    
    try {
      localStorage.setItem('services', JSON.stringify(updatedServices));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    setNewServiceName('');
    setIsAddServiceOpen(false);
    
    toast({
      title: "Success",
      description: "Service added successfully"
    });
  };

  // Handle add sub-service
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

    const updatedSubServices = [...subServices, newSubService];
    setSubServices(updatedSubServices);
    
    try {
      localStorage.setItem('subServices', JSON.stringify(updatedSubServices));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    setNewSubServiceName('');
    setIsAddSubServiceOpen(false);
    
    toast({
      title: "Success",
      description: "Sub-service added successfully"
    });
  };

  // Handle add clothing item
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

    const updatedClothingItems = [...clothingItems, newClothingItem];
    setClothingItems(updatedClothingItems);
    
    try {
      localStorage.setItem('clothingItems', JSON.stringify(updatedClothingItems));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    setNewClothingItemName('');
    setIsAddClothingItemOpen(false);
    
    toast({
      title: "Success",
      description: "Clothing item added successfully"
    });
  };

  // Handle edit click
  const handleEditClick = (item: ItemType) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setIsEditDialogOpen(true);
  };

  // Handle edit save
  const handleEditSave = () => {
    if (!editingItem || !editItemName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name cannot be empty"
      });
      return;
    }

    if (activeTab === 'sub-services') {
      const updatedSubServices = subServices.map(item => 
        item.id === editingItem.id ? { ...item, name: editItemName.trim() } : item
      );
      setSubServices(updatedSubServices);
      
      try {
        localStorage.setItem('subServices', JSON.stringify(updatedSubServices));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    } else if (activeTab === 'clothing-items') {
      const updatedClothingItems = clothingItems.map(item => 
        item.id === editingItem.id ? { ...item, name: editItemName.trim() } : item
      );
      setClothingItems(updatedClothingItems);
      
      try {
        localStorage.setItem('clothingItems', JSON.stringify(updatedClothingItems));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    } else {
      const updatedServices = services.map(item => 
        item.id === editingItem.id ? { ...item, name: editItemName.trim() } : item
      );
      setServices(updatedServices);
      
      try {
        localStorage.setItem('services', JSON.stringify(updatedServices));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    setEditItemName('');
    
    toast({
      title: "Success",
      description: "Item updated successfully"
    });
  };

  const tabInfo = getTabInfo();

  return (
    <Layout activeSection="services">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        
        {/* Services Header */}
        <ServicesHeader 
          activeTab={activeTab}
          title={tabInfo.title}
          description={tabInfo.description}
          searchPlaceholder={tabInfo.searchPlaceholder}
          addButtonText={tabInfo.addButtonText}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={clearSearch}
          onAddButtonClick={handleAddButtonClick}
        />
        
        {/* Content Area */}
        <div className="bg-white p-8 min-h-[300px] rounded-lg border border-gray-100 shadow-sm">
          {activeTab === 'services' && (
            <ServicesList 
              services={services} 
              onEdit={handleEditClick}
              searchTerm={searchTerm} 
            />
          )}
          
          {activeTab === 'sub-services' && (
            <SubServicesList 
              subServices={subServices} 
              onEdit={handleEditClick}
              searchTerm={searchTerm} 
            />
          )}
          
          {activeTab === 'clothing-items' && (
            <ClothingItemsList 
              clothingItems={clothingItems} 
              onEdit={handleEditClick}
              searchTerm={searchTerm} 
            />
          )}
        </div>
        
        {/* Add Service Dialog */}
        <AddItemDialog 
          isOpen={isAddServiceOpen}
          onOpenChange={setIsAddServiceOpen}
          title="Add New Service"
          placeholder="Enter service name"
          value={newServiceName}
          onChange={setNewServiceName}
          onSave={handleAddService}
        />
        
        {/* Add Sub-service Dialog */}
        <AddItemDialog 
          isOpen={isAddSubServiceOpen}
          onOpenChange={setIsAddSubServiceOpen}
          title="Add New Sub-service"
          placeholder="Enter sub-service name"
          value={newSubServiceName}
          onChange={setNewSubServiceName}
          onSave={handleAddSubService}
        />
        
        {/* Add Clothing Item Dialog */}
        <AddItemDialog 
          isOpen={isAddClothingItemOpen}
          onOpenChange={setIsAddClothingItemOpen}
          title="Add New Clothing Item"
          placeholder="Enter clothing item name"
          value={newClothingItemName}
          onChange={setNewClothingItemName}
          onSave={handleAddClothingItem}
        />
        
        {/* Edit Dialog */}
        <EditItemDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          itemType={activeTab === 'sub-services' ? 'sub-service' : 
                   activeTab === 'clothing-items' ? 'clothing-item' : 'service'}
          value={editItemName}
          onChange={setEditItemName}
          onSave={handleEditSave}
        />
      </div>
    </Layout>
  );
};

export default Services;
