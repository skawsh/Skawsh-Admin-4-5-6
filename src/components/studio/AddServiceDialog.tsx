import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { Service, SubService, ClothingItem } from "@/types/services";
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
  
  const [subServiceItems, setSubServiceItems] = useState<SubServiceItem[]>([
    {
      id: Date.now().toString(),
      name: "",
      pricePerKg: "",
      pricePerItem: "",
      selectedItems: []
    }
  ]);
  
  const [selectedSubServiceNames, setSelectedSubServiceNames] = useState<Record<string, string>>({});
  const [selectedClothingItems, setSelectedClothingItems] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!isOpen) {
      setSelectedService("");
      setSelectedServiceName("");
      setSubServiceItems([{
        id: Date.now().toString(),
        name: "",
        pricePerKg: "",
        pricePerItem: "",
        selectedItems: []
      }]);
      setSelectedSubServiceNames({});
      setSelectedClothingItems({});
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
    setSelectedSubServiceNames(prev => ({
      ...prev,
      [newItem.id]: ""
    }));
    setSelectedClothingItems(prev => ({
      ...prev,
      [newItem.id]: []
    }));
  };

  const handleRemoveSubService = (id: string) => {
    setSubServiceItems(subServiceItems.filter(item => item.id !== id));
    
    const newSubServiceNames = { ...selectedSubServiceNames };
    delete newSubServiceNames[id];
    setSelectedSubServiceNames(newSubServiceNames);
    
    const newClothingItems = { ...selectedClothingItems };
    delete newClothingItems[id];
    setSelectedClothingItems(newClothingItems);
  };

  const handleSubServiceChange = (id: string, field: keyof SubServiceItem, value: string | string[]) => {
    setSubServiceItems(subServiceItems.map(item => 
      item.id === id ? { 
        ...item, 
        [field]: field === 'selectedItems' ? value : value 
      } : item
    ));
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = safeServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service.id);
      setSelectedServiceName(service.name);
    }
  };

  const handleSubServiceSelect = (subServiceId: string, subServiceItemId: string) => {
    const subService = safeSubServices.find(s => s.id === subServiceId);
    if (subService) {
      handleSubServiceChange(subServiceItemId, 'name', subServiceId);
      setSelectedSubServiceNames(prev => ({
        ...prev,
        [subServiceItemId]: subService.name
      }));
    }
  };

  const handleClothingItemSelect = (subServiceItemId: string, value: string) => {
    const currentItems = selectedClothingItems[subServiceItemId] || [];
    let newItems: string[];
    
    if (currentItems.includes(value)) {
      newItems = currentItems.filter(item => item !== value);
    } else {
      newItems = [...currentItems, value];
    }
    
    setSelectedClothingItems(prev => ({
      ...prev,
      [subServiceItemId]: newItems
    }));
    
    handleSubServiceChange(subServiceItemId, 'selectedItems', newItems);
  };

  const getSelectedSubServiceName = (id: string) => {
    return selectedSubServiceNames[id] || "";
  };

  const getSelectedClothingItems = (subServiceItemId: string) => {
    return selectedClothingItems[subServiceItemId] || [];
  };

  const isClothingItemSelected = (subServiceItemId: string, itemId: string) => {
    const items = selectedClothingItems[subServiceItemId] || [];
    return items.includes(itemId);
  };

  const handleSave = () => {
    const formData = {
      serviceId: selectedService,
      subServices: subServiceItems.map(item => ({
        ...item,
        selectedItems: selectedClothingItems[item.id] || []
      }))
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
    setSelectedSubServiceNames({});
    setSelectedClothingItems({});
    onOpenChange(false);
  };

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
            
            <Select value={selectedService} onValueChange={handleServiceSelect}>
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
                      onValueChange={(value) => handleSubServiceSelect(value, subServiceItem.id)}
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

                  <div className="space-y-2">
                    <label className="text-base font-medium">
                      Clothing Items
                    </label>
                    <Select>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select clothing items">
                          {getSelectedClothingItems(subServiceItem.id).length > 0 
                            ? `${getSelectedClothingItems(subServiceItem.id).length} items selected` 
                            : "Select clothing items"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {safeClothingItems.map((item) => (
                          <div key={item.id} className="px-2 py-1.5">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500"
                                checked={isClothingItemSelected(subServiceItem.id, item.id)}
                                onChange={() => handleClothingItemSelect(subServiceItem.id, item.id)}
                              />
                              <span>{item.name}</span>
                            </label>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-3">
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
