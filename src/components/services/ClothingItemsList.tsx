
import React from 'react';
import { Shirt, Pencil, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { ClothingItem } from '@/types/services';

interface ClothingItemsListProps {
  clothingItems: ClothingItem[];
  onEdit: (clothingItem: ClothingItem) => void;
  onStatusChange: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
}

const ClothingItemsList: React.FC<ClothingItemsListProps> = ({ 
  clothingItems, 
  onEdit, 
  onStatusChange,
  onDelete,
  searchTerm 
}) => {
  const filteredClothingItems = clothingItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {filteredClothingItems.length > 0 ? (
        filteredClothingItems.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2">
                <Shirt className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900">{item.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <Switch 
                checked={item.active} 
                onCheckedChange={(checked) => onStatusChange(item.id, checked)} 
                className="data-[state=checked]:bg-green-500"
              />
              <button 
                onClick={() => onEdit(item)}
                className="text-gray-500 hover:text-blue-500 transition-colors"
                aria-label="Edit clothing item"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(item.id)} 
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Delete clothing item"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-600">
            {searchTerm 
              ? "No clothing items found. Try adjusting your search." 
              : "No clothing items found. Add a clothing item to get started."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClothingItemsList;
