
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service, SubService, ClothingItem } from '@/types/services';
import { Card, CardContent } from "@/components/ui/card";
import MultiSelect from '@/components/ui/multi-select';
import { ChevronDown, Plus, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import AddItemPopup from './AddItemPopup';

interface MultiSelectServiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  subServices: SubService[];
  clothingItems: ClothingItem[];
  washCategory: string;
  onSave: (data: any) => void;
  editingService?: any | null;
}

const MultiSelectServiceDialog: React.FC<MultiSelectServiceDialogProps> = ({
  isOpen,
  onOpenChange,
  services,
  subServices,
  clothingItems,
  washCategory,
  onSave,
  editingService = null,
}) => {
  // State for form data
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [pricePerKg, setPricePerKg] = useState<Record<string, { standard: string, express: string }>>({});
  const [pricePerItem, setPricePerItem] = useState<Record<string, { standard: string, express: string }>>({});
  const [selectedClothingItems, setSelectedClothingItems] = useState<Record<string, string[]>>({});
  const [clothingItemPrices, setClothingItemPrices] = useState<Record<string, Record<string, { standard: string, express: string }>>>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Current active sub-service for adding items
  const [activeSubServiceId, setActiveSubServiceId] = useState<string | null>(null);
  
  // State for Add Items popup
  const [isAddItemsOpen, setIsAddItemsOpen] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (!editingService) {
        resetForm();
      } else {
        populateFormWithEditingData();
      }
    }
  }, [isOpen, editingService]);

  const resetForm = () => {
    setSelectedServiceId('');
    setSelectedSubServices([]);
    setPricePerKg({});
    setPricePerItem({});
    setSelectedClothingItems({});
    setClothingItemPrices({});
    setFormErrors([]);
    setActiveSubServiceId(null);
  };

  const populateFormWithEditingData = () => {
    if (!editingService) return;

    // Set service ID
    setSelectedServiceId(editingService.serviceId);

    // Extract sub-service IDs
    const subServiceIds = editingService.subServices.map((subService: any) => subService.name);
    setSelectedSubServices(subServiceIds);

    // Create records for pricing data
    const newPricePerKg: Record<string, { standard: string, express: string }> = {};
    const newPricePerItem: Record<string, { standard: string, express: string }> = {};
    const newSelectedClothingItems: Record<string, string[]> = {};
    const newClothingItemPrices: Record<string, Record<string, { standard: string, express: string }>> = {};

    // Populate data for each sub-service
    editingService.subServices.forEach((subService: any) => {
      const subServiceId = subService.name;
      
      // Set pricing data
      newPricePerKg[subServiceId] = {
        standard: subService.standardPricePerKg || subService.pricePerKg || '',
        express: subService.expressPricePerKg || ''
      };
      
      newPricePerItem[subServiceId] = {
        standard: subService.standardPricePerItem || subService.pricePerItem || '',
        express: subService.expressPricePerItem || ''
      };
      
      // Set clothing items and prices
      if (subService.selectedItems && subService.selectedItems.length > 0) {
        newSelectedClothingItems[subServiceId] = [...subService.selectedItems];
        
        newClothingItemPrices[subServiceId] = {};
        subService.selectedItems.forEach((itemId: string) => {
          newClothingItemPrices[subServiceId][itemId] = {
            standard: subService.standardItemPrices?.[itemId] || subService.itemPrices?.[itemId] || '',
            express: subService.expressItemPrices?.[itemId] || ''
          };
        });
      }
    });

    // Update state
    setPricePerKg(newPricePerKg);
    setPricePerItem(newPricePerItem);
    setSelectedClothingItems(newSelectedClothingItems);
    setClothingItemPrices(newClothingItemPrices);
    
    // Set first sub-service as active if any
    if (subServiceIds.length > 0) {
      setActiveSubServiceId(subServiceIds[0]);
    }
  };

  // Handle service selection
  const handleServiceChange = (value: string) => {
    setSelectedServiceId(value);
  };

  // Handle sub-service selection
  const handleSubServiceSelect = (subServiceId: string) => {
    if (!selectedSubServices.includes(subServiceId)) {
      const newSelectedSubServices = [...selectedSubServices, subServiceId];
      setSelectedSubServices(newSelectedSubServices);
      
      // Initialize pricing for new sub-service
      setPricePerKg(prev => ({
        ...prev,
        [subServiceId]: { standard: '', express: '' }
      }));
      
      setPricePerItem(prev => ({
        ...prev,
        [subServiceId]: { standard: '', express: '' }
      }));
      
      setSelectedClothingItems(prev => ({
        ...prev,
        [subServiceId]: []
      }));
      
      setClothingItemPrices(prev => ({
        ...prev,
        [subServiceId]: {}
      }));
      
      // Set as active sub-service
      setActiveSubServiceId(subServiceId);
    }
  };

  // Remove a sub-service
  const handleRemoveSubService = (subServiceId: string) => {
    setSelectedSubServices(prev => prev.filter(id => id !== subServiceId));
    
    // If removing active sub-service, set another one as active
    if (activeSubServiceId === subServiceId) {
      const remaining = selectedSubServices.filter(id => id !== subServiceId);
      setActiveSubServiceId(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Handle price per kg change
  const handlePricePerKgChange = (
    subServiceId: string, 
    value: string
  ) => {
    setPricePerKg(prev => ({
      ...prev,
      [subServiceId]: {
        ...prev[subServiceId],
        standard: value,
        express: value // For simplicity in the new UI, set both to the same value
      }
    }));
  };

  // Handle price per item change
  const handlePricePerItemChange = (
    subServiceId: string, 
    value: string
  ) => {
    setPricePerItem(prev => ({
      ...prev,
      [subServiceId]: {
        ...prev[subServiceId],
        standard: value,
        express: value // For simplicity in the new UI, set both to the same value
      }
    }));
  };

  // Open the Add Items popup
  const handleOpenAddItems = () => {
    if (activeSubServiceId) {
      setIsAddItemsOpen(true);
    }
  };

  // Handle clothing item selection from the Add Items popup
  const handleAddItemFromPopup = (itemId: string, price: string) => {
    if (!activeSubServiceId) return;
    
    // Add the item to selected items
    setSelectedClothingItems(prev => {
      const items = prev[activeSubServiceId] || [];
      if (!items.includes(itemId)) {
        return {
          ...prev,
          [activeSubServiceId]: [...items, itemId]
        };
      }
      return prev;
    });
    
    // Set the price for the item
    setClothingItemPrices(prev => {
      const subServicePrices = prev[activeSubServiceId] || {};
      return {
        ...prev,
        [activeSubServiceId]: {
          ...subServicePrices,
          [itemId]: {
            standard: price,
            express: price // For simplicity in the new UI, set both to the same value
          }
        }
      };
    });
  };

  // Remove a clothing item
  const handleRemoveClothingItem = (subServiceId: string, itemId: string) => {
    setSelectedClothingItems(prev => {
      const items = prev[subServiceId] || [];
      return {
        ...prev,
        [subServiceId]: items.filter(id => id !== itemId)
      };
    });
    
    // Also remove its prices
    setClothingItemPrices(prev => {
      const subServicePrices = prev[subServiceId] || {};
      const { [itemId]: _, ...rest } = subServicePrices;
      return {
        ...prev,
        [subServiceId]: rest
      };
    });
  };

  // Handle clothing item price change
  const handleClothingItemPriceChange = (
    subServiceId: string, 
    itemId: string, 
    value: string
  ) => {
    setClothingItemPrices(prev => {
      const subServicePrices = prev[subServiceId] || {};
      const itemPrices = subServicePrices[itemId] || { standard: '', express: '' };
      
      return {
        ...prev,
        [subServiceId]: {
          ...subServicePrices,
          [itemId]: {
            standard: value,
            express: value // For simplicity in the new UI, set both to the same value
          }
        }
      };
    });
  };

  // Helper functions
  const getSubServiceName = (id: string) => {
    const subService = subServices.find(s => s.id === id);
    return subService ? subService.name : id;
  };

  const getClothingItemName = (id: string) => {
    const item = clothingItems.find(i => i.id === id);
    return item ? item.name : id;
  };

  // Form validation
  const validateForm = () => {
    const errors = [];
    
    if (!selectedServiceId) {
      errors.push('Please select a service');
    }
    
    if (selectedSubServices.length === 0) {
      errors.push('Please select at least one sub-service');
    }
    
    // Simplified validation for the new UI
    let hasPricing = false;
    
    selectedSubServices.forEach(subServiceId => {
      const kgPrice = pricePerKg[subServiceId]?.standard;
      const itemPrice = pricePerItem[subServiceId]?.standard;
      
      if ((kgPrice && kgPrice !== '0') || (itemPrice && itemPrice !== '0')) {
        hasPricing = true;
      }
      
      // Check clothing item prices
      const hasItemsWithPrices = (selectedClothingItems[subServiceId] || []).some(itemId => {
        const price = clothingItemPrices[subServiceId]?.[itemId]?.standard;
        return price && price !== '0';
      });
      
      if (hasItemsWithPrices) {
        hasPricing = true;
      }
    });
    
    if (!hasPricing) {
      errors.push('Please add pricing for at least one sub-service');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  // Save form data
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for saving - maintain the same data structure as before
    const subServicesData = selectedSubServices.map(subServiceId => {
      const data: any = {
        name: subServiceId,
        selectedItems: selectedClothingItems[subServiceId] || []
      };
      
      // Add pricing
      const kgPrice = pricePerKg[subServiceId]?.standard || '0';
      const itemPrice = pricePerItem[subServiceId]?.standard || '0';
      
      if (washCategory === 'standard' || washCategory === 'both') {
        data.pricePerKg = kgPrice;
        data.pricePerItem = itemPrice;
        data.standardPricePerKg = kgPrice;
        data.standardPricePerItem = itemPrice;
        
        // Add item prices
        data.itemPrices = {};
        data.standardItemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.standard || '0';
          data.itemPrices[itemId] = price;
          data.standardItemPrices[itemId] = price;
        });
      }
      
      if (washCategory === 'express' || washCategory === 'both') {
        data.expressPricePerKg = kgPrice; // Use same price for express in this UI
        data.expressPricePerItem = itemPrice; // Use same price for express in this UI
        
        if (washCategory === 'express') {
          data.pricePerKg = kgPrice;
          data.pricePerItem = itemPrice;
        }
        
        // Add item prices for express
        data.expressItemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.standard || '0';
          if (washCategory === 'express') {
            data.itemPrices = data.itemPrices || {};
            data.itemPrices[itemId] = price;
          }
          data.expressItemPrices[itemId] = price;
        });
      }
      
      return data;
    });
    
    const serviceData = {
      serviceId: selectedServiceId,
      subServices: subServicesData
    };
    
    onSave(serviceData);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-blue-600">Add Service</DialogTitle>
          <p className="text-gray-500 text-sm mt-1">Add a new service with its subservices and items</p>
        </DialogHeader>
        
        {/* Error messages */}
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
            <Label htmlFor="service-select" className="font-medium">
              Service Name
            </Label>
            <Select
              value={selectedServiceId}
              onValueChange={handleServiceChange}
              disabled={!!editingService}
            >
              <SelectTrigger id="service-select" className="w-full">
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
          
          {/* Sub Services */}
          <div className="space-y-2">
            <Label className="font-medium">Sub Services</Label>
            
            {/* Added Sub-Services Panels */}
            {selectedSubServices.length > 0 && (
              <div className="space-y-4">
                {selectedSubServices.map(subServiceId => (
                  <Card key={subServiceId} className="border border-gray-200">
                    <CardContent className="p-4 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">Sub Service Name</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveSubService(subServiceId)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Select value={subServiceId} disabled>
                        <SelectTrigger>
                          <SelectValue>{getSubServiceName(subServiceId)}</SelectValue>
                        </SelectTrigger>
                      </Select>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Price per KG */}
                        <div className="space-y-2">
                          <Label>Price per KG</Label>
                          <Input 
                            type="number" 
                            value={pricePerKg[subServiceId]?.standard || ''}
                            onChange={(e) => handlePricePerKgChange(subServiceId, e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        
                        {/* Price per Item */}
                        <div className="space-y-2">
                          <Label>Price per Item</Label>
                          <Input 
                            type="number" 
                            value={pricePerItem[subServiceId]?.standard || ''}
                            onChange={(e) => handlePricePerItemChange(subServiceId, e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      {/* Clothing Items */}
                      <div className="mt-5">
                        <h4 className="font-medium mb-2">Clothing Items</h4>
                        
                        {/* Add Items Button */}
                        <Button 
                          type="button"
                          className="w-full bg-blue-600 text-white hover:bg-blue-700 mb-3"
                          onClick={() => {
                            setActiveSubServiceId(subServiceId);
                            handleOpenAddItems();
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Items
                        </Button>
                        
                        {/* Selected Clothing Items */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(selectedClothingItems[subServiceId] || []).map(itemId => {
                            const price = clothingItemPrices[subServiceId]?.[itemId]?.standard || '';
                            return (
                              <Badge key={itemId} variant="secondary" className="p-2">
                                {getClothingItemName(itemId)} - ₹{price || 0}
                              </Badge>
                            );
                          })}
                        </div>
                        
                        {/* Clothing Items with Prices */}
                        {(selectedClothingItems[subServiceId] || []).length > 0 && (
                          <div className="space-y-2 mt-3">
                            {(selectedClothingItems[subServiceId] || []).map(itemId => (
                              <div key={itemId} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                                <span>{getClothingItemName(itemId)}</span>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={clothingItemPrices[subServiceId]?.[itemId]?.standard || ''}
                                    onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, e.target.value)}
                                    placeholder="Price"
                                    className="w-24 h-8"
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleRemoveClothingItem(subServiceId, itemId)}
                                    className="h-8 w-8 p-0 text-red-500"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Add Sub Service Button */}
            <Select onValueChange={handleSubServiceSelect}>
              <SelectTrigger className="w-auto bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100">
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Sub Service</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {subServices
                  .filter(subService => subService.active && !selectedSubServices.includes(subService.id))
                  .map(subService => (
                    <SelectItem key={subService.id} value={subService.id}>
                      {subService.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Add Items Popup */}
      <AddItemPopup
        isOpen={isAddItemsOpen}
        onOpenChange={setIsAddItemsOpen}
        clothingItems={clothingItems}
        selectedItems={activeSubServiceId ? (selectedClothingItems[activeSubServiceId] || []) : []}
        onAddItem={handleAddItemFromPopup}
      />
    </Dialog>
  );
};

export default MultiSelectServiceDialog;
