
import React from 'react';
import { Shirt, Pencil, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface ClothingItem {
  id: string;
  name: string;
  active: boolean;
}

interface ClothingItemsListProps {
  clothingItems: ClothingItem[];
  onEdit: (clothingItem: ClothingItem) => void;
  searchTerm: string;
}

const ClothingItemsList: React.FC<ClothingItemsListProps> = ({ clothingItems, onEdit, searchTerm }) => {
  const filteredClothingItems = clothingItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleClothingItemStatus = (id: string) => {
    const updatedClothingItems = clothingItems.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    );
    
    try {
      localStorage.setItem('clothingItems', JSON.stringify(updatedClothingItems));
      
      const item = clothingItems.find(i => i.id === id);
      const newStatus = item ? !item.active : false;
      
      toast({
        title: "Status Updated",
        description: `Clothing item ${newStatus ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update clothing item status"
      });
    }
  };
  
  const deleteClothingItem = (id: string) => {
    const updatedClothingItems = clothingItems.filter(item => item.id !== id);
    
    try {
      localStorage.setItem('clothingItems', JSON.stringify(updatedClothingItems));
      
      toast({
        title: "Clothing Item Deleted",
        description: "Clothing item removed successfully"
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete clothing item"
      });
    }
  };

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
                onCheckedChange={() => toggleClothingItemStatus(item.id)} 
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
                onClick={() => deleteClothingItem(item.id)} 
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
