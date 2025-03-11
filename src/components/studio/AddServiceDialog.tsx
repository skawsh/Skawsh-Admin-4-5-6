
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash, FileText, Search, Check, ChevronsUpDown } from "lucide-react";
import { Service, SubService, ClothingItem } from "@/types/services";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            
            <Select value={selectedService} onValueChange={(value) => {
              const service = safeServices.find(s => s.id === value);
              if (service) {
                handleServiceSelect(service.id, service.name);
              }
            }}>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Select a service">
                  {selectedServiceName || "Select a service"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {safeServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    
                    <Select 
                      value={subServiceItem.name || ""} 
                      onValueChange={(value) => {
                        const subService = safeSubServices.find(s => s.id === value);
                        if (subService) {
                          handleSubServiceSelect(subService.id, subServiceItem.id, subService.name);
                        }
                      }}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select a subservice">
                          {getSelectedSubServiceName(subServiceItem.id) || "Select a subservice"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {safeSubServices.map((subService) => (
                          <SelectItem key={subService.id} value={subService.id}>
                            {subService.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
