
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash, FileText, Search, Check, ChevronsUpDown } from "lucide-react";
import { Service, SubService, ClothingItem } from "@/types/services";
import { cn } from "@/lib/utils";

interface SubServiceItem {
  id: string;
  name: string;
  pricePerKg: string;
  pricePerItem: string;
  selectedItems: string[];
}

interface AddServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  subServices: SubService[];
  clothingItems: ClothingItem[];
  onServiceAdded: (data: any) => void;
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  onOpenChange,
  services,
  subServices,
  clothingItems,
  onServiceAdded
}) => {
  const safeServices = Array.isArray(services) ? services : [];
  const safeSubServices = Array.isArray(subServices) ? subServices : [];
  const safeClothingItems = Array.isArray(clothingItems) ? clothingItems : [];

  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedServiceName, setSelectedServiceName] = useState<string>("");
  const [openServiceCombobox, setOpenServiceCombobox] = useState(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  
  const [subServiceItems, setSubServiceItems] = useState<SubServiceItem[]>([
    {
      id: Date.now().toString(),
      name: "",
      pricePerKg: "",
      pricePerItem: "",
      selectedItems: []
    }
  ]);
  
  const [openSubServiceComboboxes, setOpenSubServiceComboboxes] = useState<Record<string, boolean>>({});
  const [subServiceSearchQueries, setSubServiceSearchQueries] = useState<Record<string, string>>({});
  const [selectedSubServiceNames, setSelectedSubServiceNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setSelectedService("");
      setSelectedServiceName("");
      setServiceSearchQuery("");
      setSubServiceItems([{
        id: Date.now().toString(),
        name: "",
        pricePerKg: "",
        pricePerItem: "",
        selectedItems: []
      }]);
      setSubServiceSearchQueries({});
      setOpenServiceCombobox(false);
      setOpenSubServiceComboboxes({});
      setSelectedSubServiceNames({});
    }
  }, [isOpen]);

  const handleAddSubService = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "",
      pricePerKg: "",
      pricePerItem: "",
      selectedItems: []
    };
    
    setSubServiceItems([...subServiceItems, newItem]);
    
    setSubServiceSearchQueries(prev => ({
      ...prev,
      [newItem.id]: ""
    }));
    
    setSelectedSubServiceNames(prev => ({
      ...prev,
      [newItem.id]: ""
    }));
  };

  const handleRemoveSubService = (id: string) => {
    setSubServiceItems(subServiceItems.filter(item => item.id !== id));
    
    const newSearchQueries = { ...subServiceSearchQueries };
    delete newSearchQueries[id];
    setSubServiceSearchQueries(newSearchQueries);
    
    const newOpenStates = { ...openSubServiceComboboxes };
    delete newOpenStates[id];
    setOpenSubServiceComboboxes(newOpenStates);
    
    const newSubServiceNames = { ...selectedSubServiceNames };
    delete newSubServiceNames[id];
    setSelectedSubServiceNames(newSubServiceNames);
  };

  const handleSubServiceChange = (id: string, field: keyof SubServiceItem, value: string) => {
    setSubServiceItems(subServiceItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleServiceSelect = (serviceId: string, serviceName: string) => {
    setSelectedService(serviceId);
    setSelectedServiceName(serviceName);
    setOpenServiceCombobox(false);
  };

  const handleSubServiceSelect = (subServiceId: string, subServiceItemId: string, subServiceName: string) => {
    handleSubServiceChange(subServiceItemId, 'name', subServiceId);
    setSelectedSubServiceNames(prev => ({
      ...prev,
      [subServiceItemId]: subServiceName
    }));
    setOpenSubServiceComboboxes(prev => ({
      ...prev,
      [subServiceItemId]: false
    }));
  };

  const toggleSubServiceCombobox = (id: string, isOpen: boolean) => {
    setOpenSubServiceComboboxes(prev => ({
      ...prev,
      [id]: isOpen
    }));
  };

  const updateSubServiceSearchQuery = (id: string, query: string) => {
    setSubServiceSearchQueries(prev => ({
      ...prev,
      [id]: query
    }));
  };

  const getFilteredServices = () => {
    if (!serviceSearchQuery.trim()) return safeServices;
    const query = serviceSearchQuery.toLowerCase();
    return safeServices.filter(service => 
      service.name.toLowerCase().includes(query)
    );
  };

  const getFilteredSubServices = (id: string) => {
    const query = (subServiceSearchQueries[id] || "").toLowerCase().trim();
    if (!query) return safeSubServices;
    return safeSubServices.filter(subService => 
      subService.name.toLowerCase().includes(query)
    );
  };

  const handleSave = () => {
    const formData = {
      serviceId: selectedService,
      subServices: subServiceItems
    };
    
    onServiceAdded(formData);
    
    setSelectedService("");
    setSelectedServiceName("");
    setSubServiceItems([{
      id: Date.now().toString(),
      name: "",
      pricePerKg: "",
      pricePerItem: "",
      selectedItems: []
    }]);
    setServiceSearchQuery("");
    setSubServiceSearchQueries({});
    setSelectedSubServiceNames({});
    onOpenChange(false);
  };

  const getSelectedSubServiceName = (id: string) => {
    return selectedSubServiceNames[id] || "";
  };

  const filteredServices = getFilteredServices();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-blue-600 font-semibold">Add Service</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Add a new service with its subservices and items
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <label htmlFor="serviceName" className="text-base font-medium">
              Service Name
            </label>
            <Popover open={openServiceCombobox} onOpenChange={setOpenServiceCombobox}>
              <PopoverTrigger asChild>
                <div className="relative w-full rounded-lg border border-gray-200 bg-white">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter or select service..."
                    className="h-12 w-full rounded-lg border-none pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedServiceName}
                    onChange={(e) => setSelectedServiceName(e.target.value)}
                    onClick={() => setOpenServiceCombobox(true)}
                    readOnly
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[calc(100%-2rem)] p-0 rounded-md shadow-md border border-gray-200 bg-white overflow-hidden" 
                align="start" 
                sideOffset={4}
                style={{ zIndex: 50 }}
              >
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      className="w-full pl-10 py-2 text-sm rounded-md border-0 bg-gray-50 focus:outline-none"
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {filteredServices.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No service found.</div>
                  ) : (
                    <div>
                      {filteredServices.map((service) => (
                        <button
                          key={service.id}
                          className={cn(
                            "w-full text-left px-4 py-3 cursor-pointer hover:bg-blue-50",
                            selectedService === service.id ? "bg-blue-50" : ""
                          )}
                          onClick={() => handleServiceSelect(service.id, service.name)}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="text-base font-medium mb-2">Sub Services</h3>
            
            {subServiceItems.map((subServiceItem, index) => (
              <div key={subServiceItem.id} className="border rounded-lg p-4 mb-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-base font-medium">
                      Sub Service Name
                    </label>
                    <Popover
                      open={openSubServiceComboboxes[subServiceItem.id] || false}
                      onOpenChange={(isOpen) => toggleSubServiceCombobox(subServiceItem.id, isOpen)}
                    >
                      <PopoverTrigger asChild>
                        <div className="relative w-full rounded-lg border border-gray-200 bg-white">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="h-4 w-4" />
                          </div>
                          <input
                            type="text"
                            placeholder="Select a subservice..."
                            className="h-10 w-full rounded-lg border-none pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={getSelectedSubServiceName(subServiceItem.id)}
                            onChange={(e) => {
                              setSelectedSubServiceNames(prev => ({
                                ...prev,
                                [subServiceItem.id]: e.target.value
                              }));
                            }}
                            onClick={() => toggleSubServiceCombobox(subServiceItem.id, true)}
                            readOnly
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-[calc(100%-2rem)] p-0 rounded-md shadow-md border border-gray-200 bg-white overflow-hidden" 
                        align="start" 
                        sideOffset={4}
                        style={{ zIndex: 50 }}
                      >
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search sub-services..."
                              className="w-full pl-10 py-2 text-sm rounded-md border-0 bg-gray-50 focus:outline-none"
                              value={subServiceSearchQueries[subServiceItem.id] || ""}
                              onChange={(e) => updateSubServiceSearchQuery(subServiceItem.id, e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {getFilteredSubServices(subServiceItem.id).length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No sub-service found.</div>
                          ) : (
                            <div>
                              {getFilteredSubServices(subServiceItem.id).map((subService) => (
                                <button
                                  key={subService.id}
                                  className={cn(
                                    "w-full text-left px-4 py-3 cursor-pointer hover:bg-blue-50",
                                    subServiceItem.name === subService.id ? "bg-blue-50" : ""
                                  )}
                                  onClick={() => handleSubServiceSelect(subService.id, subServiceItem.id, subService.name)}
                                >
                                  {subService.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-base font-medium">
                        Price per KG
                      </label>
                      <Input 
                        placeholder="Enter price" 
                        value={subServiceItem.pricePerKg} 
                        onChange={(e) => handleSubServiceChange(subServiceItem.id, 'pricePerKg', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-base font-medium">
                        Price per Item
                      </label>
                      <Input 
                        placeholder="Enter price" 
                        value={subServiceItem.pricePerItem} 
                        onChange={(e) => handleSubServiceChange(subServiceItem.id, 'pricePerItem', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="bg-blue-50 text-blue-600 border-blue-200"
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      Add Items
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="text-red-600 border-red-200"
                      onClick={() => index > 0 && handleRemoveSubService(subServiceItem.id)}
                      disabled={index === 0}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button 
              type="button" 
              variant="outline" 
              className="bg-blue-50 text-blue-600"
              onClick={handleAddSubService}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Sub Service
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
