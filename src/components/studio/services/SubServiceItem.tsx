
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, Tags } from 'lucide-react';
import { useServicesData } from '@/hooks/useServicesData';
import ClothingItemTable from './ClothingItemTable';
import { Badge } from '@/components/ui/badge';

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
          <div className="flex items-center gap-2">
            <h5 className="font-medium">{getSubServiceName(subService.name)}</h5>
            <Badge variant={subService.active !== false ? "success" : "secondary"} className="ml-1">
              {subService.active !== false ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {countItems()} {countItems() === 1 ? 'item' : 'items'}
            </Badge>
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
        <div className="p-5 border-t bg-gray-50">
          {/* Pricing Information */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Tags size={16} className="text-blue-600" />
                <h6 className="font-medium">Pricing Information</h6>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPrices(serviceIndex, subServiceIndex);
                }}
                className="flex items-center gap-1"
              >
                <Edit size={14} /> Edit Prices
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-700">Standard Price per KG:</span>
                  <span className="font-medium">
                    ₹{subService.standardPricePerKg || '0'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-700">Express Price per KG:</span>
                  <span className="font-medium">
                    ₹{subService.expressPricePerKg || '0'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-700">Standard Price per Item:</span>
                  <span className="font-medium">
                    ₹{subService.standardPricePerItem || '0'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-700">Express Price per Item:</span>
                  <span className="font-medium">
                    ₹{subService.expressPricePerItem || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Items Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-3">
              <h6 className="font-medium">Items</h6>
              <Button 
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddItem(serviceIndex, subServiceIndex);
                }}
                className="flex items-center gap-1 text-blue-600 border-blue-600"
              >
                <Plus size={14} /> Add Item
              </Button>
            </div>
            
            {/* Items Table */}
            <ClothingItemTable 
              subService={subService}
              serviceIndex={serviceIndex}
              subServiceIndex={subServiceIndex}
              onClothingItemStatusChange={onClothingItemStatusChange}
              onClothingItemEdit={onClothingItemEdit}
              onClothingItemDelete={onClothingItemDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubServiceItem;
