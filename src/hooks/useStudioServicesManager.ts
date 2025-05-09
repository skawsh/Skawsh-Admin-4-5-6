
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
  
  useEffect(() => {
    if (initialData !== null) {
      setStudioData(initialData);
    }
  }, [initialData]);
  
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

  // Utility function to save updated services to localStorage
  const saveUpdatedServicesToLocalStorage = (updatedServices: StudioService[]) => {
    if (!studioId) return;
    
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios) {
      try {
        const studios = JSON.parse(savedStudios);
        const studioIndex = studios.findIndex((s: any) => s.id.toString() === studioId.toString());
        
        if (studioIndex !== -1) {
          studios[studioIndex].studioServices = updatedServices;
          localStorage.setItem('laundryStudios', JSON.stringify(studios));
          console.log("Saved updated services to localStorage:", updatedServices);
        }
      } catch (error) {
        console.error("Error updating services in localStorage:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save changes"
        });
      }
    }
  };

  const handleServiceStatusChange = (serviceIndex: number) => {
    if (!studioData || !studioData.studioServices) return;
    
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
        }, { ...(subService.clothingItemsStatus || {}) })
      })
    );
    
    setStudioData({
      ...studioData,
      studioServices: updatedServices
    });
    
    saveUpdatedServicesToLocalStorage(updatedServices);
    
    toast({
      title: "Service Status Updated",
      description: `${updatedServices[serviceIndex].name} has been ${newStatus ? 'activated' : 'deactivated'} along with all its sub-services and clothing items.`
    });
  };

  const handleSubServiceStatusChange = (serviceIndex: number, subServiceIndex: number, active: boolean) => {
    if (!studioData || !studioData.studioServices) return;
    
    const updatedServices = [...studioData.studioServices];
    const service = updatedServices[serviceIndex];
    
    if (!service || !service.subServices || !service.subServices[subServiceIndex]) return;
    
    const subService = service.subServices[subServiceIndex];
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
    
    // If all sub-services are inactive, deactivate the service
    const allSubServicesInactive = service.subServices.every(sub => sub.active === false);
    if (allSubServicesInactive) {
      service.active = false;
    } else if (active && !service.active) {
      // If at least one sub-service is active, activate the service
      service.active = true;
    }
    
    setStudioData({
      ...studioData,
      studioServices: updatedServices
    });
    
    saveUpdatedServicesToLocalStorage(updatedServices);
    
    const subServiceName = allSubServices.find(s => s.id === subService.name)?.name || subService.name;
    
    toast({
      title: "Sub-Service Status Updated",
      description: `${subServiceName} has been ${active ? 'activated' : 'deactivated'} along with its clothing items.`
    });
  };

  const handleClothingItemStatusChange = (
    serviceIndex: number, 
    subServiceIndex: number, 
    itemId: string, 
    active: boolean
  ) => {
    if (!studioData || !studioData.studioServices) return;
    
    const updatedServices = [...studioData.studioServices];
    const service = updatedServices[serviceIndex];
    
    if (!service || !service.subServices || !service.subServices[subServiceIndex]) return;
    
    const subService = service.subServices[subServiceIndex];
    
    // Initialize clothingItemsStatus if it doesn't exist
    if (!subService.clothingItemsStatus) {
      subService.clothingItemsStatus = {};
    }
    
    // Update status
    subService.clothingItemsStatus[itemId] = active;
    
    // Check if all clothing items are inactive, then update subservice status
    if (subService.selectedItems && subService.selectedItems.length > 0) {
      const allClothingItemsInactive = subService.selectedItems.every(
        item => subService.clothingItemsStatus![item] === false
      );
      
      if (allClothingItemsInactive) {
        subService.active = false;
        
        // Check if all sub-services are inactive, then service should be inactive
        const allSubServicesInactive = service.subServices.every(sub => sub.active === false);
        if (allSubServicesInactive) {
          service.active = false;
        }
      } else if (active && !subService.active) {
        // If at least one clothing item is active, activate the subservice
        subService.active = true;
        // Also activate the service if it's inactive
        if (!service.active) {
          service.active = true;
        }
      }
    }
    
    setStudioData({
      ...studioData,
      studioServices: updatedServices
    });
    
    saveUpdatedServicesToLocalStorage(updatedServices);
    
    const itemName = allClothingItems.find(item => item.id === itemId)?.name || itemId;
    
    toast({
      title: "Clothing Item Status Updated",
      description: `${itemName} has been ${active ? 'activated' : 'deactivated'}.`
    });
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
    if (!studioData) {
      // Initialize studioData if it doesn't exist
      setStudioData({
        studioName: "Studio",
        studioServices: []
      });
    }
    
    const updatedServices = studioData ? [...studioData.studioServices] : [];
    
    switch (editType) {
      case 'service':
        if (editIndices.serviceIndex === -1) {
          // Creating a new service
          const newService: StudioService = {
            id: Date.now().toString(),
            name: editValue,
            active: true,
            serviceId: allServices[0]?.id || "service-1", // Default to first available service if any
            subServices: []
          };
          updatedServices.push(newService);
          toast({
            title: "Service Created",
            description: "New service has been created successfully."
          });
        } else if (updatedServices[editIndices.serviceIndex]) {
          // Updating existing service
          updatedServices[editIndices.serviceIndex].name = editValue;
          toast({
            title: "Service Updated",
            description: "The service name has been updated successfully."
          });
        }
        break;
        
      case 'subservice':
        if (updatedServices[editIndices.serviceIndex]) {
          if (typeof editIndices.subServiceIndex === 'number' && editIndices.subServiceIndex === -1) {
            // Creating a new subservice
            const newSubService = {
              name: allSubServices[0]?.id || "subservice-1", // Default to first available subservice
              standardPricePerKg: 0,
              expressPricePerKg: 0,
              standardPricePerItem: 0,
              expressPricePerItem: 0,
              active: true,
              selectedItems: [],
              standardItemPrices: {},
              expressItemPrices: {},
              clothingItemsStatus: {}
            };
            updatedServices[editIndices.serviceIndex].subServices.push(newSubService);
            toast({
              title: "Sub-Service Created",
              description: "New sub-service has been created successfully."
            });
          } else if (typeof editIndices.subServiceIndex === 'number') {
            // For subservices, we're actually selecting from predefined options
            // rather than editing the name directly
            const selectedSubService = allSubServices.find(s => s.name === editValue);
            if (selectedSubService) {
              updatedServices[editIndices.serviceIndex].subServices[editIndices.subServiceIndex].name = selectedSubService.id;
              toast({
                title: "Sub-Service Updated",
                description: "The sub-service has been updated successfully."
              });
            } else {
              toast({
                title: "Information",
                description: "Sub-service names are managed globally in the Services section."
              });
            }
          }
        }
        break;
        
      case 'clothingitem':
        // Similar to subservices, clothing items are selected from predefined options
        toast({
          title: "Information",
          description: "Clothing item names are managed globally in the Services section."
        });
        break;
    }
    
    const newStudioData = {
      studioName: studioData?.studioName || "Studio",
      studioServices: updatedServices
    };
    
    setStudioData(newStudioData);
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
