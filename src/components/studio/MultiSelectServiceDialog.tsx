
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
  washCategory: 'standard' | 'express' | 'both';
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
    type: 'standard' | 'express',
    value: string
  ) => {
    setPricePerKg(prev => ({
      ...prev,
      [subServiceId]: {
        ...prev[subServiceId],
        [type]: value
      }
    }));
  };

  // Handle price per item change
  const handlePricePerItemChange = (
    subServiceId: string, 
    type: 'standard' | 'express',
    value: string
  ) => {
    setPricePerItem(prev => ({
      ...prev,
      [subServiceId]: {
        ...prev[subServiceId],
        [type]: value
      }
    }));
  };

  // Handle clothing item price changes
  const handleClothingItemPriceChange = (
    subServiceId: string,
    itemId: string,
    type: 'standard' | 'express',
    value: string
  ) => {
    setClothingItemPrices(prev => ({
      ...prev,
      [subServiceId]: {
        ...(prev[subServiceId] || {}),
        [itemId]: {
          ...(prev[subServiceId]?.[itemId] || { standard: '', express: '' }),
          [type]: value
        }
      }
    }));
  };

  // Remove clothing item
  const handleRemoveClothingItem = (subServiceId: string, itemId: string) => {
    setSelectedClothingItems(prev => {
      const updatedItems = { ...prev };
      if (updatedItems[subServiceId]) {
        updatedItems[subServiceId] = updatedItems[subServiceId].filter(id => id !== itemId);
      }
      return updatedItems;
    });

    setClothingItemPrices(prev => {
      const updatedPrices = { ...prev };
      if (updatedPrices[subServiceId] && updatedPrices[subServiceId][itemId]) {
        const { [itemId]: _, ...rest } = updatedPrices[subServiceId];
        updatedPrices[subServiceId] = rest;
      }
      return updatedPrices;
    });
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
    
    setClothingItemPrices(prev => {
      const subServicePrices = prev[activeSubServiceId] || {};
      
      if (washCategory === 'standard') {
        return {
          ...prev,
          [activeSubServiceId]: {
            ...subServicePrices,
            [itemId]: {
              standard: price,
              express: ''
            }
          }
        };
      } else if (washCategory === 'express') {
        return {
          ...prev,
          [activeSubServiceId]: {
            ...subServicePrices,
            [itemId]: {
              standard: '',
              express: price
            }
          }
        };
      } else {
        return {
          ...prev,
          [activeSubServiceId]: {
            ...subServicePrices,
            [itemId]: {
              standard: price,
              express: price
            }
          }
        };
      }
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
    
    // Validation based on wash category
    let hasPricing = false;
    
    selectedSubServices.forEach(subServiceId => {
      if (washCategory === 'standard' || washCategory === 'both') {
        const standardKgPrice = pricePerKg[subServiceId]?.standard;
        const standardItemPrice = pricePerItem[subServiceId]?.standard;
        
        if ((standardKgPrice && standardKgPrice !== '0') || (standardItemPrice && standardItemPrice !== '0')) {
          hasPricing = true;
        }
        
        // Check standard clothing item prices
        const hasStandardItemPrices = (selectedClothingItems[subServiceId] || []).some(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.standard;
          return price && price !== '0';
        });
        
        if (hasStandardItemPrices) {
          hasPricing = true;
        }
      }
      
      if (washCategory === 'express' || washCategory === 'both') {
        const expressKgPrice = pricePerKg[subServiceId]?.express;
        const expressItemPrice = pricePerItem[subServiceId]?.express;
        
        if ((expressKgPrice && expressKgPrice !== '0') || (expressItemPrice && expressItemPrice !== '0')) {
          hasPricing = true;
        }
        
        // Check express clothing item prices
        const hasExpressItemPrices = (selectedClothingItems[subServiceId] || []).some(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.express;
          return price && price !== '0';
        });
        
        if (hasExpressItemPrices) {
          hasPricing = true;
        }
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
      
      // Add pricing based on wash category
      if (washCategory === 'standard' || washCategory === 'both') {
        const standardKgPrice = pricePerKg[subServiceId]?.standard || '0';
        const standardItemPrice = pricePerItem[subServiceId]?.standard || '0';
        
        data.standardPricePerKg = standardKgPrice;
        data.standardPricePerItem = standardItemPrice;
        
        // Add standard item prices
        data.standardItemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.standard || '0';
          data.standardItemPrices[itemId] = price;
        });
        
        if (washCategory === 'standard') {
          data.pricePerKg = standardKgPrice;
          data.pricePerItem = standardItemPrice;
          
          // Add default item prices
          data.itemPrices = {};
          
          (selectedClothingItems[subServiceId] || []).forEach(itemId => {
            const price = clothingItemPrices[subServiceId]?.[itemId]?.standard || '0';
            data.itemPrices[itemId] = price;
          });
        }
      }
      
      if (washCategory === 'express' || washCategory === 'both') {
        const expressKgPrice = pricePerKg[subServiceId]?.express || '0';
        const expressItemPrice = pricePerItem[subServiceId]?.express || '0';
        
        data.expressPricePerKg = expressKgPrice;
        data.expressPricePerItem = expressItemPrice;
        
        // Add express item prices
        data.expressItemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.express || '0';
          data.expressItemPrices[itemId] = price;
        });
        
        if (washCategory === 'express') {
          data.pricePerKg = expressKgPrice;
          data.pricePerItem = expressItemPrice;
          
          // Add default item prices
          data.itemPrices = {};
          
          (selectedClothingItems[subServiceId] || []).forEach(itemId => {
            const price = clothingItemPrices[subServiceId]?.[itemId]?.express || '0';
            data.itemPrices[itemId] = price;
          });
        }
      }
      
      // For "both" category, use standard prices as default
      if (washCategory === 'both') {
        data.pricePerKg = pricePerKg[subServiceId]?.standard || '0';
        data.pricePerItem = pricePerItem[subServiceId]?.standard || '0';
        
        // Add default item prices
        data.itemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.standard || '0';
          data.itemPrices[itemId] = price;
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

  // Render price fields based on wash category
  const renderPriceFields = (subServiceId: string) => {
    if (washCategory === 'standard') {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="flex items-center text-gray-700">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Standard</span>
              Price per KG
            </Label>
            <Input 
              type="number" 
              value={pricePerKg[subServiceId]?.standard || ''}
              onChange={(e) => handlePricePerKgChange(subServiceId, 'standard', e.target.value)}
              placeholder="0"
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center text-gray-700">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Standard</span>
              Price per Item
            </Label>
            <Input 
              type="number" 
              value={pricePerItem[subServiceId]?.standard || ''}
              onChange={(e) => handlePricePerItemChange(subServiceId, 'standard', e.target.value)}
              placeholder="0"
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="flex items-center text-gray-700">
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Express</span>
              Price per KG
            </Label>
            <Input 
              type="number" 
              value={pricePerKg[subServiceId]?.express || ''}
              onChange={(e) => handlePricePerKgChange(subServiceId, 'express', e.target.value)}
              placeholder="0"
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center text-gray-700">
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Express</span>
              Price per Item
            </Label>
            <Input 
              type="number" 
              value={pricePerItem[subServiceId]?.express || ''}
              onChange={(e) => handlePricePerItemChange(subServiceId, 'express', e.target.value)}
              placeholder="0"
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Standard</span>
                Price per KG
              </Label>
              <Input 
                type="number" 
                value={pricePerKg[subServiceId]?.standard || ''}
                onChange={(e) => handlePricePerKgChange(subServiceId, 'standard', e.target.value)}
                placeholder="0"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Standard</span>
                Price per Item
              </Label>
              <Input 
                type="number" 
                value={pricePerItem[subServiceId]?.standard || ''}
                onChange={(e) => handlePricePerItemChange(subServiceId, 'standard', e.target.value)}
                placeholder="0"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Express</span>
                Price per KG
              </Label>
              <Input 
                type="number" 
                value={pricePerKg[subServiceId]?.express || ''}
                onChange={(e) => handlePricePerKgChange(subServiceId, 'express', e.target.value)}
                placeholder="0"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center text-gray-700">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Express</span>
                Price per Item
              </Label>
              <Input 
                type="number" 
                value={pricePerItem[subServiceId]?.express || ''}
                onChange={(e) => handlePricePerItemChange(subServiceId, 'express', e.target.value)}
                placeholder="0"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  // Render clothing item row with prices based on wash category
  const renderClothingItemPriceRow = (subServiceId: string, itemId: string) => {
    if (washCategory === 'standard') {
      return (
        <div key={itemId} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-150">
          <span className="font-medium text-gray-800">{getClothingItemName(itemId)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Standard</span>
              <Input
                type="number"
                value={clothingItemPrices[subServiceId]?.[itemId]?.standard || ''}
                onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'standard', e.target.value)}
                placeholder="Price"
                className="w-24 h-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRemoveClothingItem(subServiceId, itemId)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div key={itemId} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-150">
          <span className="font-medium text-gray-800">{getClothingItemName(itemId)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mr-2">Express</span>
              <Input
                type="number"
                value={clothingItemPrices[subServiceId]?.[itemId]?.express || ''}
                onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'express', e.target.value)}
                placeholder="Price"
                className="w-24 h-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRemoveClothingItem(subServiceId, itemId)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div key={itemId} className="space-y-2 bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition-colors duration-150">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">{getClothingItemName(itemId)}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleRemoveClothingItem(subServiceId, itemId)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">Standard:</span>
              <Input
                type="number"
                value={clothingItemPrices[subServiceId]?.[itemId]?.standard || ''}
                onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'standard', e.target.value)}
                placeholder="Price"
                className="h-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap">Express:</span>
              <Input
                type="number"
                value={clothingItemPrices[subServiceId]?.[itemId]?.express || ''}
                onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'express', e.target.value)}
                placeholder="Price"
                className="h-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col bg-white shadow-xl border-0">
        <DialogHeader className="text-center pb-2 border-b">
          <DialogTitle className="text-2xl font-bold text-blue-600">Add Service</DialogTitle>
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
        
        <div className="space-y-6 overflow-y-auto pr-2 flex-grow">
          {/* Service Selection */}
          <div className="space-y-2 mt-2">
            <Label htmlFor="service-select" className="font-semibold text-gray-800">
              Service Name
            </Label>
            <Select
              value={selectedServiceId}
              onValueChange={handleServiceChange}
              disabled={!!editingService}
            >
              <SelectTrigger id="service-select" className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
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
          <div className="space-y-4 pt-2">
            <Label className="font-semibold text-gray-800">Sub Services</Label>
            
            {/* Added Sub-Services Panels */}
            {selectedSubServices.length > 0 && (
              <div className="space-y-4">
                {selectedSubServices.map(subServiceId => (
                  <Card key={subServiceId} className="border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-gray-800">Sub Service Name</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveSubService(subServiceId)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Select value={subServiceId} disabled>
                        <SelectTrigger className="border-gray-300 bg-gray-50">
                          <SelectValue>{getSubServiceName(subServiceId)}</SelectValue>
                        </SelectTrigger>
                      </Select>
                      
                      {/* Render price fields based on wash category */}
                      {renderPriceFields(subServiceId)}
                      
                      {/* Clothing Items */}
                      <div className="mt-5">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-gray-800">Clothing Items</h4>
                          <Button 
                            type="button"
                            variant="outline"
                            className="h-8 py-1 px-3 text-sm border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
                            onClick={() => {
                              setActiveSubServiceId(subServiceId);
                              handleOpenAddItems();
                            }}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Items
                          </Button>
                        </div>
                        
                        {/* Clothing Items with Prices */}
                        {(selectedClothingItems[subServiceId] || []).length > 0 ? (
                          <div className="space-y-2 mt-3">
                            {(selectedClothingItems[subServiceId] || []).map(itemId => 
                              renderClothingItemPriceRow(subServiceId, itemId)
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-md p-4 text-center text-gray-500 border border-dashed border-gray-300 mt-2">
                            No clothing items added yet
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
              <SelectTrigger className="w-full max-w-sm mx-auto bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 font-medium transition-colors">
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
        
        <DialogFooter className="mt-4 pt-3 border-t flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 font-medium text-gray-700 hover:bg-gray-100 border-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="px-5 py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
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
        washCategory={washCategory}
      />
    </Dialog>
  );
};

export default MultiSelectServiceDialog;
