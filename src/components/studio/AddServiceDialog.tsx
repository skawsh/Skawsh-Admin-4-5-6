
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Service, SubService, ClothingItem } from '@/types/services';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  washCategory: string; // Add wash category prop
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  onOpenChange,
  services,
  subServices,
  clothingItems,
  onServiceAdded,
  editingService = null,
  washCategory
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedSubServiceNames, setSelectedSubServiceNames] = useState<string[]>([]);
  const [pricePerKg, setPricePerKg] = useState<Record<string, string>>({});
  const [pricePerItem, setPricePerItem] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [itemPrices, setItemPrices] = useState<Record<string, Record<string, string>>>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Wash category specific pricing
  const [standardPricePerKg, setStandardPricePerKg] = useState<Record<string, string>>({});
  const [expressPricePerKg, setExpressPricePerKg] = useState<Record<string, string>>({});
  const [standardPricePerItem, setStandardPricePerItem] = useState<Record<string, string>>({});
  const [expressPricePerItem, setExpressPricePerItem] = useState<Record<string, string>>({});
  const [standardItemPrices, setStandardItemPrices] = useState<Record<string, Record<string, string>>>({});
  const [expressItemPrices, setExpressItemPrices] = useState<Record<string, Record<string, string>>>({});

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
    setStandardPricePerKg({});
    setExpressPricePerKg({});
    setStandardPricePerItem({});
    setExpressPricePerItem({});
    setStandardItemPrices({});
    setExpressItemPrices({});
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
    
    // For wash category specific pricing
    const newStandardPricePerKg: Record<string, string> = {};
    const newExpressPricePerKg: Record<string, string> = {};
    const newStandardPricePerItem: Record<string, string> = {};
    const newExpressPricePerItem: Record<string, string> = {};
    const newStandardItemPrices: Record<string, Record<string, string>> = {};
    const newExpressItemPrices: Record<string, Record<string, string>> = {};

    // Populate data for each sub-service
    editingService.subServices.forEach(subService => {
      const subServiceName = subService.name;
      
      // Set regular prices (for backward compatibility)
      if (subService.pricePerKg) {
        newPricePerKg[subServiceName] = subService.pricePerKg.toString();
      }
      
      if (subService.pricePerItem) {
        newPricePerItem[subServiceName] = subService.pricePerItem.toString();
      }
      
      // Set wash category specific prices if they exist
      if (subService.standardPricePerKg) {
        newStandardPricePerKg[subServiceName] = subService.standardPricePerKg.toString();
      }
      
      if (subService.expressPricePerKg) {
        newExpressPricePerKg[subServiceName] = subService.expressPricePerKg.toString();
      }
      
      if (subService.standardPricePerItem) {
        newStandardPricePerItem[subServiceName] = subService.standardPricePerItem.toString();
      }
      
      if (subService.expressPricePerItem) {
        newExpressPricePerItem[subServiceName] = subService.expressPricePerItem.toString();
      }
      
      // Set selected items and their prices
      if (subService.selectedItems && subService.selectedItems.length > 0) {
        newSelectedItems[subServiceName] = [...subService.selectedItems];
        
        if (subService.itemPrices) {
          newItemPrices[subServiceName] = { ...subService.itemPrices };
        }
        
        // Set wash category specific item prices
        if (subService.standardItemPrices) {
          newStandardItemPrices[subServiceName] = { ...subService.standardItemPrices };
        }
        
        if (subService.expressItemPrices) {
          newExpressItemPrices[subServiceName] = { ...subService.expressItemPrices };
        }
      }
    });

    // Update all state
    setPricePerKg(newPricePerKg);
    setPricePerItem(newPricePerItem);
    setSelectedItems(newSelectedItems);
    setItemPrices(newItemPrices);
    setStandardPricePerKg(newStandardPricePerKg);
    setExpressPricePerKg(newExpressPricePerKg);
    setStandardPricePerItem(newStandardPricePerItem);
    setExpressPricePerItem(newExpressPricePerItem);
    setStandardItemPrices(newStandardItemPrices);
    setExpressItemPrices(newExpressItemPrices);
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

  const handlePricePerKgChange = (subServiceName: string, value: string, type: string = 'regular') => {
    if (type === 'standard') {
      setStandardPricePerKg(prev => ({
        ...prev,
        [subServiceName]: value
      }));
    } else if (type === 'express') {
      setExpressPricePerKg(prev => ({
        ...prev,
        [subServiceName]: value
      }));
    } else {
      setPricePerKg(prev => ({
        ...prev,
        [subServiceName]: value
      }));
    }
  };

  const handlePricePerItemChange = (subServiceName: string, value: string, type: string = 'regular') => {
    if (type === 'standard') {
      setStandardPricePerItem(prev => ({
        ...prev,
        [subServiceName]: value
      }));
    } else if (type === 'express') {
      setExpressPricePerItem(prev => ({
        ...prev,
        [subServiceName]: value
      }));
    } else {
      setPricePerItem(prev => ({
        ...prev,
        [subServiceName]: value
      }));
    }
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

  const handleItemPriceChange = (subServiceName: string, itemId: string, price: string, type: string = 'regular') => {
    if (type === 'standard') {
      setStandardItemPrices(prev => {
        const currentPrices = prev[subServiceName] || {};
        return {
          ...prev,
          [subServiceName]: {
            ...currentPrices,
            [itemId]: price
          }
        };
      });
    } else if (type === 'express') {
      setExpressItemPrices(prev => {
        const currentPrices = prev[subServiceName] || {};
        return {
          ...prev,
          [subServiceName]: {
            ...currentPrices,
            [itemId]: price
          }
        };
      });
    } else {
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
    }
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
      let hasPricing = false;
      
      if (washCategory === 'standard') {
        const hasPerKgPrice = standardPricePerKg[subServiceName] && standardPricePerKg[subServiceName] !== '0';
        const hasPerItemPrice = standardPricePerItem[subServiceName] && standardPricePerItem[subServiceName] !== '0';
        const hasItems = selectedItems[subServiceName] && selectedItems[subServiceName].length > 0;
        
        if (hasPerKgPrice || hasPerItemPrice) {
          hasPricing = true;
        }
        
        if (hasItems) {
          const standardPricesForService = standardItemPrices[subServiceName] || {};
          const anyItemHasPrice = selectedItems[subServiceName].some(itemId => standardPricesForService[itemId]);
          if (anyItemHasPrice) {
            hasPricing = true;
          }
        }
      } else if (washCategory === 'express') {
        const hasPerKgPrice = expressPricePerKg[subServiceName] && expressPricePerKg[subServiceName] !== '0';
        const hasPerItemPrice = expressPricePerItem[subServiceName] && expressPricePerItem[subServiceName] !== '0';
        const hasItems = selectedItems[subServiceName] && selectedItems[subServiceName].length > 0;
        
        if (hasPerKgPrice || hasPerItemPrice) {
          hasPricing = true;
        }
        
        if (hasItems) {
          const expressPricesForService = expressItemPrices[subServiceName] || {};
          const anyItemHasPrice = selectedItems[subServiceName].some(itemId => expressPricesForService[itemId]);
          if (anyItemHasPrice) {
            hasPricing = true;
          }
        }
      } else if (washCategory === 'both') {
        // For "both" category, we need pricing for either standard or express
        const hasStandardKgPrice = standardPricePerKg[subServiceName] && standardPricePerKg[subServiceName] !== '0';
        const hasStandardItemPrice = standardPricePerItem[subServiceName] && standardPricePerItem[subServiceName] !== '0';
        const hasExpressKgPrice = expressPricePerKg[subServiceName] && expressPricePerKg[subServiceName] !== '0';
        const hasExpressItemPrice = expressPricePerItem[subServiceName] && expressPricePerItem[subServiceName] !== '0';
        const hasItems = selectedItems[subServiceName] && selectedItems[subServiceName].length > 0;
        
        if (hasStandardKgPrice || hasStandardItemPrice || hasExpressKgPrice || hasExpressItemPrice) {
          hasPricing = true;
        }
        
        if (hasItems) {
          const standardPricesForService = standardItemPrices[subServiceName] || {};
          const expressPricesForService = expressItemPrices[subServiceName] || {};
          
          const anyItemHasPrice = selectedItems[subServiceName].some(itemId => 
            standardPricesForService[itemId] || expressPricesForService[itemId]
          );
          
          if (anyItemHasPrice) {
            hasPricing = true;
          }
        }
      } else {
        // Fallback for regular pricing
        const hasPerKgPrice = pricePerKg[subServiceName] && pricePerKg[subServiceName] !== '0';
        const hasPerItemPrice = pricePerItem[subServiceName] && pricePerItem[subServiceName] !== '0';
        const hasItems = selectedItems[subServiceName] && selectedItems[subServiceName].length > 0;
        const itemPricesForService = itemPrices[subServiceName] || {};
        
        if (hasPerKgPrice || hasPerItemPrice) {
          hasPricing = true;
        }
        
        if (hasItems) {
          const anyItemHasPrice = selectedItems[subServiceName].some(itemId => itemPricesForService[itemId]);
          if (anyItemHasPrice) {
            hasPricing = true;
          }
        }
      }
      
      if (!hasPricing) {
        errors.push(`Please add pricing for ${getSelectedSubServiceName(subServiceName)}`);
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
      const data: any = {
        name: subServiceName,
        selectedItems: selectedItems[subServiceName] || []
      };
      
      // Add pricing based on wash category
      if (washCategory === 'standard') {
        data.pricePerKg = standardPricePerKg[subServiceName] || '0';
        data.pricePerItem = standardPricePerItem[subServiceName] || '0';
        data.itemPrices = standardItemPrices[subServiceName] || {};
        // Store the category-specific prices as well
        data.standardPricePerKg = standardPricePerKg[subServiceName] || '0';
        data.standardPricePerItem = standardPricePerItem[subServiceName] || '0';
        data.standardItemPrices = standardItemPrices[subServiceName] || {};
      } else if (washCategory === 'express') {
        data.pricePerKg = expressPricePerKg[subServiceName] || '0';
        data.pricePerItem = expressPricePerItem[subServiceName] || '0';
        data.itemPrices = expressItemPrices[subServiceName] || {};
        // Store the category-specific prices as well
        data.expressPricePerKg = expressPricePerKg[subServiceName] || '0';
        data.expressPricePerItem = expressPricePerItem[subServiceName] || '0';
        data.expressItemPrices = expressItemPrices[subServiceName] || {};
      } else if (washCategory === 'both') {
        // For "both", store them separately
        data.standardPricePerKg = standardPricePerKg[subServiceName] || '0';
        data.standardPricePerItem = standardPricePerItem[subServiceName] || '0';
        data.standardItemPrices = standardItemPrices[subServiceName] || {};
        
        data.expressPricePerKg = expressPricePerKg[subServiceName] || '0';
        data.expressPricePerItem = expressPricePerItem[subServiceName] || '0';
        data.expressItemPrices = expressItemPrices[subServiceName] || {};
        
        // Use standard as default for general compatibility
        data.pricePerKg = standardPricePerKg[subServiceName] || '0';
        data.pricePerItem = standardPricePerItem[subServiceName] || '0';
        data.itemPrices = standardItemPrices[subServiceName] || {};
      } else {
        // Fallback for regular pricing
        data.pricePerKg = pricePerKg[subServiceName] || '0';
        data.pricePerItem = pricePerItem[subServiceName] || '0';
        data.itemPrices = itemPrices[subServiceName] || {};
      }
      
      return data;
    });
    
    const serviceData = {
      serviceId: selectedServiceId,
      subServices: subServicesData
    };
    
    onServiceAdded(serviceData);
  };

  // Render price input fields based on wash category
  const renderPricePerKgInput = (subServiceName: string) => {
    if (washCategory === 'standard') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`standard-price-kg-${subServiceName}`} className="text-sm flex items-center gap-1">
            Standard Price per KG (₹):
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price per KG for Standard Wash category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input 
            id={`standard-price-kg-${subServiceName}`}
            type="number" 
            value={standardPricePerKg[subServiceName] || ''}
            onChange={(e) => handlePricePerKgChange(subServiceName, e.target.value, 'standard')}
            placeholder="0"
            className="w-full"
          />
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`express-price-kg-${subServiceName}`} className="text-sm flex items-center gap-1">
            Express Price per KG (₹):
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price per KG for Express Wash category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input 
            id={`express-price-kg-${subServiceName}`}
            type="number" 
            value={expressPricePerKg[subServiceName] || ''}
            onChange={(e) => handlePricePerKgChange(subServiceName, e.target.value, 'express')}
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
                <Label htmlFor={`standard-price-kg-${subServiceName}`} className="text-sm">
                  Standard Price per KG (₹):
                </Label>
                <Input 
                  id={`standard-price-kg-${subServiceName}`}
                  type="number" 
                  value={standardPricePerKg[subServiceName] || ''}
                  onChange={(e) => handlePricePerKgChange(subServiceName, e.target.value, 'standard')}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </TabsContent>
            <TabsContent value="express" className="pt-2">
              <div className="space-y-2">
                <Label htmlFor={`express-price-kg-${subServiceName}`} className="text-sm">
                  Express Price per KG (₹):
                </Label>
                <Input 
                  id={`express-price-kg-${subServiceName}`}
                  type="number" 
                  value={expressPricePerKg[subServiceName] || ''}
                  onChange={(e) => handlePricePerKgChange(subServiceName, e.target.value, 'express')}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    } else {
      // Regular price input (for compatibility)
      return (
        <div className="space-y-2">
          <Label htmlFor={`price-kg-${subServiceName}`} className="text-sm">
            Price per KG (₹):
          </Label>
          <Input 
            id={`price-kg-${subServiceName}`}
            type="number" 
            value={pricePerKg[subServiceName] || ''}
            onChange={(e) => handlePricePerKgChange(subServiceName, e.target.value)}
            placeholder="0"
            className="w-full"
          />
        </div>
      );
    }
  };

  // Render price per item input fields based on wash category
  const renderPricePerItemInput = (subServiceName: string) => {
    if (washCategory === 'standard') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`standard-price-item-${subServiceName}`} className="text-sm flex items-center gap-1">
            Standard Price per Item (₹):
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price per Item for Standard Wash category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input 
            id={`standard-price-item-${subServiceName}`}
            type="number" 
            value={standardPricePerItem[subServiceName] || ''}
            onChange={(e) => handlePricePerItemChange(subServiceName, e.target.value, 'standard')}
            placeholder="0"
            className="w-full"
          />
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div className="space-y-2">
          <Label htmlFor={`express-price-item-${subServiceName}`} className="text-sm flex items-center gap-1">
            Express Price per Item (₹):
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price per Item for Express Wash category</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input 
            id={`express-price-item-${subServiceName}`}
            type="number" 
            value={expressPricePerItem[subServiceName] || ''}
            onChange={(e) => handlePricePerItemChange(subServiceName, e.target.value, 'express')}
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
                <Label htmlFor={`standard-price-item-${subServiceName}`} className="text-sm">
                  Standard Price per Item (₹):
                </Label>
                <Input 
                  id={`standard-price-item-${subServiceName}`}
                  type="number" 
                  value={standardPricePerItem[subServiceName] || ''}
                  onChange={(e) => handlePricePerItemChange(subServiceName, e.target.value, 'standard')}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </TabsContent>
            <TabsContent value="express" className="pt-2">
              <div className="space-y-2">
                <Label htmlFor={`express-price-item-${subServiceName}`} className="text-sm">
                  Express Price per Item (₹):
                </Label>
                <Input 
                  id={`express-price-item-${subServiceName}`}
                  type="number" 
                  value={expressPricePerItem[subServiceName] || ''}
                  onChange={(e) => handlePricePerItemChange(subServiceName, e.target.value, 'express')}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    } else {
      // Regular price input (for compatibility)
      return (
        <div className="space-y-2">
          <Label htmlFor={`price-item-${subServiceName}`} className="text-sm">
            Price per Item (₹):
          </Label>
          <Input 
            id={`price-item-${subServiceName}`}
            type="number" 
            value={pricePerItem[subServiceName] || ''}
            onChange={(e) => handlePricePerItemChange(subServiceName, e.target.value)}
            placeholder="0"
            className="w-full"
          />
        </div>
      );
    }
  };

  // Render clothing item price inputs based on wash category
  const renderClothingItemPrice = (subServiceName: string, itemId: string) => {
    if (washCategory === 'standard') {
      return (
        <div className="flex items-center space-x-2">
          <Label htmlFor={`standard-price-${subServiceName}-${itemId}`} className="text-xs whitespace-nowrap">
            Standard Price:
          </Label>
          <Input 
            id={`standard-price-${subServiceName}-${itemId}`}
            type="number" 
            value={standardItemPrices[subServiceName]?.[itemId] || ''}
            onChange={(e) => handleItemPriceChange(subServiceName, itemId, e.target.value, 'standard')}
            placeholder="Price" 
            className="w-20"
          />
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div className="flex items-center space-x-2">
          <Label htmlFor={`express-price-${subServiceName}-${itemId}`} className="text-xs whitespace-nowrap">
            Express Price:
          </Label>
          <Input 
            id={`express-price-${subServiceName}-${itemId}`}
            type="number" 
            value={expressItemPrices[subServiceName]?.[itemId] || ''}
            onChange={(e) => handleItemPriceChange(subServiceName, itemId, e.target.value, 'express')}
            placeholder="Price" 
            className="w-20"
          />
        </div>
      );
    } else if (washCategory === 'both') {
      return (
        <div className="flex flex-wrap gap-2 items-center mt-1 w-full pl-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor={`standard-price-${subServiceName}-${itemId}`} className="text-xs whitespace-nowrap">
              Standard:
            </Label>
            <Input 
              id={`standard-price-${subServiceName}-${itemId}`}
              type="number" 
              value={standardItemPrices[subServiceName]?.[itemId] || ''}
              onChange={(e) => handleItemPriceChange(subServiceName, itemId, e.target.value, 'standard')}
              placeholder="Price" 
              className="w-20"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor={`express-price-${subServiceName}-${itemId}`} className="text-xs whitespace-nowrap">
              Express:
            </Label>
            <Input 
              id={`express-price-${subServiceName}-${itemId}`}
              type="number" 
              value={expressItemPrices[subServiceName]?.[itemId] || ''}
              onChange={(e) => handleItemPriceChange(subServiceName, itemId, e.target.value, 'express')}
              placeholder="Price" 
              className="w-20"
            />
          </div>
        </div>
      );
    } else {
      // Regular price input (for compatibility)
      return (
        <div className="flex items-center space-x-2">
          <Label htmlFor={`price-${subServiceName}-${itemId}`} className="text-xs whitespace-nowrap">
            Price:
          </Label>
          <Input 
            id={`price-${subServiceName}-${itemId}`}
            type="number" 
            value={itemPrices[subServiceName]?.[itemId] || ''}
            onChange={(e) => handleItemPriceChange(subServiceName, itemId, e.target.value)}
            placeholder="Price" 
            className="w-20"
          />
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
          <DialogDescription>
            {washCategory === 'standard' && "Configure services with Standard Wash pricing"}
            {washCategory === 'express' && "Configure services with Express Wash pricing"}
            {washCategory === 'both' && "Configure services with both Standard and Express Wash pricing"}
          </DialogDescription>
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
            <Label htmlFor="service-select" className="text-base font-medium">
              Select Service:
            </Label>
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
              <Label className="text-base font-medium">Select Sub-services:</Label>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Dynamic Price per KG input based on wash category */}
                          {renderPricePerKgInput(subService.id)}
                          
                          {/* Dynamic Price per Item input based on wash category */}
                          {renderPricePerItemInput(subService.id)}
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Clothing Items with Prices:</Label>
                          <div className="grid grid-cols-1 gap-3 border rounded-md p-3 bg-gray-50">
                            {clothingItems.filter(item => item.active).map((item) => (
                              <div key={item.id} className="flex flex-wrap items-center gap-2 border-b pb-3 last:border-0 last:pb-0">
                                <Checkbox 
                                  id={`item-${subService.id}-${item.id}`}
                                  checked={(selectedItems[subService.id] || []).includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    if (typeof checked === 'boolean') {
                                      handleItemCheck(subService.id, item.id, checked);
                                    }
                                  }}
                                />
                                <Label htmlFor={`item-${subService.id}-${item.id}`} className="text-sm flex-1 min-w-[120px]">
                                  {item.name}
                                </Label>
                                
                                {(selectedItems[subService.id] || []).includes(item.id) && (
                                  renderClothingItemPrice(subService.id, item.id)
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
