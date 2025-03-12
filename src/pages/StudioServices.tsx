
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StudioServicesDetails from '../components/services/StudioServicesDetails';
import { StudioService } from '@/types/services';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useServicesData } from '@/hooks/useServicesData';

interface SubService {
  name: string;
  standardPricePerKg?: number;
  expressPricePerKg?: number;
  standardPricePerItem?: number;
  expressPricePerItem?: number;
  selectedItems?: string[];
  standardItemPrices?: { [key: string]: number };
  expressItemPrices?: { [key: string]: number };
  itemPrices?: { [key: string]: number };
  active?: boolean;
  clothingItemsStatus?: { [key: string]: boolean };
}

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, title, value, onChange, onSave }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Enter name"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StudioServices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { services: allServices, subServices: allSubServices, clothingItems: allClothingItems } = useServicesData();
  const [studioData, setStudioData] = useState<{
    studioName: string;
    studioServices: StudioService[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'service' | 'subservice' | 'clothingitem'>('service');
  const [editValue, setEditValue] = useState('');
  const [editIndices, setEditIndices] = useState<{ serviceIndex: number, subServiceIndex?: number, itemId?: string }>({ serviceIndex: 0 });

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'service' | 'subservice' | 'clothingitem'>('service');
  const [deleteIndices, setDeleteIndices] = useState<{ serviceIndex: number, subServiceIndex?: number, itemId?: string }>({ serviceIndex: 0 });

  useEffect(() => {
    const loadStudioServices = () => {
      setLoading(true);
      const savedStudios = localStorage.getItem('laundryStudios');
      
      if (savedStudios && id) {
        try {
          const studios = JSON.parse(savedStudios);
          const studio = studios.find((s: any) => s.id.toString() === id.toString());
          
          if (studio) {
            console.log("Found studio:", studio);
            
            // Check if studioServices exists in the studio object
            if (studio.studioServices) {
              console.log("Studio services found:", studio.studioServices);
              
              // Ensure each subservice has an active property and clothingItemsStatus
              const updatedStudioServices = studio.studioServices.map((service: any) => ({
                ...service,
                subServices: service.subServices.map((subService: SubService) => {
                  // Initialize clothingItemsStatus if it doesn't exist
                  const clothingItemsStatus = subService.clothingItemsStatus || {};
                  
                  // If there are selectedItems but no status for them, initialize all to active
                  if (subService.selectedItems && subService.selectedItems.length > 0) {
                    subService.selectedItems.forEach(itemId => {
                      if (clothingItemsStatus[itemId] === undefined) {
                        clothingItemsStatus[itemId] = true;
                      }
                    });
                  }
                  
                  return {
                    ...subService,
                    active: subService.active !== false, // Default to true if not explicitly false
                    clothingItemsStatus
                  };
                })
              }));
              
              setStudioData({
                studioName: studio.studioName,
                studioServices: updatedStudioServices
              });
            } else {
              console.log("No studio services found in the studio object");
              
              // Check if services data exists but is saved in a different format
              if (studio.services && Array.isArray(studio.services)) {
                setStudioData({
                  studioName: studio.studioName,
                  studioServices: studio.services
                });
              } else {
                // No services found in any expected format
                setStudioData({
                  studioName: studio.studioName,
                  studioServices: []
                });
              }
            }
          } else {
            console.log("Studio not found with ID:", id);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Studio not found"
            });
            navigate('/studios');
          }
        } catch (error) {
          console.error("Error parsing studio data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load studio data"
          });
        }
      } else {
        console.log("No studios data found in localStorage or ID is missing");
      }
      setLoading(false);
    };

    loadStudioServices();
  }, [id, navigate, toast]);

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

  const saveUpdatedServicesToLocalStorage = (updatedServices: StudioService[]) => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios && id) {
      try {
        const studios = JSON.parse(savedStudios);
        const studioIndex = studios.findIndex((s: any) => s.id.toString() === id.toString());
        
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

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="bg-white" 
              onClick={() => navigate(`/studios/${id}`)}
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {loading ? 'Loading...' : `${studioData?.studioName || 'Studio'} Services`}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage services for this studio
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
            Loading...
          </div>
        ) : studioData && studioData.studioServices && studioData.studioServices.length > 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
            <StudioServicesDetails
              studioServices={studioData.studioServices}
              onServiceStatusChange={handleServiceStatusChange}
              onSubServiceStatusChange={handleSubServiceStatusChange}
              onClothingItemStatusChange={handleClothingItemStatusChange}
              onServiceEdit={handleEditService}
              onServiceDelete={handleDeleteService}
              onSubServiceEdit={handleEditSubService}
              onSubServiceDelete={handleDeleteSubService}
              onClothingItemEdit={handleEditClothingItem}
              onClothingItemDelete={handleDeleteClothingItem}
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Services Added</h3>
              <p className="text-gray-500 mb-4">
                This studio doesn't have any services configured yet.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title={`Edit ${editType === 'service' ? 'Service' : editType === 'subservice' ? 'Sub-service' : 'Clothing Item'}`}
        value={editValue}
        onChange={setEditValue}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this {deleteType === 'service' ? 'service' : deleteType === 'subservice' ? 'sub-service' : 'clothing item'}?</p>
            <p className="text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StudioServices;
