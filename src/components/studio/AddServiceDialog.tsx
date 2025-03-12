
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AddItemDialog from "@/components/services/AddItemDialog";

interface SubServiceItem {
  id: string;
  name: string;
  pricePerKg: string;
  pricePerItem: string;
  selectedItems: string[];
  itemPrices: Record<string, string>; // Store prices for each clothing item
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
      selectedItems: [],
      itemPrices: {}
    }
  ]);
  
  const [selectedSubServiceNames, setSelectedSubServiceNames] = useState<Record<string, string>>({});
  
  const [isAddItemsDialogOpen, setIsAddItemsDialogOpen] = useState<Record<string, boolean>>({});
  const [itemName, setItemName] = useState("");
  const [selectedClothingItem, setSelectedClothingItem] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedService("");
      setSelectedServiceName("");
      setSubServiceItems([{
        id: Date.now().toString(),
        name: "",
        pricePerKg: "",
        pricePerItem: "",
        selectedItems: [],
        itemPrices: {}
      }]);
      setSelectedSubServiceNames({});
      setIsAddItemsDialogOpen({});
    }
  }, [isOpen]);

  const handleAddSubService = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "",
      pricePerKg: "",
      pricePerItem: "",
      selectedItems: [],
      itemPrices: {}
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

  const handleSubServiceChange = (id: string, field: keyof SubServiceItem, value: any) => {
    setSubServiceItems(subServiceItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleItemPriceChange = (subServiceItemId: string, clothingItemId: string, price: string) => {
    setSubServiceItems(subServiceItems.map(item => {
      if (item.id === subServiceItemId) {
        return {
          ...item,
          itemPrices: {
            ...item.itemPrices,
            [clothingItemId]: price
          }
        };
      }
      return item;
    }));
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
    setIsAddItemsDialogOpen(prev => ({
      ...prev,
      [id]: isOpen
    }));
    // Reset selected clothing item when dialog opens
    setSelectedClothingItem("");
  };

  const handleAddClothingItem = (subServiceItemId: string) => {
    if (!selectedClothingItem) return;
    
    const subServiceItem = subServiceItems.find(item => item.id === subServiceItemId);
    
    if (subServiceItem && !subServiceItem.selectedItems.includes(selectedClothingItem)) {
      const updatedItems = [...subServiceItem.selectedItems, selectedClothingItem];
      handleSubServiceChange(subServiceItemId, 'selectedItems', updatedItems);
      
      // Initialize price for this item
      handleItemPriceChange(subServiceItemId, selectedClothingItem, "");
      
      // Reset selected item
      setSelectedClothingItem("");
    }
  };

  const handleRemoveClothingItem = (subServiceItemId: string, clothingItemId: string) => {
    const subServiceItem = subServiceItems.find(item => item.id === subServiceItemId);
    
    if (subServiceItem) {
      // Remove from selected items
      const updatedItems = subServiceItem.selectedItems.filter(id => id !== clothingItemId);
      handleSubServiceChange(subServiceItemId, 'selectedItems', updatedItems);
      
      // Remove price entry
      const updatedPrices = { ...subServiceItem.itemPrices };
      delete updatedPrices[clothingItemId];
      
      setSubServiceItems(subServiceItems.map(item => {
        if (item.id === subServiceItemId) {
          return {
            ...item,
            selectedItems: updatedItems,
            itemPrices: updatedPrices
          };
        }
        return item;
      }));
    }
  };

  const getSelectedClothingItemsCount = (subServiceItemId: string) => {
    const subServiceItem = subServiceItems.find(item => item.id === subServiceItemId);
    return subServiceItem ? subServiceItem.selectedItems.length : 0;
  };

  const getSelectedSubServiceName = (id: string) => {
    return selectedSubServiceNames[id] || "";
  };

  const getClothingItemById = (id: string) => {
    return safeClothingItems.find(item => item.id === id);
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
      selectedItems: [],
      itemPrices: {}
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

                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-base font-medium mb-3">Clothing Items</h4>
                      <Button 
                        type="button" 
                        variant="blue" 
                        onClick={() => toggleAddItemsDialog(subServiceItem.id, true)}
                        className="w-auto"
                      >
                        Add Items
                      </Button>
                    </div>
                    
                    <Dialog 
                      open={!!isAddItemsDialogOpen[subServiceItem.id]} 
                      onOpenChange={(open) => toggleAddItemsDialog(subServiceItem.id, open)}
                    >
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add Clothing Items</DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 p-2">
                          {subServiceItem.selectedItems.length > 0 && (
                            <ScrollArea className="max-h-60">
                              {subServiceItem.selectedItems.map((itemId) => {
                                const item = getClothingItemById(itemId);
                                return item ? (
                                  <div key={itemId} className="p-4 border rounded-lg mb-4">
                                    <div className="grid grid-cols-[1fr,1fr,auto] gap-4 items-center">
                                      <div>
                                        <label className="text-base font-medium mb-2 block">Clothing Item</label>
                                        <div className="border rounded-md px-3 py-2 bg-gray-50">
                                          {item.name}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-base font-medium mb-2 block">Price</label>
                                        <Input
                                          placeholder="Price (per item)"
                                          value={subServiceItem.itemPrices[itemId] || ""}
                                          onChange={(e) => handleItemPriceChange(subServiceItem.id, itemId, e.target.value)}
                                        />
                                      </div>
                                      <div className="pt-8">
                                        <Button
                                          type="button"
                                          variant="destructive"
                                          className="h-10"
                                          onClick={() => handleRemoveClothingItem(subServiceItem.id, itemId)}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </ScrollArea>
                          )}
                          
                          <div className="p-4 border rounded-lg">
                            <div className="grid grid-cols-[1fr,1fr,auto] gap-4 items-end">
                              <div>
                                <label className="text-base font-medium mb-2 block">Clothing Item</label>
                                <Select value={selectedClothingItem} onValueChange={setSelectedClothingItem}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {safeClothingItems
                                      .filter(item => !subServiceItem.selectedItems.includes(item.id))
                                      .map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                          {item.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-base font-medium mb-2 block">Price</label>
                                <Input placeholder="Price (per item)" disabled />
                              </div>
                              <Button 
                                type="button"
                                variant="blue"
                                className="bg-blue-500"
                                onClick={() => handleAddClothingItem(subServiceItem.id)}
                                disabled={!selectedClothingItem}
                              >
                                Add Category
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button onClick={() => toggleAddItemsDialog(subServiceItem.id, false)}>
                            Done
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
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
    </Dialog>
  );
};

export default AddServiceDialog;

