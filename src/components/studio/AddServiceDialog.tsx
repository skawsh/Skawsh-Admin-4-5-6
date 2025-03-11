
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, FileText } from "lucide-react";
import { Service, SubService, ClothingItem } from "@/types/services";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import AddItemDialog from "@/components/services/AddItemDialog";

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
  
  // New state for the Add Items dialog
  const [isAddItemsDialogOpen, setIsAddItemsDialogOpen] = useState<Record<string, boolean>>({});
  const [activeSubServiceId, setActiveSubServiceId] = useState<string>("");

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
      setIsAddItemsDialogOpen({});
      setActiveSubServiceId("");
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
  };

  const handleRemoveSubService = (id: string) => {
    setSubServiceItems(subServiceItems.filter(item => item.id !== id));
    
    const newSubServiceNames = { ...selectedSubServiceNames };
    delete newSubServiceNames[id];
    setSelectedSubServiceNames(newSubServiceNames);
    
    const newDialogOpen = { ...isAddItemsDialogOpen };
    delete newDialogOpen[id];
    setIsAddItemsDialogOpen(newDialogOpen);
  };

  const handleSubServiceChange = (id: string, field: keyof SubServiceItem, value: string | string[]) => {
    setSubServiceItems(subServiceItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = safeServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(serviceId);
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

  const toggleAddItemsDialog = (id: string, isOpen: boolean) => {
    setActiveSubServiceId(id);
    setIsAddItemsDialogOpen(prev => ({
      ...prev,
      [id]: isOpen
    }));
  };

  const handleItemsSelected = (subServiceItemId: string, selectedItems: string[]) => {
    handleSubServiceChange(subServiceItemId, 'selectedItems', selectedItems);
    toggleAddItemsDialog(subServiceItemId, false);
  };

  const getSelectedClothingItemsCount = (subServiceItemId: string) => {
    const subServiceItem = subServiceItems.find(item => item.id === subServiceItemId);
    return subServiceItem ? subServiceItem.selectedItems.length : 0;
  };

  const getSelectedSubServiceName = (id: string) => {
    return selectedSubServiceNames[id] || "";
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
    setSelectedSubServiceNames({});
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
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full justify-between bg-white border-gray-300"
                      onClick={() => toggleAddItemsDialog(subServiceItem.id, true)}
                    >
                      <span>
                        {getSelectedClothingItemsCount(subServiceItem.id) > 0 
                          ? `${getSelectedClothingItemsCount(subServiceItem.id)} items selected` 
                          : "Add Items"}
                      </span>
                      <Plus className="h-4 w-4" />
                    </Button>
                    
                    {subServiceItem.selectedItems.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {subServiceItem.selectedItems.map(itemId => {
                          const item = safeClothingItems.find(i => i.id === itemId);
                          return item ? (
                            <Badge key={itemId} variant="outline" className="bg-blue-50">
                              {item.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
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

      {/* Add Items Dialog */}
      {activeSubServiceId && (
        <AddItemDialog 
          isOpen={!!isAddItemsDialogOpen[activeSubServiceId]} 
          onOpenChange={(open) => toggleAddItemsDialog(activeSubServiceId, open)}
          clothingItems={safeClothingItems}
          selectedItems={subServiceItems.find(item => item.id === activeSubServiceId)?.selectedItems || []}
          onSave={(selectedItems) => handleItemsSelected(activeSubServiceId, selectedItems)}
        />
      )}
    </Dialog>
  );
};

export default AddServiceDialog;
