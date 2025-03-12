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
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'service' | 'subservice' | 'clothingitem'>('service');
  const [editValue, setEditValue] = useState('');
  const [editIndices, setEditIndices] = useState<{ serviceIndex: number, subServiceIndex?: number, itemId?: string }>({ serviceIndex: 0 });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'service' | 'subservice' | 'clothingitem'>('service');
  const [deleteIndices, setDeleteIndices] = useState<{ serviceIndex: number, subServiceIndex?: number, itemId?: string }>({ serviceIndex: 0 });

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

  const handleAddTemporaryService = (serviceData: any) => {
    if (!studioData) return null;
    
    if (serviceData.serviceName && serviceData.serviceId.startsWith('new-service-')) {
      const newService: StudioService = {
        id: serviceData.serviceId,
        name: serviceData.serviceName,
        active: true,
        serviceId: serviceData.serviceId,
        subServices: serviceData.subServices.map((subService: any) => ({
          ...subService,
          active: true,
          clothingItemsStatus: subService.selectedItems?.reduce((acc: Record<string, boolean>, itemId: string) => {
            acc[itemId] = true;
            return acc;
          }, {})
        }))
      };
      
      const updatedServices = [...studioData.studioServices, newService];
      setStudioData({
        ...studioData,
        studioServices: updatedServices
      });
      
      saveUpdatedServicesToLocalStorage(updatedServices);
      
      toast({
        title: "Service Added",
        description: `${serviceData.serviceName} has been added successfully.`
      });
      
      return newService;
    }
    
    return null;
  };

  const handleServiceStatusChange = (serviceIndex: number) => {
    if (!studioData || !studioData.studioServices) return;
    
    const updatedServices = [...studioData.studioServices];
    const newStatus = !updatedServices[serviceIndex].active;
    updatedServices[serviceIndex].active = newStatus;
    
    updatedServices[serviceIndex].subServices = updatedServices[serviceIndex].subServices.map(
      subService => ({
        ...subService,
        active: newStatus,
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
    
    if (subService.selectedItems && subService.selectedItems.length > 0) {
      if (!subService.clothingItemsStatus) {
        subService.clothingItemsStatus = {};
      }
      
      subService.selectedItems.forEach(itemId => {
        subService.clothingItemsStatus![itemId] = active;
      });
    }
    
    const allSubServicesInactive = service.subServices.every(sub => sub.active === false);
    if (allSubServicesInactive) {
      service.active = false;
    } else if (active && !service.active) {
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
    
    if (!subService.clothingItemsStatus) {
      subService.clothingItemsStatus = {};
    }
    
    subService.clothingItemsStatus[itemId] = active;
    
    if (subService.selectedItems && subService.selectedItems.length > 0) {
      const allClothingItemsInactive = subService.selectedItems.every(
        item => subService.clothingItemsStatus![item] === false
      );
      
      if (allClothingItemsInactive) {
        subService.active = false;
        
        const allSubServicesInactive = service.subServices.every(sub => sub.active === false);
        if (allSubServicesInactive) {
          service.active = false;
        }
      } else if (active && !subService.active) {
        subService.active = true;
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

  const handleConfirmDelete = () => {
    if (!studioData || !studioData.studioServices) return;
    
    const updatedServices = [...studioData.studioServices];
    
    switch (deleteType) {
      case 'service':
        updatedServices.splice(deleteIndices.serviceIndex, 1);
        toast({
          title: "Service Deleted",
          description: "The service has been removed successfully."
        });
        break;
        
      case 'subservice':
        if (updatedServices[deleteIndices.serviceIndex] && 
            typeof deleteIndices.subServiceIndex === 'number') {
          
          updatedServices[deleteIndices.serviceIndex].subServices.splice(deleteIndices.subServiceIndex, 1);
          
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
          
          subService.selectedItems = subService.selectedItems.filter(id => id !== deleteIndices.itemId);
          
          if (subService.standardItemPrices) {
            delete subService.standardItemPrices[deleteIndices.itemId!];
          }
          
          if (subService.expressItemPrices) {
            delete subService.expressItemPrices[deleteIndices.itemId!];
          }
          
          if (subService.itemPrices) {
            delete subService.itemPrices[deleteIndices.itemId!];
          }
          
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
    saveUpdatedServicesToLocalStorage,
    handleAddTemporaryService
  };
};
