
import { useState } from 'react';
import { ItemType } from '../types/services';
import { useToast } from "@/hooks/use-toast";

export const useServicesDialogs = (
  activeTab: string,
  addService: (name: string) => boolean,
  addSubService: (name: string) => boolean,
  addClothingItem: (name: string) => boolean,
  updateServiceItem: (itemType: string, itemId: string, name: string) => boolean
) => {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddSubServiceOpen, setIsAddSubServiceOpen] = useState(false);
  const [isAddClothingItemOpen, setIsAddClothingItemOpen] = useState(false);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemType | null>(null);
  const [editItemName, setEditItemName] = useState('');
  
  const [newServiceName, setNewServiceName] = useState('');
  const [newSubServiceName, setNewSubServiceName] = useState('');
  const [newClothingItemName, setNewClothingItemName] = useState('');
  
  // For multi-select functionality
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [selectedClothingItems, setSelectedClothingItems] = useState<string[]>([]);
  const [clothingItemPrices, setClothingItemPrices] = useState<Record<string, { standard: string, express: string }>>({});
  
  const { toast } = useToast();

  const handleAddButtonClick = () => {
    switch (activeTab) {
      case 'sub-services':
        setIsAddSubServiceOpen(true);
        break;
      case 'clothing-items':
        setIsAddClothingItemOpen(true);
        break;
      default:
        setIsAddServiceOpen(true);
        break;
    }
  };

  const handleAddService = () => {
    if (!newServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name cannot be empty"
      });
      return;
    }
    
    const success = addService(newServiceName);
    if (success) {
      setNewServiceName('');
      setIsAddServiceOpen(false);
      toast({
        title: "Success",
        description: "Service added successfully"
      });
    }
  };

  const handleAddSubService = () => {
    if (!newSubServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sub-service name cannot be empty"
      });
      return;
    }
    
    const success = addSubService(newSubServiceName);
    if (success) {
      setNewSubServiceName('');
      setIsAddSubServiceOpen(false);
      toast({
        title: "Success",
        description: "Sub-service added successfully"
      });
    }
  };

  const handleAddClothingItem = () => {
    if (!newClothingItemName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Clothing item name cannot be empty"
      });
      return;
    }
    
    const success = addClothingItem(newClothingItemName);
    if (success) {
      setNewClothingItemName('');
      setIsAddClothingItemOpen(false);
      toast({
        title: "Success",
        description: "Clothing item added successfully"
      });
    }
  };

  const handleEditClick = (item: ItemType) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingItem) return;
    
    if (!editItemName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name cannot be empty"
      });
      return;
    }
    
    const success = updateServiceItem(activeTab, editingItem.id, editItemName);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setEditItemName('');
      toast({
        title: "Success",
        description: "Item updated successfully"
      });
    }
  };

  // New functions for multi-select
  const handleSelectSubService = (selectedValues: string[]) => {
    setSelectedSubServices(selectedValues);
  };

  const handleSelectClothingItem = (selectedValues: string[]) => {
    setSelectedClothingItems(selectedValues);
    
    // Initialize prices for newly added items
    const newPrices = { ...clothingItemPrices };
    selectedValues.forEach(itemId => {
      if (!newPrices[itemId]) {
        newPrices[itemId] = { standard: '', express: '' };
      }
    });
    setClothingItemPrices(newPrices);
  };

  const handleClothingItemPriceChange = (
    itemId: string, 
    type: 'standard' | 'express', 
    value: string
  ) => {
    setClothingItemPrices(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [type]: value
      }
    }));
  };

  const resetMultiSelects = () => {
    setSelectedSubServices([]);
    setSelectedClothingItems([]);
    setClothingItemPrices({});
  };

  return {
    isAddServiceOpen,
    setIsAddServiceOpen,
    isAddSubServiceOpen,
    setIsAddSubServiceOpen,
    isAddClothingItemOpen,
    setIsAddClothingItemOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingItem,
    editItemName,
    setEditItemName,
    newServiceName,
    setNewServiceName,
    newSubServiceName,
    setNewSubServiceName,
    newClothingItemName,
    setNewClothingItemName,
    handleAddButtonClick,
    handleAddService,
    handleAddSubService,
    handleAddClothingItem,
    handleEditClick,
    handleEditSave,
    // Multi-select related exports
    selectedSubServices,
    setSelectedSubServices,
    handleSelectSubService,
    selectedClothingItems,
    setSelectedClothingItems,
    handleSelectClothingItem,
    clothingItemPrices,
    handleClothingItemPriceChange,
    resetMultiSelects
  };
};
