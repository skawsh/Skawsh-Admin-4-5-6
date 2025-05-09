
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useStudioServicesLoader } from '@/hooks/useStudioServicesLoader';
import { useStudioServicesManager } from '@/hooks/useStudioServicesManager';
import ServiceManagement from '@/components/studio/services/ServiceManagement';
import StudioServicesHeader from '@/components/studio/services/StudioServicesHeader';
import EmptyServicesState from '@/components/studio/services/EmptyServicesState';
import EditServiceDialog from '@/components/studio/services/EditServiceDialog';
import DeleteConfirmationDialog from '@/components/studio/services/DeleteConfirmationDialog';
import EditPricesDialog from '@/components/studio/services/EditPricesDialog';
import AddItemDialog from '@/components/studio/services/AddItemDialog';

const StudioServices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Load studio services
  const { studioData, setStudioData, loading } = useStudioServicesLoader(id);
  
  // State for price editing dialog
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [editingPriceData, setEditingPriceData] = useState<{
    serviceIndex: number;
    subServiceIndex: number;
    priceData: any;
  } | null>(null);
  
  // State for add item dialog
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [addItemServiceIndex, setAddItemServiceIndex] = useState<number | null>(null);
  const [addItemSubServiceIndex, setAddItemSubServiceIndex] = useState<number | null>(null);

  // Hook with all the service management logic
  const {
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
    handleConfirmDelete
  } = useStudioServicesManager(id, studioData);

  const getEditDialogTitle = () => {
    switch (editType) {
      case 'subservice':
        return 'Edit Sub-service';
      case 'clothingitem':
        return 'Edit Clothing Item';
      default:
        return 'Edit Service';
    }
  };
  
  const handleEditPrices = (serviceIndex: number, subServiceIndex: number) => {
    if (!studioData || !studioData.studioServices) return;
    
    const service = studioData.studioServices[serviceIndex];
    const subService = service.subServices[subServiceIndex];
    
    setEditingPriceData({
      serviceIndex,
      subServiceIndex,
      priceData: {
        standardPricePerKg: subService.standardPricePerKg || '',
        expressPricePerKg: subService.expressPricePerKg || '',
        standardPricePerItem: subService.standardPricePerItem || '',
        expressPricePerItem: subService.expressPricePerItem || '',
      }
    });
    
    setPriceDialogOpen(true);
  };
  
  const handleSavePrices = (priceData: any) => {
    if (!editingPriceData || !studioData || !studioData.studioServices) return;
    
    const { serviceIndex, subServiceIndex } = editingPriceData;
    const updatedServices = [...studioData.studioServices];
    const subService = updatedServices[serviceIndex].subServices[subServiceIndex];
    
    // Update the subservice with new price data
    updatedServices[serviceIndex].subServices[subServiceIndex] = {
      ...subService,
      standardPricePerKg: priceData.standardPricePerKg,
      expressPricePerKg: priceData.expressPricePerKg,
      standardPricePerItem: priceData.standardPricePerItem,
      expressPricePerItem: priceData.expressPricePerItem,
    };
    
    setStudioData({
      ...studioData,
      studioServices: updatedServices
    });
    
    // Save to localStorage
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
        console.error("Error saving price data:", error);
      }
    }
    
    setPriceDialogOpen(false);
    setEditingPriceData(null);
  };
  
  const handleAddItem = (serviceIndex: number, subServiceIndex: number) => {
    setAddItemServiceIndex(serviceIndex);
    setAddItemSubServiceIndex(subServiceIndex);
    setAddItemDialogOpen(true);
  };
  
  const handleSaveNewItem = (newItem: any) => {
    if (addItemServiceIndex === null || addItemSubServiceIndex === null || !studioData) return;
    
    const updatedServices = [...studioData.studioServices];
    const subService = updatedServices[addItemServiceIndex].subServices[addItemSubServiceIndex];
    
    // Make sure selectedItems array exists
    if (!subService.selectedItems) {
      subService.selectedItems = [];
    }
    
    // Make sure item prices objects exist
    if (!subService.standardItemPrices) {
      subService.standardItemPrices = {};
    }
    
    if (!subService.expressItemPrices) {
      subService.expressItemPrices = {};
    }
    
    // Add the new item
    subService.selectedItems.push(newItem.id);
    subService.standardItemPrices[newItem.id] = newItem.standardPrice;
    subService.expressItemPrices[newItem.id] = newItem.expressPrice;
    
    // Initialize item status to active
    if (!subService.clothingItemsStatus) {
      subService.clothingItemsStatus = {};
    }
    subService.clothingItemsStatus[newItem.id] = true;
    
    // Update state
    setStudioData({
      ...studioData,
      studioServices: updatedServices
    });
    
    // Save to localStorage
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
        console.error("Error saving new item:", error);
      }
    }
    
    // Close dialog
    setAddItemDialogOpen(false);
    setAddItemServiceIndex(null);
    setAddItemSubServiceIndex(null);
  };

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        {/* Header */}
        <StudioServicesHeader 
          studioName={studioData?.studioName || ''} 
          studioId={id || ''} 
          loading={loading} 
        />

        {/* Content */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
            Loading...
          </div>
        ) : studioData && studioData.studioServices && studioData.studioServices.length > 0 ? (
          <ServiceManagement
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
            onEditPrices={handleEditPrices}
            onAddItem={handleAddItem}
          />
        ) : (
          <EmptyServicesState />
        )}
      </div>

      {/* Edit Dialog */}
      <EditServiceDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title={getEditDialogTitle()}
        value={editValue}
        onChange={setEditValue}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        itemType={deleteType}
        onDelete={handleConfirmDelete}
      />
      
      {/* Edit Prices Dialog */}
      {editingPriceData && (
        <EditPricesDialog
          isOpen={priceDialogOpen}
          onOpenChange={setPriceDialogOpen}
          priceData={editingPriceData.priceData}
          onSave={handleSavePrices}
        />
      )}
      
      {/* Add Item Dialog */}
      <AddItemDialog
        isOpen={addItemDialogOpen}
        onOpenChange={setAddItemDialogOpen}
        onSave={handleSaveNewItem}
      />
    </Layout>
  );
};

export default StudioServices;
