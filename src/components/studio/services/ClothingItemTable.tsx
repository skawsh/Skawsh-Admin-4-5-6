
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useServicesData } from '@/hooks/useServicesData';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Standard Price</TableHead>
          <TableHead className="text-center">Express Price</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subService.selectedItems.map((itemId: string) => {
          const isItemActive = subService.clothingItemsStatus?.[itemId] !== false;
          const standardPrice = subService.standardItemPrices?.[itemId] || '0';
          const expressPrice = subService.expressItemPrices?.[itemId] || '0';
          
          return (
            <TableRow key={itemId}>
              <TableCell className="flex items-center gap-2 font-medium">
                {getClothingItemName(itemId)}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onClothingItemEdit(serviceIndex, subServiceIndex, itemId)}
                  className="h-6 w-6 ml-2"
                >
                  <Edit size={14} />
                </Button>
              </TableCell>
              <TableCell className="text-center">₹{standardPrice}</TableCell>
              <TableCell className="text-center">₹{expressPrice}</TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                <span className="text-sm text-gray-600">Active</span>
                <Switch 
                  checked={isItemActive}
                  onCheckedChange={(checked) => 
                    onClothingItemStatusChange(serviceIndex, subServiceIndex, itemId, checked)
                  }
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onClothingItemDelete(serviceIndex, subServiceIndex, itemId)}
                  className="h-6 w-6 ml-2"
                >
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ClothingItemTable;
