
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClothingItem } from '@/types/services';

interface AddItemPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clothingItems: ClothingItem[];
  selectedItems: string[];
  onAddItem: (itemId: string, price: string) => void;
}

const AddItemPopup: React.FC<AddItemPopupProps> = ({
  isOpen,
  onOpenChange,
  clothingItems,
  selectedItems,
  onAddItem,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");
  const [tempItems, setTempItems] = useState<Array<{id: string, price: string}>>([]);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItemId("");
      setItemPrice("");
      setTempItems([]);
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (selectedItemId && itemPrice) {
      // Add to temporary items array
      setTempItems(prev => [...prev, {id: selectedItemId, price: itemPrice}]);
      
      // Reset form fields for next item
      setSelectedItemId("");
      setItemPrice("");
    }
  };
  
  const handleSave = () => {
    // Add all temp items to parent component
    tempItems.forEach(item => {
      onAddItem(item.id, item.price);
    });
    
    // Close popup
    onOpenChange(false);
  };

  // Filter out already selected items and items already in temp list
  const availableItems = clothingItems.filter(
    item => item.active && 
    !selectedItems.includes(item.id) &&
    !tempItems.some(temp => temp.id === item.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clothing-item" className="font-medium">Clothing Item</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger id="clothing-item">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-price" className="font-medium">Price</Label>
              <Input
                id="item-price"
                type="number"
                placeholder="Price"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
            </div>
          </div>
          
          {/* Show list of temporarily added items */}
          {tempItems.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Selected Items:</h4>
              <div className="space-y-1">
                {tempItems.map((item, index) => {
                  const clothingItem = clothingItems.find(ci => ci.id === item.id);
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{clothingItem?.name}</span>
                      <span>₹{item.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAdd}
              disabled={!selectedItemId || !itemPrice}
            >
              Add More Items
            </Button>
            
            <div className="space-x-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => onOpenChange(false)}
              >
                Remove
              </Button>
              
              <Button
                type="button"
                onClick={handleSave}
                disabled={tempItems.length === 0}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
