
import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import TabNavigation from '../components/services/TabNavigation';
import ServicesList from '../components/services/ServicesList';
import SubServicesList from '../components/services/SubServicesList';
import ClothingItemsList from '../components/services/ClothingItemsList';
import ServicesHeader from '../components/services/ServicesHeader';
import AddItemDialog from '../components/services/AddItemDialog';
import EditItemDialog from '../components/services/EditItemDialog';
import { useServicesData } from '../hooks/useServicesData';
import { useServicesTabs } from '../hooks/useServicesTabs';
import { useServicesDialogs } from '../hooks/useServicesDialogs';
import { useToast } from '@/hooks/use-toast';
import MultiSelect from '@/components/ui/multi-select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const Services: React.FC = () => {
  const { toast } = useToast();
  
  // Use custom hooks to separate concerns
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
    // Multi-select related imports
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

  // Show welcome toast on first load
  useEffect(() => {
    toast({
      title: "Services Loaded",
      description: "Your services data is ready. Any changes will be automatically saved."
    });
  }, []);

  const tabInfo = getTabInfo();

  // Convert services, subServices, and clothingItems to options format for MultiSelect
  const subServiceOptions = subServices
    .filter(subService => subService.active)
    .map(subService => ({
      value: subService.id,
      label: subService.name
    }));

  const clothingItemOptions = clothingItems
    .filter(item => item.active)
    .map(item => ({
      value: item.id,
      label: item.name
    }));

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
            <ServicesList 
              services={services} 
              onEdit={handleEditClick}
              onStatusChange={handleServiceStatusChange}
              onDelete={handleServiceDelete}
              searchTerm={searchTerm} 
            />
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
