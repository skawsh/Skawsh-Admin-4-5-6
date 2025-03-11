
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash, FileText, Search, Check, ChevronsUpDown } from "lucide-react";
import { Service, SubService, ClothingItem } from "@/types/services";
import { cn } from "@/lib/utils";

// Define the types for the form data
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
  // Make sure services, subServices, and clothingItems are initialized as arrays even if they're undefined
  const safeServices = Array.isArray(services) ? services : [];
  const safeSubServices = Array.isArray(subServices) ? subServices : [];
  const safeClothingItems = Array.isArray(clothingItems) ? clothingItems : [];

  const [selectedService, setSelectedService] = useState<string>("");
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

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedService("");
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
    
    // Initialize search state for new item
    setSubServiceSearchQueries(prev => ({
      ...prev,
      [newItem.id]: ""
    }));
  };

  const handleRemoveSubService = (id: string) => {
    setSubServiceItems(subServiceItems.filter(item => item.id !== id));
    
    // Clean up search state
    const newSearchQueries = { ...subServiceSearchQueries };
    delete newSearchQueries[id];
    setSubServiceSearchQueries(newSearchQueries);
    
    const newOpenStates = { ...openSubServiceComboboxes };
    delete newOpenStates[id];
    setOpenSubServiceComboboxes(newOpenStates);
  };

  const handleSubServiceChange = (id: string, field: keyof SubServiceItem, value: string) => {
    setSubServiceItems(subServiceItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
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

  // Improved filtering functions
  const getFilteredServices = () => {
    if (!serviceSearchQuery) return safeServices;
    return safeServices.filter(service => 
      service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())
    );
  };

  const getFilteredSubServices = (id: string) => {
    const query = subServiceSearchQueries[id] || "";
    if (!query) return safeSubServices;
    return safeSubServices.filter(subService => 
      subService.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSave = () => {
    // Here we would typically save the data
    const formData = {
      serviceId: selectedService,
      subServices: subServiceItems
    };
    
    onServiceAdded(formData);
    
    // Reset form and close dialog
    setSelectedService("");
    setSubServiceItems([{
      id: Date.now().toString(),
      name: "",
      pricePerKg: "",
      pricePerItem: "",
      selectedItems: []
    }]);
    setServiceSearchQuery("");
    setSubServiceSearchQueries({});
    onOpenChange(false);
  };

  // Get selected service name for display
  const selectedServiceName = safeServices.find(service => service.id === selectedService)?.name || "Select a service";

  // Get selected subservice name for display
  const getSelectedSubServiceName = (id: string) => {
    const subServiceItem = subServiceItems.find(item => item.id === id);
    if (!subServiceItem || !subServiceItem.name) return "Select a subservice...";
    
    const subService = safeSubServices.find(ss => ss.id === subServiceItem.name);
    return subService?.name || "Select a subservice...";
  };

  // Get filtered services
  const filteredServices = getFilteredServices();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-blue-600 font-semibold">Add Service</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Service Name with Searchable Dropdown */}
          <div className="space-y-2">
            <label htmlFor="serviceName" className="text-base font-medium">
              Service Name
            </label>
            <Popover open={openServiceCombobox} onOpenChange={setOpenServiceCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openServiceCombobox}
                  className="w-full border-2 rounded-lg h-12 justify-between"
                >
                  {selectedServiceName}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start" sideOffset={8}>
                <Command>
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <CommandInput 
                      placeholder="Search services..." 
                      className="h-9 flex-1"
                      value={serviceSearchQuery}
                      onValueChange={setServiceSearchQuery}
                    />
                  </div>
                  <CommandList>
                    <CommandEmpty>No service found.</CommandEmpty>
                    <CommandGroup>
                      {filteredServices.map((service) => (
                        <CommandItem
                          key={service.id}
                          value={service.id}
                          onSelect={(currentValue) => {
                            setSelectedService(currentValue);
                            setOpenServiceCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedService === service.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {service.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sub Services Section */}
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
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSubServiceComboboxes[subServiceItem.id] || false}
                          className="w-full border rounded-lg justify-between"
                        >
                          {getSelectedSubServiceName(subServiceItem.id)}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start" sideOffset={8}>
                        <Command>
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <CommandInput 
                              placeholder="Search sub-services..." 
                              className="h-9 flex-1"
                              value={subServiceSearchQueries[subServiceItem.id] || ""}
                              onValueChange={(query) => updateSubServiceSearchQuery(subServiceItem.id, query)}
                            />
                          </div>
                          <CommandList>
                            <CommandEmpty>No sub-service found.</CommandEmpty>
                            <CommandGroup>
                              {getFilteredSubServices(subServiceItem.id).map((subService) => (
                                <CommandItem
                                  key={subService.id}
                                  value={subService.id}
                                  onSelect={(currentValue) => {
                                    handleSubServiceChange(subServiceItem.id, 'name', currentValue);
                                    toggleSubServiceCombobox(subServiceItem.id, false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      subServiceItem.name === subService.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {subService.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
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
