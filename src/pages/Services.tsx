
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import TabNavigation from '../components/services/TabNavigation';
import ServicesList from '../components/services/ServicesList';
import SubServicesList from '../components/services/SubServicesList';
import ClothingItemsList from '../components/services/ClothingItemsList';
import ServicesHeader from '../components/services/ServicesHeader';
import AddItemDialog from '../components/services/AddItemDialog';
import EditItemDialog from '../components/services/EditItemDialog';
import ServicesCard from '@/components/studio/details/ServicesCard';
import { useServicesData } from '../hooks/useServicesData';
import { useServicesTabs } from '../hooks/useServicesTabs';
import { useServicesDialogs } from '../hooks/useServicesDialogs';
import { useToast } from '@/hooks/use-toast';
import { StudioService } from '@/types/services';

const Services: React.FC = () => {
  const { toast } = useToast();
  
  const { 
    activeTab, 
    searchTerm, 
    setSearchTerm, 
    handleTabChange, 
    clearSearch, 
    getTabInfo 
  } = useServicesTabs();

  const {
    services,
    subServices,
    clothingItems,
    addService,
    addSubService,
    addClothingItem,
    updateServiceItem,
    handleServiceStatusChange,
    handleServiceDelete,
    handleSubServiceStatusChange,
    handleSubServiceDelete,
    handleClothingItemStatusChange,
    handleClothingItemDelete
  } = useServicesData();

  const {
    isAddServiceOpen,
    setIsAddServiceOpen,
    isAddSubServiceOpen,
    setIsAddSubServiceOpen,
    isAddClothingItemOpen,
    setIsAddClothingItemOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
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
    selectedSubServices,
    handleSelectSubService,
    selectedClothingItems,
    handleSelectClothingItem,
    clothingItemPrices,
    handleClothingItemPriceChange,
    resetMultiSelects
  } = useServicesDialogs(
    activeTab,
    addService,
    addSubService,
    addClothingItem,
    updateServiceItem
  );

  const [studioServices, setStudioServices] = useState<StudioService[]>([]);

  useEffect(() => {
    const loadStudioServices = () => {
      const savedStudios = localStorage.getItem('laundryStudios');
      if (savedStudios) {
        const studios = JSON.parse(savedStudios);
        const allStudioServices = studios
          .filter((studio: any) => studio.studioServices)
          .flatMap((studio: any) => studio.studioServices);
        setStudioServices(allStudioServices);
      }
    };

    loadStudioServices();
  }, []);

  const handleStudioServiceStatusChange = (serviceIndex: number) => {
    if (studioServices) {
      const updatedServices = [...studioServices];
      updatedServices[serviceIndex].active = !updatedServices[serviceIndex].active;
      setStudioServices(updatedServices);
      
      const savedStudios = localStorage.getItem('laundryStudios');
      if (savedStudios) {
        const studios = JSON.parse(savedStudios);
        studios.forEach((studio: any) => {
          if (studio.studioServices) {
            studio.studioServices = studio.studioServices.map((service: StudioService) => {
              if (service.id === updatedServices[serviceIndex].id) {
                return updatedServices[serviceIndex];
              }
              return service;
            });
          }
        });
        localStorage.setItem('laundryStudios', JSON.stringify(studios));
      }
    }
  };

  const tabInfo = getTabInfo();

  return (
    <Layout activeSection="services">
      <div className="space-y-6">
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
        <ServicesHeader 
          activeTab={activeTab}
          title={tabInfo.title}
          description={tabInfo.description}
          searchPlaceholder={tabInfo.searchPlaceholder}
          addButtonText={tabInfo.addButtonText}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={clearSearch}
          onAddButtonClick={handleAddButtonClick}
        />
        <div className="bg-white p-8 min-h-[300px] rounded-lg border border-gray-100 shadow-sm">
          {activeTab === 'services' && (
            <>
              <ServicesList 
                services={services} 
                onEdit={handleEditClick}
                onStatusChange={handleServiceStatusChange}
                onDelete={handleServiceDelete}
                searchTerm={searchTerm} 
              />
              {studioServices.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h2 className="text-xl font-bold mb-6">Studio Services</h2>
                  <ServicesCard
                    services={studioServices}
                    onServiceStatusChange={handleStudioServiceStatusChange}
                  />
                </div>
              )}
            </>
          )}
          {activeTab === 'sub-services' && (
            <SubServicesList 
              subServices={subServices} 
              onEdit={handleEditClick}
              onStatusChange={handleSubServiceStatusChange}
              onDelete={handleSubServiceDelete}
              searchTerm={searchTerm} 
            />
          )}
          {activeTab === 'clothing-items' && (
            <ClothingItemsList 
              clothingItems={clothingItems} 
              onEdit={handleEditClick}
              onStatusChange={handleClothingItemStatusChange}
              onDelete={handleClothingItemDelete}
              searchTerm={searchTerm} 
            />
          )}
        </div>
        <AddItemDialog 
          isOpen={isAddServiceOpen}
          onOpenChange={(open) => {
            setIsAddServiceOpen(open);
            if (!open) resetMultiSelects();
          }}
          title="Add New Service"
          placeholder="Enter service name"
          value={newServiceName}
          onChange={setNewServiceName}
          onSave={handleAddService}
        />
        <AddItemDialog 
          isOpen={isAddSubServiceOpen}
          onOpenChange={(open) => {
            setIsAddSubServiceOpen(open);
            if (!open) resetMultiSelects();
          }}
          title="Add New Sub-service"
          placeholder="Enter sub-service name"
          value={newSubServiceName}
          onChange={setNewSubServiceName}
          onSave={handleAddSubService}
        />
        <AddItemDialog 
          isOpen={isAddClothingItemOpen}
          onOpenChange={(open) => {
            setIsAddClothingItemOpen(open);
            if (!open) resetMultiSelects();
          }}
          title="Add New Clothing Item"
          placeholder="Enter clothing item name"
          value={newClothingItemName}
          onChange={setNewClothingItemName}
          onSave={handleAddClothingItem}
        />
        <EditItemDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) resetMultiSelects();
          }}
          itemType={activeTab === 'sub-services' ? 'sub-service' : 
                   activeTab === 'clothing-items' ? 'clothing-item' : 'service'}
          value={editItemName}
          onChange={setEditItemName}
          onSave={handleEditSave}
        />
      </div>
    </Layout>
  );
};

export default Services;
