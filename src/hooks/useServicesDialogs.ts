
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
    const success = addService(newServiceName);
    if (success) {
      setNewServiceName('');
      setIsAddServiceOpen(false);
    }
  };

  const handleAddSubService = () => {
    const success = addSubService(newSubServiceName);
    if (success) {
      setNewSubServiceName('');
      setIsAddSubServiceOpen(false);
    }
  };

  const handleAddClothingItem = () => {
    const success = addClothingItem(newClothingItemName);
    if (success) {
      setNewClothingItemName('');
      setIsAddClothingItemOpen(false);
    }
  };

  const handleEditClick = (item: ItemType) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!editingItem) return;
    
    const success = updateServiceItem(activeTab, editingItem.id, editItemName);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setEditItemName('');
    }
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
    handleEditSave
  };
};
