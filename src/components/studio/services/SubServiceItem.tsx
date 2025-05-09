
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus } from 'lucide-react';
import { useServicesData } from '@/hooks/useServicesData';
import ClothingItemTable from './ClothingItemTable';

interface SubServiceItemProps {
  serviceId: string;
  subService: any;
  subServiceIndex: number;
  serviceIndex: number;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onSubServiceStatusChange: (serviceIndex: number, subServiceIndex: number, active: boolean) => void;
  onSubServiceEdit: (serviceIndex: number, subServiceIndex: number) => void;
  onSubServiceDelete: (serviceIndex: number, subServiceIndex: number) => void;
  onClothingItemStatusChange: (serviceIndex: number, subServiceIndex: number, itemId: string, active: boolean) => void;
  onClothingItemEdit: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onClothingItemDelete: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onEditPrices: (serviceIndex: number, subServiceIndex: number) => void;
  onAddItem: (serviceIndex: number, subServiceIndex: number) => void;
}

const SubServiceItem: React.FC<SubServiceItemProps> = ({
  serviceId,
  subService,
  subServiceIndex,
  serviceIndex,
  isExpanded,
  onToggleExpansion,
  onSubServiceStatusChange,
  onSubServiceEdit,
  onSubServiceDelete,
  onClothingItemStatusChange,
  onClothingItemEdit,
  onClothingItemDelete,
  onEditPrices,
  onAddItem
}) => {
  const { subServices: allSubServices } = useServicesData();
  
  const getSubServiceName = (id: string) => {
    const subService = allSubServices.find(s => s.id === id);
    return subService ? subService.name : id;
  };

  const countItems = () => {
    return subService.selectedItems?.length || 0;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Subservice Header */}
      <div 
        className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? 
            <ChevronDown size={18} className="text-gray-600" /> : 
            <ChevronUp size={18} className="text-gray-600" />
          }
          <div>
            <h5 className="font-medium">{getSubServiceName(subService.name)}</h5>
            <p className="text-xs text-gray-500">{countItems()} items</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active</span>
            <Switch 
              checked={subService.active !== false}
              onCheckedChange={(checked) => onSubServiceStatusChange(serviceIndex, subServiceIndex, checked)}
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onSubServiceEdit(serviceIndex, subServiceIndex);
            }}
            className="h-8 w-8"
          >
            <Edit size={16} className="text-gray-600" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onSubServiceDelete(serviceIndex, subServiceIndex);
            }}
            className="h-8 w-8"
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
        </div>
      </div>

      {/* Subservice Content (shown when expanded) */}
      {isExpanded && (
        <div className="p-5 border-t">
          {/* Pricing Information */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h6 className="font-medium">Pricing Information</h6>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => onEditPrices(serviceIndex, subServiceIndex)}
                className="flex items-center gap-1"
              >
                <Edit size={14} /> Edit Prices
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-gray-700">Standard Price per KG: 
                  <span className="font-medium ml-1">
                    ₹{subService.standardPricePerKg || '0'}
                  </span>
                </p>
                <p className="text-gray-700">Express Price per KG: 
                  <span className="font-medium ml-1">
                    ₹{subService.expressPricePerKg || '0'}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">Standard Price per Item: 
                  <span className="font-medium ml-1">
                    ₹{subService.standardPricePerItem || '0'}
                  </span>
                </p>
                <p className="text-gray-700">Express Price per Item: 
                  <span className="font-medium ml-1">
                    ₹{subService.expressPricePerItem || '0'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Items Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h6 className="font-medium">Items</h6>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => onAddItem(serviceIndex, subServiceIndex)}
                className="flex items-center gap-1 text-blue-600"
              >
                <Plus size={14} /> Add Item
              </Button>
            </div>
            
            {/* Items Table */}
            {subService.selectedItems && subService.selectedItems.length > 0 ? (
              <ClothingItemTable 
                subService={subService}
                serviceIndex={serviceIndex}
                subServiceIndex={subServiceIndex}
                onClothingItemStatusChange={onClothingItemStatusChange}
                onClothingItemEdit={onClothingItemEdit}
                onClothingItemDelete={onClothingItemDelete}
              />
            ) : (
              <div className="border rounded-lg p-4 text-center text-gray-500">
                No items added yet. Click "Add Item" to add some.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubServiceItem;
