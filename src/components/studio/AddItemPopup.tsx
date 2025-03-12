
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
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItemId("");
      setItemPrice("");
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (selectedItemId && itemPrice) {
      onAddItem(selectedItemId, itemPrice);
      onOpenChange(false);
    }
  };

  // Filter out already selected items
  const availableItems = clothingItems.filter(
    item => item.active && !selectedItems.includes(item.id)
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
          
          <div className="flex justify-between">
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAdd}
            >
              Add Category
            </Button>
            
            <Button
              type="button"
              variant="destructive"
              onClick={() => onOpenChange(false)}
            >
              Remove
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
