
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
  onAddItem: (itemId: string, standardPrice: string, expressPrice: string) => void;
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
  const [itemRows, setItemRows] = useState<Array<{ itemId: string, standardPrice: string, expressPrice: string }>>([
    { itemId: '', standardPrice: '', expressPrice: '' }
  ]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setItemRows([{ itemId: '', standardPrice: '', expressPrice: '' }]);
    }
  }, [isOpen]);

  const handleItemChange = (index: number, itemId: string) => {
    const newRows = [...itemRows];
    newRows[index].itemId = itemId;
    setItemRows(newRows);
  };

  const handlePriceChange = (index: number, value: string, priceType: 'standard' | 'express') => {
    const newRows = [...itemRows];
    if (priceType === 'express') {
      newRows[index].expressPrice = value;
    } else {
      newRows[index].standardPrice = value;
    }
    setItemRows(newRows);
  };

  const handleAddRow = () => {
    setItemRows([...itemRows, { itemId: '', standardPrice: '', expressPrice: '' }]);
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
      if (row.itemId && (row.standardPrice || row.expressPrice)) {
        // Always pass both prices to the parent component
        onAddItem(
          row.itemId, 
          row.standardPrice || '0', 
          row.expressPrice || '0'
        );
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
      <DialogContent className="max-w-md rounded-xl shadow-lg border-0">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-800">Add Clothing Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-5">
          {itemRows.map((row, index) => (
            <div key={index} className="relative bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
              <div className="space-y-4">
                {/* Position the remove button outside and to the right of the dropdown */}
                <div className="flex items-start mb-2">
                  <div className="flex-grow">
                    <Select value={row.itemId} onValueChange={(value) => handleItemChange(index, value)}>
                      <SelectTrigger className="w-full rounded-md border-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors">
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveRow(index)}
                    className="ml-2 h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {(washCategory === 'standard' || washCategory === 'both') && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded mr-2">Standard</span>
                      </Label>
                      <Input
                        type="number"
                        value={row.standardPrice}
                        onChange={(e) => handlePriceChange(index, e.target.value, 'standard')}
                        placeholder="Price"
                        className="rounded-md border-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}
                  
                  {(washCategory === 'express' || washCategory === 'both') && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center">
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded mr-2">Express</span>
                      </Label>
                      <Input
                        type="number"
                        value={row.expressPrice}
                        onChange={(e) => handlePriceChange(index, e.target.value, 'express')}
                        placeholder="Price"
                        className="rounded-md border-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            className="w-full py-5 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 text-gray-600 hover:text-gray-800 transition-all" 
            onClick={handleAddRow}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Items
          </Button>
        </div>
        
        <DialogFooter className="border-t pt-4 flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="rounded-md bg-white text-gray-700 hover:bg-gray-100 border-gray-300 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDone}
            className="rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
