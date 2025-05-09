
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useServicesData } from '@/hooks/useServicesData';

interface ClothingItemTableProps {
  subService: any;
  serviceIndex: number;
  subServiceIndex: number;
  onClothingItemStatusChange: (serviceIndex: number, subServiceIndex: number, itemId: string, active: boolean) => void;
  onClothingItemEdit: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
  onClothingItemDelete: (serviceIndex: number, subServiceIndex: number, itemId: string) => void;
}

const ClothingItemTable: React.FC<ClothingItemTableProps> = ({
  subService,
  serviceIndex,
  subServiceIndex,
  onClothingItemStatusChange,
  onClothingItemEdit,
  onClothingItemDelete
}) => {
  const { clothingItems } = useServicesData();

  const getClothingItemName = (id: string) => {
    const item = clothingItems.find(i => i.id === id);
    return item ? item.name : id;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-4 bg-gray-50 p-2 text-sm font-medium text-gray-600">
        <div className="pl-2">Name</div>
        <div className="text-center">Standard Price</div>
        <div className="text-center">Express Price</div>
        <div className="text-right pr-2">Status</div>
      </div>
      
      {/* Table Body */}
      <div>
        {subService.selectedItems.map((itemId: string) => {
          const isItemActive = subService.clothingItemsStatus?.[itemId] !== false;
          const standardPrice = subService.standardItemPrices?.[itemId] || '0';
          const expressPrice = subService.expressItemPrices?.[itemId] || '0';
          
          return (
            <div key={itemId} className="grid grid-cols-4 p-2 border-t items-center text-sm">
              <div className="pl-2 flex items-center gap-2">
                <span className="font-medium">{getClothingItemName(itemId)}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onClothingItemEdit(serviceIndex, subServiceIndex, itemId)}
                  className="h-6 w-6 text-gray-500 hover:text-blue-600"
                >
                  <Edit size={14} />
                </Button>
              </div>
              <div className="text-center">₹{standardPrice}</div>
              <div className="text-center">₹{expressPrice}</div>
              <div className="flex items-center justify-end gap-2 pr-2">
                <span className="text-sm text-gray-600">Active</span>
                <Switch 
                  checked={isItemActive}
                  onCheckedChange={(checked) => 
                    onClothingItemStatusChange(serviceIndex, subServiceIndex, itemId, checked)
                  } 
                  className="scale-90"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onClothingItemDelete(serviceIndex, subServiceIndex, itemId)}
                  className="h-6 w-6 text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClothingItemTable;
