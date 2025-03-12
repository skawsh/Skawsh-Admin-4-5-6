
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service, SubService, ClothingItem } from '@/types/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MultiSelect from '@/components/ui/multi-select';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  };

  // Handle service selection
  const handleServiceChange = (value: string) => {
    setSelectedServiceId(value);
  };

  // Handle sub-service selection
  const handleSubServiceChange = (values: string[]) => {
    setSelectedSubServices(values);
    
    // Initialize pricing for newly added sub-services
    const newPricePerKg = { ...pricePerKg };
    const newPricePerItem = { ...pricePerItem };
    const newSelectedClothingItems = { ...selectedClothingItems };
    const newClothingItemPrices = { ...clothingItemPrices };
    
    values.forEach(subServiceId => {
      if (!newPricePerKg[subServiceId]) {
        newPricePerKg[subServiceId] = { standard: '', express: '' };
      }
      
      if (!newPricePerItem[subServiceId]) {
        newPricePerItem[subServiceId] = { standard: '', express: '' };
      }
      
      if (!newSelectedClothingItems[subServiceId]) {
        newSelectedClothingItems[subServiceId] = [];
      }
      
      if (!newClothingItemPrices[subServiceId]) {
        newClothingItemPrices[subServiceId] = {};
      }
    });
    
    setPricePerKg(newPricePerKg);
    setPricePerItem(newPricePerItem);
    setSelectedClothingItems(newSelectedClothingItems);
    setClothingItemPrices(newClothingItemPrices);
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

  // Handle clothing item selection for a sub-service
  const handleClothingItemChange = (subServiceId: string, values: string[]) => {
    setSelectedClothingItems(prev => ({
      ...prev,
      [subServiceId]: values
    }));
    
    // Initialize prices for newly added items
    const newClothingItemPrices = { ...clothingItemPrices };
    if (!newClothingItemPrices[subServiceId]) {
      newClothingItemPrices[subServiceId] = {};
    }
    
    values.forEach(itemId => {
      if (!newClothingItemPrices[subServiceId][itemId]) {
        newClothingItemPrices[subServiceId][itemId] = { standard: '', express: '' };
      }
    });
    
    setClothingItemPrices(newClothingItemPrices);
  };

  // Handle clothing item price change
  const handleClothingItemPriceChange = (
    subServiceId: string, 
    itemId: string, 
    type: 'standard' | 'express', 
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
            ...itemPrices,
            [type]: value
          }
        }
      };
    });
  };

  // Helper functions
  const getSubServiceName = (id: string) => {
    const subService = subServices.find(s => s.id === id);
    return subService ? subService.name : 'Unknown Sub-service';
  };

  const getClothingItemName = (id: string) => {
    const item = clothingItems.find(i => i.id === id);
    return item ? item.name : 'Unknown Item';
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
    
    // Check pricing for sub-services
    selectedSubServices.forEach(subServiceId => {
      let hasPricing = false;
      
      // Check for pricing based on wash category
      if (washCategory === 'standard' || washCategory === 'both') {
        const hasStandardKgPrice = pricePerKg[subServiceId]?.standard && 
                                  pricePerKg[subServiceId].standard !== '0';
        const hasStandardItemPrice = pricePerItem[subServiceId]?.standard && 
                                    pricePerItem[subServiceId].standard !== '0';
        
        if (hasStandardKgPrice || hasStandardItemPrice) {
          hasPricing = true;
        }
        
        // Check clothing item prices
        const hasItemsWithPrices = selectedClothingItems[subServiceId]?.some(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.standard;
          return price && price !== '0';
        });
        
        if (hasItemsWithPrices) {
          hasPricing = true;
        }
      }
      
      if (washCategory === 'express' || washCategory === 'both') {
        const hasExpressKgPrice = pricePerKg[subServiceId]?.express && 
                                 pricePerKg[subServiceId].express !== '0';
        const hasExpressItemPrice = pricePerItem[subServiceId]?.express && 
                                   pricePerItem[subServiceId].express !== '0';
        
        if (hasExpressKgPrice || hasExpressItemPrice) {
          hasPricing = true;
        }
        
        // Check clothing item prices
        const hasItemsWithPrices = selectedClothingItems[subServiceId]?.some(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.express;
          return price && price !== '0';
        });
        
        if (hasItemsWithPrices) {
          hasPricing = true;
        }
      }
      
      if (!hasPricing) {
        errors.push(`Please add pricing for ${getSubServiceName(subServiceId)}`);
      }
    });
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  // Save form data
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for saving
    const subServicesData = selectedSubServices.map(subServiceId => {
      const data: any = {
        name: subServiceId,
        selectedItems: selectedClothingItems[subServiceId] || []
      };
      
      // Add pricing based on wash category
      if (washCategory === 'standard') {
        data.pricePerKg = pricePerKg[subServiceId]?.standard || '0';
        data.pricePerItem = pricePerItem[subServiceId]?.standard || '0';
        data.standardPricePerKg = pricePerKg[subServiceId]?.standard || '0';
        data.standardPricePerItem = pricePerItem[subServiceId]?.standard || '0';
        
        // Add item prices
        data.itemPrices = {};
        data.standardItemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.standard || '0';
          data.itemPrices[itemId] = price;
          data.standardItemPrices[itemId] = price;
        });
      } else if (washCategory === 'express') {
        data.pricePerKg = pricePerKg[subServiceId]?.express || '0';
        data.pricePerItem = pricePerItem[subServiceId]?.express || '0';
        data.expressPricePerKg = pricePerKg[subServiceId]?.express || '0';
        data.expressPricePerItem = pricePerItem[subServiceId]?.express || '0';
        
        // Add item prices
        data.itemPrices = {};
        data.expressItemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const price = clothingItemPrices[subServiceId]?.[itemId]?.express || '0';
          data.itemPrices[itemId] = price;
          data.expressItemPrices[itemId] = price;
        });
      } else if (washCategory === 'both') {
        // For "both", include all pricing
        data.standardPricePerKg = pricePerKg[subServiceId]?.standard || '0';
        data.standardPricePerItem = pricePerItem[subServiceId]?.standard || '0';
        data.expressPricePerKg = pricePerKg[subServiceId]?.express || '0';
        data.expressPricePerItem = pricePerItem[subServiceId]?.express || '0';
        
        // Default to standard for backward compatibility
        data.pricePerKg = pricePerKg[subServiceId]?.standard || '0';
        data.pricePerItem = pricePerItem[subServiceId]?.standard || '0';
        
        // Add item prices
        data.itemPrices = {};
        data.standardItemPrices = {};
        data.expressItemPrices = {};
        
        (selectedClothingItems[subServiceId] || []).forEach(itemId => {
          const standardPrice = clothingItemPrices[subServiceId]?.[itemId]?.standard || '0';
          const expressPrice = clothingItemPrices[subServiceId]?.[itemId]?.express || '0';
          
          data.standardItemPrices[itemId] = standardPrice;
          data.expressItemPrices[itemId] = expressPrice;
          data.itemPrices[itemId] = standardPrice; // Default to standard
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

  // Convert sub-services and clothing items to options for multi-select
  const subServiceOptions = subServices
    .filter(subService => subService.active)
    .map(subService => ({
      value: subService.id,
      label: subService.name
    }));

  const clothingItemOptions = clothingItems
    .filter(item => item.active)
    .map(item => ({
      value: item.id,
      label: item.name
    }));

  // Render price fields based on wash category
  const renderPriceFields = (subServiceId: string, fieldType: 'kg' | 'item') => {
    const pricing = fieldType === 'kg' ? pricePerKg : pricePerItem;
    const handleChange = fieldType === 'kg' ? handlePricePerKgChange : handlePricePerItemChange;
    const fieldLabel = fieldType === 'kg' ? 'Price per KG (₹)' : 'Price per Item (₹)';
    
    if (washCategory === 'standard') {
      return (
        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-1">
            Standard {fieldLabel}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price for Standard Wash category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input 
            type="number" 
            value={pricing[subServiceId]?.standard || ''}
            onChange={(e) => handleChange(subServiceId, 'standard', e.target.value)}
            placeholder="0"
            className="w-full"
          />
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-1">
            Express {fieldLabel}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price for Express Wash category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input 
            type="number" 
            value={pricing[subServiceId]?.express || ''}
            onChange={(e) => handleChange(subServiceId, 'express', e.target.value)}
            placeholder="0"
            className="w-full"
          />
        </div>
      );
    } else if (washCategory === 'both') {
      return (
        <div className="space-y-4">
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="express">Express</TabsTrigger>
            </TabsList>
            <TabsContent value="standard" className="pt-2">
              <div className="space-y-2">
                <Label className="text-sm">
                  Standard {fieldLabel}
                </Label>
                <Input 
                  type="number" 
                  value={pricing[subServiceId]?.standard || ''}
                  onChange={(e) => handleChange(subServiceId, 'standard', e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </TabsContent>
            <TabsContent value="express" className="pt-2">
              <div className="space-y-2">
                <Label className="text-sm">
                  Express {fieldLabel}
                </Label>
                <Input 
                  type="number" 
                  value={pricing[subServiceId]?.express || ''}
                  onChange={(e) => handleChange(subServiceId, 'express', e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    } else {
      // Fallback
      return (
        <div className="space-y-2">
          <Label className="text-sm">
            {fieldLabel}
          </Label>
          <Input 
            type="number" 
            value={pricing[subServiceId]?.standard || ''}
            onChange={(e) => handleChange(subServiceId, 'standard', e.target.value)}
            placeholder="0"
            className="w-full"
          />
        </div>
      );
    }
  };

  // Render clothing item price fields
  const renderClothingItemPriceFields = (subServiceId: string, itemId: string) => {
    if (washCategory === 'standard') {
      return (
        <div className="flex items-center gap-2 mt-1">
          <Label className="text-xs whitespace-nowrap">Standard Price:</Label>
          <Input 
            type="number" 
            value={clothingItemPrices[subServiceId]?.[itemId]?.standard || ''}
            onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'standard', e.target.value)}
            placeholder="0" 
            className="w-20"
          />
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div className="flex items-center gap-2 mt-1">
          <Label className="text-xs whitespace-nowrap">Express Price:</Label>
          <Input 
            type="number" 
            value={clothingItemPrices[subServiceId]?.[itemId]?.express || ''}
            onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'express', e.target.value)}
            placeholder="0" 
            className="w-20"
          />
        </div>
      );
    } else if (washCategory === 'both') {
      return (
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">Standard:</Label>
            <Input 
              type="number" 
              value={clothingItemPrices[subServiceId]?.[itemId]?.standard || ''}
              onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'standard', e.target.value)}
              placeholder="0" 
              className="w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs whitespace-nowrap">Express:</Label>
            <Input 
              type="number" 
              value={clothingItemPrices[subServiceId]?.[itemId]?.express || ''}
              onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'express', e.target.value)}
              placeholder="0" 
              className="w-20"
            />
          </div>
        </div>
      );
    } else {
      // Fallback
      return (
        <div className="flex items-center gap-2 mt-1">
          <Label className="text-xs whitespace-nowrap">Price:</Label>
          <Input 
            type="number" 
            value={clothingItemPrices[subServiceId]?.[itemId]?.standard || ''}
            onChange={(e) => handleClothingItemPriceChange(subServiceId, itemId, 'standard', e.target.value)}
            placeholder="0" 
            className="w-20"
          />
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {washCategory === 'standard' && "Configure services with Standard Wash pricing"}
            {washCategory === 'express' && "Configure services with Express Wash pricing"}
            {washCategory === 'both' && "Configure services with both Standard and Express Wash pricing"}
          </div>
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
          {/* Service Selection (Single-select) */}
          <div className="space-y-2">
            <Label htmlFor="service-select" className="text-base font-medium">
              Select Service
            </Label>
            <Select
              value={selectedServiceId}
              onValueChange={handleServiceChange}
              disabled={!!editingService}
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
          
          {/* Sub-service Selection (Multi-select) */}
          {selectedServiceId && (
            <div className="space-y-2">
              <Label className="text-base font-medium">
                Select Sub-services
              </Label>
              <MultiSelect
                options={subServiceOptions}
                selected={selectedSubServices}
                onChange={handleSubServiceChange}
                placeholder="Select sub-services..."
                searchPlaceholder="Search sub-services..."
                className="w-full"
              />
            </div>
          )}
          
          {/* Sub-service Configuration */}
          {selectedSubServices.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Configure Sub-services</Label>
              
              {selectedSubServices.map((subServiceId) => (
                <Card key={subServiceId} className="overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="font-medium">{getSubServiceName(subServiceId)}</h3>
                  </div>
                  <CardContent className="p-4 pt-6">
                    <div className="space-y-4">
                      {/* Pricing options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Price per KG */}
                        {renderPriceFields(subServiceId, 'kg')}
                        
                        {/* Price per Item */}
                        {renderPriceFields(subServiceId, 'item')}
                      </div>
                      
                      {/* Clothing Items */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Select Clothing Items with Prices
                        </Label>
                        
                        <MultiSelect
                          options={clothingItemOptions}
                          selected={selectedClothingItems[subServiceId] || []}
                          onChange={(values) => handleClothingItemChange(subServiceId, values)}
                          placeholder="Select clothing items..."
                          searchPlaceholder="Search clothing items..."
                          className="w-full"
                        />
                        
                        {/* Clothing Item Prices */}
                        {(selectedClothingItems[subServiceId] || []).length > 0 && (
                          <div className="mt-3 border rounded-md p-3 bg-gray-50 space-y-3">
                            {(selectedClothingItems[subServiceId] || []).map((itemId) => (
                              <div key={itemId} className="flex flex-col border-b pb-3 last:border-0 last:pb-0">
                                <div className="font-medium text-sm">
                                  {getClothingItemName(itemId)}
                                </div>
                                
                                {/* Render price fields for the item */}
                                {renderClothingItemPriceFields(subServiceId, itemId)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

export default MultiSelectServiceDialog;
