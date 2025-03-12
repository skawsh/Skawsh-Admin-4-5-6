
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';
import { ClothingItem } from '@/types/services';

interface AddItemPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clothingItems: ClothingItem[];
  selectedItems: string[];
  onAddItem: (itemId: string, standardPrice: string, expressPrice: string) => void;
  washCategory: 'standard' | 'express' | 'both';
  addNewItem?: () => void;
}

const AddItemPopup: React.FC<AddItemPopupProps> = ({
  isOpen,
  onOpenChange,
  clothingItems,
  selectedItems,
  onAddItem,
  washCategory,
  addNewItem
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [standardPrice, setStandardPrice] = useState<string>('');
  const [expressPrice, setExpressPrice] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedItemId('');
    setStandardPrice('');
    setExpressPrice('');
  };

  const handleAddItem = () => {
    if (!selectedItemId) return;
    
    onAddItem(
      selectedItemId,
      standardPrice,
      expressPrice
    );

    resetForm();
  };

  // Filter out already selected items
  const availableItems = clothingItems.filter(item => 
    item.active && !selectedItems.includes(item.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600">Add Clothing Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="space-y-1">
            <Label htmlFor="item-select" className="font-medium text-gray-700">
              Select Item
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  value={selectedItemId}
                  onValueChange={setSelectedItemId}
                >
                  <SelectTrigger id="item-select" className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.length > 0 ? (
                      availableItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-items" disabled>
                        No available items
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {addNewItem && (
                <Button 
                  type="button" 
                  className="h-10 w-10 p-0 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center"
                  onClick={addNewItem}
                  title="Add new clothing item"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          
          {washCategory === 'standard' || washCategory === 'both' ? (
            <div className="space-y-1">
              <Label htmlFor="standard-price" className="font-medium text-gray-700">
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded mr-2">
                  Standard
                </span>
                Price
              </Label>
              <Input
                id="standard-price"
                type="number"
                placeholder="Enter price"
                value={standardPrice}
                onChange={(e) => setStandardPrice(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : null}
          
          {washCategory === 'express' || washCategory === 'both' ? (
            <div className="space-y-1">
              <Label htmlFor="express-price" className="font-medium text-gray-700">
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mr-2">
                  Express
                </span>
                Price
              </Label>
              <Input
                id="express-price"
                type="number"
                placeholder="Enter price"
                value={expressPrice}
                onChange={(e) => setExpressPrice(e.target.value)}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : null}
        </div>
        
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddItem}
            disabled={!selectedItemId}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
