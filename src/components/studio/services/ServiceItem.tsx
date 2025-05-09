
import React from 'react';
import { StudioService } from '@/types/services';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus } from 'lucide-react';
import SubServiceItem from './SubServiceItem';

interface ServiceItemProps {
  service: StudioService;
  serviceIndex: number;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onServiceStatusChange: (serviceIndex: number) => void;
  onServiceEdit: (serviceIndex: number) => void;
  onServiceDelete: (serviceIndex: number) => void;
  onSubServiceEdit: (serviceIndex: number, subServiceIndex: number) => void;
  onSubServiceDelete: (serviceIndex: number, subServiceIndex: number) => void;
  onSubServiceStatusChange: (serviceIndex: number, subServiceIndex: number, active: boolean) => void;
  onClothingItemStatusChange: (serviceIndex: number, subServiceIndex: number, itemId: string, active: boolean) => void;
  onClothingItemEdit: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onClothingItemDelete: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onEditPrices: (serviceIndex: number, subServiceIndex: number) => void;
  onAddItem: (serviceIndex: number, subServiceIndex: number) => void;
  expandedSubServices: {[key: string]: boolean};
  toggleSubServiceExpansion: (subServiceKey: string) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  serviceIndex,
  isExpanded,
  onToggleExpansion,
  onServiceStatusChange,
  onServiceEdit,
  onServiceDelete,
  onSubServiceEdit,
  onSubServiceDelete,
  onSubServiceStatusChange,
  onClothingItemStatusChange,
  onClothingItemEdit,
  onClothingItemDelete,
  onEditPrices,
  onAddItem,
  expandedSubServices,
  toggleSubServiceExpansion
}) => {
  const countSubServices = (service: StudioService) => {
    return service.subServices.length;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Service Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors" 
        onClick={onToggleExpansion}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? 
            <ChevronDown size={20} className="text-gray-600" /> : 
            <ChevronUp size={20} className="text-gray-600" />
          }
          <div>
            <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
            <p className="text-sm text-gray-500">{countSubServices(service)} subservices</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active</span>
            <Switch 
              checked={service.active}
              onCheckedChange={() => onServiceStatusChange(serviceIndex)} 
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onServiceEdit(serviceIndex);
            }}
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onServiceDelete(serviceIndex);
            }}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      {/* Service Content (shown when expanded) */}
      {isExpanded && (
        <div className="p-4 border-t">
          {/* Subservices Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-800">Subservices</h4>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => onSubServiceEdit(serviceIndex, -1)} // -1 indicates new subservice
                className="flex items-center gap-1 text-sm"
              >
                <Plus size={16} /> Add Subservice
              </Button>
            </div>

            {/* Subservices List */}
            <div className="space-y-4 pl-4">
              {service.subServices.map((subService, subServiceIndex) => {
                const subServiceKey = `${service.id}-${subServiceIndex}`;
                const isSubServiceExpanded = expandedSubServices[subServiceKey] || false;
                
                return (
                  <SubServiceItem
                    key={subServiceKey}
                    serviceId={service.id}
                    subService={subService}
                    subServiceIndex={subServiceIndex}
                    serviceIndex={serviceIndex}
                    isExpanded={isSubServiceExpanded}
                    onToggleExpansion={() => toggleSubServiceExpansion(subServiceKey)}
                    onSubServiceStatusChange={onSubServiceStatusChange}
                    onSubServiceEdit={onSubServiceEdit}
                    onSubServiceDelete={onSubServiceDelete}
                    onClothingItemStatusChange={onClothingItemStatusChange}
                    onClothingItemEdit={onClothingItemEdit}
                    onClothingItemDelete={onClothingItemDelete}
                    onEditPrices={onEditPrices}
                    onAddItem={onAddItem}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItem;
