
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StudioServicesDetails from '../components/services/StudioServicesDetails';
import StudioServicesHeader from '../components/studio/services/StudioServicesHeader';
import EmptyServicesState from '../components/studio/services/EmptyServicesState';
import EditServiceDialog from '../components/studio/services/EditServiceDialog';
import DeleteConfirmationDialog from '../components/studio/services/DeleteConfirmationDialog';
import { useStudioServicesLoader } from '@/hooks/useStudioServicesLoader';
import { useStudioServicesManager } from '@/hooks/useStudioServicesManager';

const StudioServices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Load studio services
  const { studioData, setStudioData, loading } = useStudioServicesLoader(id);
  
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
    </Layout>
  );
};

export default StudioServices;
