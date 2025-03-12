
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { StudioService } from '@/types/services';
import { useServicesData } from '@/hooks/useServicesData';

export const useStudioServicesManager = (
  studioId: string | undefined, 
  initialData: { studioName: string, studioServices: StudioService[] } | null
) => {
  const [studioData, setStudioData] = useState<{
    studioName: string;
    studioServices: StudioService[];
  } | null>(initialData);
  
  const { toast } = useToast();
  const { services: allServices, subServices: allSubServices, clothingItems: allClothingItems } = useServicesData();
  
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'service' | 'subservice' | 'clothingitem'>('service');
  const [editValue, setEditValue] = useState('');
  const [editIndices, setEditIndices] = useState<{ serviceIndex: number, subServiceIndex?: number, itemId?: string }>({ serviceIndex: 0 });

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'service' | 'subservice' | 'clothingitem'>('service');
  const [deleteIndices, setDeleteIndices] = useState<{ serviceIndex: number, subServiceIndex?: number, itemId?: string }>({ serviceIndex: 0 });

  const saveUpdatedServicesToLocalStorage = (updatedServices: StudioService[]) => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios && studioId) {
      try {
        const studios = JSON.parse(savedStudios);
        const studioIndex = studios.findIndex((s: any) => s.id.toString() === studioId.toString());
        
        if (studioIndex !== -1) {
          studios[studioIndex].studioServices = updatedServices;
          localStorage.setItem('laundryStudios', JSON.stringify(studios));
        }
      } catch (error) {
        console.error("Error updating service status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update service status"
        });
      }
    }
  };

  const handleServiceStatusChange = (serviceIndex: number) => {
    if (studioData && studioData.studioServices) {
      const updatedServices = [...studioData.studioServices];
      const newStatus = !updatedServices[serviceIndex].active;
      updatedServices[serviceIndex].active = newStatus;
      
      // Update all subservices to match the service status
      updatedServices[serviceIndex].subServices = updatedServices[serviceIndex].subServices.map(
        subService => ({
          ...subService,
          active: newStatus,
          // Also update all clothing items to match the service status
          clothingItemsStatus: subService.selectedItems?.reduce((acc, itemId) => {
            acc[itemId] = newStatus;
            return acc;
          }, {} as {[key: string]: boolean}) || subService.clothingItemsStatus
        })
      );
      
      setStudioData({
        ...studioData,
        studioServices: updatedServices
      });
      
      saveUpdatedServicesToLocalStorage(updatedServices);
      
      toast({
        title: "Service Status Updated",
        description: `${updatedServices[serviceIndex].name} has been ${updatedServices[serviceIndex].active ? 'activated' : 'deactivated'} along with all its sub-services and clothing items.`
      });
    }
  };

  const handleSubServiceStatusChange = (serviceIndex: number, subServiceIndex: number, active: boolean) => {
    if (studioData && studioData.studioServices) {
      const updatedServices = [...studioData.studioServices];
      // Ensure subServices array exists and has the specified index
      if (updatedServices[serviceIndex] && 
          updatedServices[serviceIndex].subServices && 
          updatedServices[serviceIndex].subServices[subServiceIndex]) {
        
        const subService = updatedServices[serviceIndex].subServices[subServiceIndex];
        subService.active = active;
        
        // Update all clothing items to match the subservice status
        if (subService.selectedItems && subService.selectedItems.length > 0) {
          if (!subService.clothingItemsStatus) {
            subService.clothingItemsStatus = {};
          }
          
          subService.selectedItems.forEach(itemId => {
            subService.clothingItemsStatus![itemId] = active;
          });
        }
        
        // Check if this is the only sub-service and auto-update service status
        if (updatedServices[serviceIndex].subServices.length === 1) {
          updatedServices[serviceIndex].active = active;
        } else {
          // Check if all sub-services are inactive, then service should be inactive
          const allSubServicesInactive = updatedServices[serviceIndex].subServices.every(
            sub => sub.active === false
          );
          
          // If all sub-services are inactive, set service to inactive
          if (allSubServicesInactive) {
            updatedServices[serviceIndex].active = false;
          }
        }
        
        setStudioData({
          ...studioData,
          studioServices: updatedServices
        });
        
        saveUpdatedServicesToLocalStorage(updatedServices);
        
        const subServiceName = updatedServices[serviceIndex].subServices[subServiceIndex].name;
        const message = active 
          ? `${subServiceName} has been activated along with all its clothing items.`
          : `${subServiceName} has been deactivated along with all its clothing items.${updatedServices[serviceIndex].subServices.length === 1 ? ' Service was also deactivated.' : ''}`;
        
        toast({
          title: "Sub-Service Status Updated",
          description: message
        });
      }
    }
  };

  const handleClothingItemStatusChange = (
    serviceIndex: number, 
    subServiceIndex: number, 
    itemId: string, 
    active: boolean
  ) => {
    if (studioData && studioData.studioServices) {
      const updatedServices = [...studioData.studioServices];
      // Ensure all required objects exist
      if (updatedServices[serviceIndex] && 
          updatedServices[serviceIndex].subServices && 
          updatedServices[serviceIndex].subServices[subServiceIndex]) {
        
        const subService = updatedServices[serviceIndex].subServices[subServiceIndex];
        
        // Initialize clothingItemsStatus if it doesn't exist
        if (!subService.clothingItemsStatus) {
          subService.clothingItemsStatus = {};
        }
        
        // Update status
        subService.clothingItemsStatus[itemId] = active;
        
        // Check if all clothing items are inactive, then update subservice status
        const allClothingItemsInactive = subService.selectedItems && 
          subService.selectedItems.every(item => subService.clothingItemsStatus![item] === false);
        
        // If all clothing items are inactive and there are items, set subservice to inactive
        if (allClothingItemsInactive && subService.selectedItems && subService.selectedItems.length > 0) {
          subService.active = false;
          
          // Check if this is the only sub-service and auto-update service status
          if (updatedServices[serviceIndex].subServices.length === 1) {
            updatedServices[serviceIndex].active = false;
          } else {
            // Check if all sub-services are inactive, then service should be inactive
            const allSubServicesInactive = updatedServices[serviceIndex].subServices.every(
              sub => sub.active === false
            );
            
            // If all sub-services are inactive, set service to inactive
            if (allSubServicesInactive) {
              updatedServices[serviceIndex].active = false;
            }
          }
        }
        
        setStudioData({
          ...studioData,
          studioServices: updatedServices
        });
        
        saveUpdatedServicesToLocalStorage(updatedServices);
        
        toast({
          title: "Clothing Item Status Updated",
          description: `Item has been ${active ? 'activated' : 'deactivated'}.`
        });
      }
    }
  };

  // Handle edit dialog open
  const handleEditService = (serviceIndex: number) => {
    if (studioData && studioData.studioServices[serviceIndex]) {
      setEditType('service');
      setEditValue(studioData.studioServices[serviceIndex].name);
      setEditIndices({ serviceIndex });
      setEditDialogOpen(true);
    }
  };

  const handleEditSubService = (serviceIndex: number, subServiceIndex: number) => {
    if (studioData && 
        studioData.studioServices[serviceIndex] && 
        studioData.studioServices[serviceIndex].subServices[subServiceIndex]) {
      
      const subServiceId = studioData.studioServices[serviceIndex].subServices[subServiceIndex].name;
      const subService = allSubServices.find(s => s.id === subServiceId);
      
      setEditType('subservice');
      setEditValue(subService ? subService.name : subServiceId);
      setEditIndices({ serviceIndex, subServiceIndex });
      setEditDialogOpen(true);
    }
  };

  const handleEditClothingItem = (serviceIndex: number, subServiceIndex: number, itemId: string) => {
    if (studioData && 
        studioData.studioServices[serviceIndex] && 
        studioData.studioServices[serviceIndex].subServices[subServiceIndex]) {
      
      const clothingItem = allClothingItems.find(item => item.id === itemId);
      
      setEditType('clothingitem');
      setEditValue(clothingItem ? clothingItem.name : itemId);
      setEditIndices({ serviceIndex, subServiceIndex, itemId });
      setEditDialogOpen(true);
    }
  };

  // Handle delete dialog open
  const handleDeleteService = (serviceIndex: number) => {
    if (studioData && studioData.studioServices[serviceIndex]) {
      setDeleteType('service');
      setDeleteIndices({ serviceIndex });
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteSubService = (serviceIndex: number, subServiceIndex: number) => {
    if (studioData && 
        studioData.studioServices[serviceIndex] && 
        studioData.studioServices[serviceIndex].subServices[subServiceIndex]) {
      
      setDeleteType('subservice');
      setDeleteIndices({ serviceIndex, subServiceIndex });
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteClothingItem = (serviceIndex: number, subServiceIndex: number, itemId: string) => {
    if (studioData && 
        studioData.studioServices[serviceIndex] && 
        studioData.studioServices[serviceIndex].subServices[subServiceIndex]) {
      
      setDeleteType('clothingitem');
      setDeleteIndices({ serviceIndex, subServiceIndex, itemId });
      setDeleteDialogOpen(true);
    }
  };

  // Handle actual edit
  const handleSaveEdit = () => {
    if (!studioData || !studioData.studioServices) return;
    
    const updatedServices = [...studioData.studioServices];
    
    switch (editType) {
      case 'service':
        if (updatedServices[editIndices.serviceIndex]) {
          updatedServices[editIndices.serviceIndex].name = editValue;
          toast({
            title: "Service Updated",
            description: "The service name has been updated successfully."
          });
        }
        break;
        
      case 'subservice':
        if (updatedServices[editIndices.serviceIndex] && 
            typeof editIndices.subServiceIndex === 'number') {
          // We can't directly change the ID reference, but we can update the UI name
          // This is informational only - the actual change would need to happen in the services data
          toast({
            title: "Information",
            description: "Sub-service names are managed globally in the Services section."
          });
        }
        break;
        
      case 'clothingitem':
        if (updatedServices[editIndices.serviceIndex] && 
            typeof editIndices.subServiceIndex === 'number' &&
            editIndices.itemId) {
          // We can't directly change the ID reference, but we can update the UI name
          // This is informational only - the actual change would need to happen in the services data
          toast({
            title: "Information",
            description: "Clothing item names are managed globally in the Services section."
          });
        }
        break;
    }
    
    setStudioData({
      ...studioData,
      studioServices: updatedServices
    });
    
    saveUpdatedServicesToLocalStorage(updatedServices);
    setEditDialogOpen(false);
  };

  // Handle actual delete
  const handleConfirmDelete = () => {
    if (!studioData || !studioData.studioServices) return;
    
    const updatedServices = [...studioData.studioServices];
    
    switch (deleteType) {
      case 'service':
        // Remove the entire service
        updatedServices.splice(deleteIndices.serviceIndex, 1);
        toast({
          title: "Service Deleted",
          description: "The service has been removed successfully."
        });
        break;
        
      case 'subservice':
        if (updatedServices[deleteIndices.serviceIndex] && 
            typeof deleteIndices.subServiceIndex === 'number') {
          
          // Remove the subservice
          updatedServices[deleteIndices.serviceIndex].subServices.splice(deleteIndices.subServiceIndex, 1);
          
          // If no subservices remain, make service inactive
          if (updatedServices[deleteIndices.serviceIndex].subServices.length === 0) {
            updatedServices[deleteIndices.serviceIndex].active = false;
            toast({
              title: "Sub-Service Deleted",
              description: "The sub-service has been removed and the service has been deactivated since it has no sub-services."
            });
          } else {
            toast({
              title: "Sub-Service Deleted",
              description: "The sub-service has been removed successfully."
            });
          }
        }
        break;
        
      case 'clothingitem':
        if (updatedServices[deleteIndices.serviceIndex] && 
            typeof deleteIndices.subServiceIndex === 'number' &&
            deleteIndices.itemId) {
          
          const subService = updatedServices[deleteIndices.serviceIndex].subServices[deleteIndices.subServiceIndex!];
          
          // Remove the item from selectedItems
          if (subService.selectedItems) {
            subService.selectedItems = subService.selectedItems.filter(id => id !== deleteIndices.itemId);
          }
          
          // Remove any pricing for this item
          if (subService.standardItemPrices) {
            delete subService.standardItemPrices[deleteIndices.itemId!];
          }
          
          if (subService.expressItemPrices) {
            delete subService.expressItemPrices[deleteIndices.itemId!];
          }
          
          if (subService.itemPrices) {
            delete subService.itemPrices[deleteIndices.itemId!];
          }
          
          // Remove from clothingItemsStatus
          if (subService.clothingItemsStatus) {
            delete subService.clothingItemsStatus[deleteIndices.itemId!];
          }
          
          toast({
            title: "Clothing Item Deleted",
            description: "The clothing item has been removed successfully."
          });
        }
        break;
    }
    
    setStudioData({
      ...studioData,
      studioServices: updatedServices
    });
    
    saveUpdatedServicesToLocalStorage(updatedServices);
    setDeleteDialogOpen(false);
  };

  return {
    studioData,
    setStudioData,
    editDialogOpen,
    setEditDialogOpen,
    editType,
    editValue,
    setEditValue,
    editIndices,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteType,
    deleteIndices,
    handleServiceStatusChange,
    handleSubServiceStatusChange,
    handleClothingItemStatusChange,
    handleEditService,
    handleEditSubService,
    handleEditClothingItem,
    handleDeleteService,
    handleDeleteSubService,
    handleDeleteClothingItem,
    handleSaveEdit,
    handleConfirmDelete,
    saveUpdatedServicesToLocalStorage
  };
};
