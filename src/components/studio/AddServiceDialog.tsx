
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Service, SubService, ClothingItem } from '@/types/services';

interface AddServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  subServices: SubService[];
  clothingItems: ClothingItem[];
  onServiceAdded: (data: any) => void;
  editingService?: {
    serviceId: string;
    subServices: any[];
  } | null;
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  onOpenChange,
  services,
  subServices,
  clothingItems,
  onServiceAdded,
  editingService = null
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedSubServiceNames, setSelectedSubServiceNames] = useState<string[]>([]);
  const [pricePerKg, setPricePerKg] = useState<Record<string, string>>({});
  const [pricePerItem, setPricePerItem] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [itemPrices, setItemPrices] = useState<Record<string, Record<string, string>>>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Reset the form when the dialog opens
  useEffect(() => {
    if (isOpen) {
      if (!editingService) {
        // Reset form for adding new service
        resetForm();
      } else {
        // Populate form with editing service data
        populateFormWithEditingData();
      }
    }
  }, [isOpen, editingService]);

  const resetForm = () => {
    setSelectedServiceId('');
    setSelectedSubServiceNames([]);
    setPricePerKg({});
    setPricePerItem({});
    setSelectedItems({});
    setItemPrices({});
    setFormErrors([]);
  };

  const populateFormWithEditingData = () => {
    if (!editingService) return;

    // Set the selected service ID
    setSelectedServiceId(editingService.serviceId);

    // Extract sub-service names
    const subServiceNames = editingService.subServices.map(subService => subService.name);
    setSelectedSubServiceNames(subServiceNames);

    // Initialize containers for other data
    const newPricePerKg: Record<string, string> = {};
    const newPricePerItem: Record<string, string> = {};
    const newSelectedItems: Record<string, string[]> = {};
    const newItemPrices: Record<string, Record<string, string>> = {};

    // Populate data for each sub-service
    editingService.subServices.forEach(subService => {
      const subServiceName = subService.name;
      
      // Set prices
      if (subService.pricePerKg) {
        newPricePerKg[subServiceName] = subService.pricePerKg.toString();
      }
      
      if (subService.pricePerItem) {
        newPricePerItem[subServiceName] = subService.pricePerItem.toString();
      }
      
      // Set selected items and their prices
      if (subService.selectedItems && subService.selectedItems.length > 0) {
        newSelectedItems[subServiceName] = [...subService.selectedItems];
        
        if (subService.itemPrices) {
          newItemPrices[subServiceName] = { ...subService.itemPrices };
        }
      }
    });

    // Update all state
    setPricePerKg(newPricePerKg);
    setPricePerItem(newPricePerItem);
    setSelectedItems(newSelectedItems);
    setItemPrices(newItemPrices);
  };

  const handleServiceChange = (value: string) => {
    setSelectedServiceId(value);
  };

  const handleSubServiceToggle = (subServiceName: string) => {
    setSelectedSubServiceNames(prev => {
      if (prev.includes(subServiceName)) {
        return prev.filter(name => name !== subServiceName);
      } else {
        return [...prev, subServiceName];
      }
    });
  };

  const handlePricePerKgChange = (subServiceName: string, value: string) => {
    setPricePerKg(prev => ({
      ...prev,
      [subServiceName]: value
    }));
  };

  const handlePricePerItemChange = (subServiceName: string, value: string) => {
    setPricePerItem(prev => ({
      ...prev,
      [subServiceName]: value
    }));
  };

  const handleItemCheck = (subServiceName: string, itemId: string, checked: boolean) => {
    setSelectedItems(prev => {
      const currentItems = prev[subServiceName] || [];
      
      if (checked) {
        if (!currentItems.includes(itemId)) {
          return {
            ...prev,
            [subServiceName]: [...currentItems, itemId]
          };
        }
      } else {
        return {
          ...prev,
          [subServiceName]: currentItems.filter(id => id !== itemId)
        };
      }
      
      return prev;
    });
  };

  const handleItemPriceChange = (subServiceName: string, itemId: string, price: string) => {
    setItemPrices(prev => {
      const currentPrices = prev[subServiceName] || {};
      return {
        ...prev,
        [subServiceName]: {
          ...currentPrices,
          [itemId]: price
        }
      };
    });
  };

  const getSelectedSubServiceName = (id: string) => {
    const subService = subServices.find(s => s.id === id);
    return subService ? subService.name : 'Unknown Sub-service';
  };

  const validateForm = () => {
    const errors = [];
    
    if (!selectedServiceId) {
      errors.push('Please select a service');
    }
    
    if (selectedSubServiceNames.length === 0) {
      errors.push('Please select at least one sub-service');
    }
    
    // Check if pricing is provided for each sub-service
    selectedSubServiceNames.forEach(subServiceName => {
      const hasPerKgPrice = pricePerKg[subServiceName] && pricePerKg[subServiceName] !== '0';
      const hasPerItemPrice = pricePerItem[subServiceName] && pricePerItem[subServiceName] !== '0';
      const hasItems = selectedItems[subServiceName] && selectedItems[subServiceName].length > 0;
      
      if (!hasPerKgPrice && !hasPerItemPrice && !hasItems) {
        errors.push(`Please add pricing for ${getSelectedSubServiceName(subServiceName)}`);
      }
      
      // If items are selected, check if prices are provided
      if (hasItems) {
        const itemIds = selectedItems[subServiceName] || [];
        const itemPricesForService = itemPrices[subServiceName] || {};
        
        itemIds.forEach(itemId => {
          if (!itemPricesForService[itemId] || itemPricesForService[itemId] === '0') {
            const item = clothingItems.find(i => i.id === itemId);
            if (item) {
              errors.push(`Please add price for ${item.name} in ${getSelectedSubServiceName(subServiceName)}`);
            }
          }
        });
      }
    });
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for saving
    const subServicesData = selectedSubServiceNames.map(subServiceName => {
      return {
        name: subServiceName,
        pricePerKg: pricePerKg[subServiceName] || '0',
        pricePerItem: pricePerItem[subServiceName] || '0',
        selectedItems: selectedItems[subServiceName] || [],
        itemPrices: itemPrices[subServiceName] || {}
      };
    });
    
    const serviceData = {
      serviceId: selectedServiceId,
      subServices: subServicesData
    };
    
    onServiceAdded(serviceData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
        </DialogHeader>
        
        {formErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <h4 className="font-semibold mb-1">Please fix the following issues:</h4>
            <ul className="list-disc list-inside">
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Service Selection */}
          <div className="space-y-2">
            <Label htmlFor="service-select">Select Service:</Label>
            <Select
              value={selectedServiceId}
              onValueChange={handleServiceChange}
              disabled={!!editingService} // Disable if editing
            >
              <SelectTrigger id="service-select">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.filter(service => service.active).map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Sub-service Selection */}
          {selectedServiceId && (
            <div className="space-y-2">
              <Label>Select Sub-services:</Label>
              <div className="border rounded-md p-4 space-y-3">
                {subServices.filter(subService => subService.active).map((subService) => (
                  <div key={subService.id} className="flex flex-col pb-4 border-b last:border-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`sub-service-${subService.id}`}
                        checked={selectedSubServiceNames.includes(subService.id)}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            handleSubServiceToggle(subService.id);
                          }
                        }}
                        disabled={!!editingService} // Only disable during editing if needed
                      />
                      <Label htmlFor={`sub-service-${subService.id}`} className="font-medium">{subService.name}</Label>
                    </div>
                    
                    {selectedSubServiceNames.includes(subService.id) && (
                      <div className="mt-4 ml-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`price-kg-${subService.id}`} className="text-sm">Price per KG (₹):</Label>
                            <Input 
                              id={`price-kg-${subService.id}`}
                              type="number" 
                              value={pricePerKg[subService.id] || ''}
                              onChange={(e) => handlePricePerKgChange(subService.id, e.target.value)}
                              placeholder="0"
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`price-item-${subService.id}`} className="text-sm">Price per Item (₹):</Label>
                            <Input 
                              id={`price-item-${subService.id}`}
                              type="number" 
                              value={pricePerItem[subService.id] || ''}
                              onChange={(e) => handlePricePerItemChange(subService.id, e.target.value)}
                              placeholder="0" 
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Clothing Items with Prices:</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-md p-3 bg-gray-50">
                            {clothingItems.filter(item => item.active).map((item) => (
                              <div key={item.id} className="flex items-center gap-2">
                                <Checkbox 
                                  id={`item-${subService.id}-${item.id}`}
                                  checked={(selectedItems[subService.id] || []).includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    if (typeof checked === 'boolean') {
                                      handleItemCheck(subService.id, item.id, checked);
                                    }
                                  }}
                                />
                                <Label htmlFor={`item-${subService.id}-${item.id}`} className="text-sm flex-1">
                                  {item.name}
                                </Label>
                                {(selectedItems[subService.id] || []).includes(item.id) && (
                                  <Input 
                                    type="number" 
                                    value={((itemPrices[subService.id] || {})[item.id]) || ''}
                                    onChange={(e) => handleItemPriceChange(subService.id, item.id, e.target.value)}
                                    placeholder="Price" 
                                    className="w-20"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {editingService ? 'Update Service' : 'Add Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
