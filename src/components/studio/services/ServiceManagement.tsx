
import React, { useState } from 'react';
import { StudioService } from '@/types/services';
import { Button } from '@/components/ui/button';
import { Plus, WashingMachine } from 'lucide-react';
import ServiceItem from './ServiceItem';

interface ServiceManagementProps {
  studioServices: StudioService[];
  onServiceStatusChange: (serviceIndex: number) => void;
  onSubServiceStatusChange: (serviceIndex: number, subServiceIndex: number, active: boolean) => void;
  onClothingItemStatusChange: (serviceIndex: number, subServiceIndex: number, itemId: string, active: boolean) => void;
  onServiceEdit: (serviceIndex: number) => void;
  onServiceDelete: (serviceIndex: number) => void;
  onSubServiceEdit: (serviceIndex: number, subServiceIndex: number) => void;
  onSubServiceDelete: (serviceIndex: number, subServiceIndex: number) => void;
  onClothingItemEdit: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onClothingItemDelete: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onEditPrices: (serviceIndex: number, subServiceIndex: number) => void;
  onAddItem: (serviceIndex: number, subServiceIndex: number) => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  studioServices,
  onServiceStatusChange,
  onSubServiceStatusChange,
  onClothingItemStatusChange,
  onServiceEdit,
  onServiceDelete,
  onSubServiceEdit,
  onSubServiceDelete,
  onClothingItemEdit,
  onClothingItemDelete,
  onEditPrices,
  onAddItem
}) => {
  const [expandedServices, setExpandedServices] = useState<{[key: string]: boolean}>({});
  const [expandedSubServices, setExpandedSubServices] = useState<{[key: string]: boolean}>({});

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const toggleSubServiceExpansion = (subServiceKey: string) => {
    setExpandedSubServices(prev => ({
      ...prev,
      [subServiceKey]: !prev[subServiceKey]
    }));
  };

  console.log("Rendering ServiceManagement with services:", studioServices);

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
          <p className="text-gray-600 mt-1">Manage your services, subservices, and item details</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 px-6"
          onClick={() => onServiceEdit(-1)} // -1 indicates new service
        >
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="space-y-4">
        {studioServices && studioServices.length > 0 ? (
          studioServices.map((service, serviceIndex) => {
            const isServiceExpanded = expandedServices[service.id] || false;
            
            return (
              <ServiceItem
                key={service.id || serviceIndex}
                service={service}
                serviceIndex={serviceIndex}
                isExpanded={isServiceExpanded}
                onToggleExpansion={() => toggleServiceExpansion(service.id)}
                onServiceStatusChange={onServiceStatusChange}
                onServiceEdit={onServiceEdit}
                onServiceDelete={onServiceDelete}
                onSubServiceEdit={onSubServiceEdit}
                onSubServiceDelete={onSubServiceDelete}
                onSubServiceStatusChange={onSubServiceStatusChange}
                onClothingItemStatusChange={onClothingItemStatusChange}
                onClothingItemEdit={onClothingItemEdit}
                onClothingItemDelete={onClothingItemDelete}
                onEditPrices={onEditPrices}
                onAddItem={onAddItem}
                expandedSubServices={expandedSubServices}
                toggleSubServiceExpansion={toggleSubServiceExpansion}
              />
            );
          })
        ) : (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
            <WashingMachine size={48} className="text-gray-400 mb-3" />
            <p className="text-gray-700 text-lg font-medium mb-1">No services added yet</p>
            <p className="text-gray-500 mb-4">Click "Add Service" to create your first laundry service</p>
            <Button 
              onClick={() => onServiceEdit(-1)}
              variant="default"
              className="flex items-center gap-1"
            >
              <Plus size={16} /> Add Service
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
