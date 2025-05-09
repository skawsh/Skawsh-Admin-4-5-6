
import React from 'react';
import { StudioService } from '@/types/services';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, Package } from 'lucide-react';
import SubServiceItem from './SubServiceItem';
import { Badge } from '@/components/ui/badge';

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

  const countActiveSubServices = (service: StudioService) => {
    return service.subServices.filter(s => s.active !== false).length;
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 shadow-sm">
      {/* Service Header */}
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors bg-white"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center gap-2">
          <Package size={20} className="text-blue-600" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <Badge variant={service.active ? "success" : "secondary"}>
                {service.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex gap-2 mt-1">
              <span className="text-sm text-gray-500">{countSubServices(service)} subservices</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{countActiveSubServices(service)} active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isExpanded ? 
            <ChevronUp size={20} className="text-gray-600 mr-2" /> : 
            <ChevronDown size={20} className="text-gray-600 mr-2" />
          }
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active</span>
            <Switch 
              checked={service.active}
              onCheckedChange={(checked) => {
                onServiceStatusChange(serviceIndex);
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onServiceEdit(serviceIndex);
            }}
          >
            <Edit size={18} className="text-gray-600" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onServiceDelete(serviceIndex);
            }}
          >
            <Trash2 size={18} className="text-red-500" />
          </Button>
        </div>
      </div>

      {/* Service Content (shown when expanded) */}
      {isExpanded && (
        <div className="px-6 py-4 border-t bg-gray-100">
          {/* Subservices Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Subservices</h4>
              <Button 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation(); 
                  onSubServiceEdit(serviceIndex, -1);
                }}
                className="flex items-center gap-1 text-blue-600 border-blue-600"
              >
                <Plus size={16} /> Add Subservice
              </Button>
            </div>

            {/* Subservices List */}
            <div className="space-y-4">
              {service.subServices.length > 0 ? (
                service.subServices.map((subService, subServiceIndex) => {
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
                })
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No subservices added yet. Click "Add Subservice" to create one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItem;
