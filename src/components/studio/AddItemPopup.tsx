
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClothingItem } from '@/types/services';
import { Plus, X } from 'lucide-react';

interface AddItemPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clothingItems: ClothingItem[];
  selectedItems: string[];
  onAddItem: (itemId: string, price: string) => void;
  washCategory?: 'standard' | 'express' | 'both';
}

const AddItemPopup: React.FC<AddItemPopupProps> = ({
  isOpen,
  onOpenChange,
  clothingItems,
  selectedItems,
  onAddItem,
  washCategory = 'both'
}) => {
  const [itemRows, setItemRows] = useState<Array<{ itemId: string, price: string, expressPrice?: string }>>([
    { itemId: '', price: '', expressPrice: '' }
  ]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setItemRows([{ itemId: '', price: '', expressPrice: '' }]);
    }
  }, [isOpen]);

  const handleItemChange = (index: number, itemId: string) => {
    const newRows = [...itemRows];
    newRows[index].itemId = itemId;
    setItemRows(newRows);
  };

  const handlePriceChange = (index: number, value: string, priceType: 'standard' | 'express' = 'standard') => {
    const newRows = [...itemRows];
    if (priceType === 'express') {
      newRows[index].expressPrice = value;
    } else {
      newRows[index].price = value;
    }
    setItemRows(newRows);
  };

  const handleAddRow = () => {
    setItemRows([...itemRows, { itemId: '', price: '', expressPrice: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    if (itemRows.length > 1) {
      const newRows = [...itemRows];
      newRows.splice(index, 1);
      setItemRows(newRows);
    }
  };

  const handleDone = () => {
    // Add all valid items
    itemRows.forEach(row => {
      if (row.itemId && (row.price || row.expressPrice)) {
        if (washCategory === 'standard') {
          onAddItem(row.itemId, row.price);
        } else if (washCategory === 'express') {
          onAddItem(row.itemId, row.expressPrice || '');
        } else {
          // For 'both', we'll pass the standard price and the component will handle both prices
          onAddItem(row.itemId, row.price);
        }
      }
    });
    
    onOpenChange(false);
  };

  // Filter out already selected items
  const availableItems = clothingItems.filter(item => 
    item.active && !selectedItems.includes(item.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Clothing Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {itemRows.map((row, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-grow">
                  <Select value={row.itemId} onValueChange={(value) => handleItemChange(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableItems.map(item => (
                        <SelectItem 
                          key={item.id} 
                          value={item.id}
                          disabled={itemRows.some(r => r.itemId === item.id && r.itemId !== row.itemId)}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {washCategory === 'standard' && (
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Standard</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={row.price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        className="h-8"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveRow(index)}
                        className="h-8 w-8 p-0 text-red-500 ml-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {washCategory === 'express' && (
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Express</Label>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={row.expressPrice || ''}
                        onChange={(e) => handlePriceChange(index, e.target.value, 'express')}
                        className="h-8"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveRow(index)}
                        className="h-8 w-8 p-0 text-red-500 ml-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {washCategory === 'both' && (
                  <div className="flex gap-2">
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">Standard</Label>
                      <Input
                        type="number"
                        value={row.price}
                        onChange={(e) => handlePriceChange(index, e.target.value)}
                        placeholder="Price"
                        className="h-8"
                      />
                    </div>
                    <div className="w-24 space-y-1">
                      <Label className="text-xs">Express</Label>
                      <Input
                        type="number"
                        value={row.expressPrice || ''}
                        onChange={(e) => handlePriceChange(index, e.target.value, 'express')}
                        placeholder="Price"
                        className="h-8"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveRow(index)}
                      className="h-8 w-8 p-0 text-red-500 mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={handleAddRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Items
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDone}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
