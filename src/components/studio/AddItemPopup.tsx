
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from 'lucide-react';
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
  // State to manage multiple items
  const [itemRows, setItemRows] = useState<Array<{id: string, price: string}>>([
    { id: "", price: "" }
  ]);
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setItemRows([{ id: "", price: "" }]);
    }
  }, [isOpen]);

  // Add a new empty row
  const addNewRow = () => {
    setItemRows([...itemRows, { id: "", price: "" }]);
  };

  // Update item ID in a specific row
  const updateItemId = (index: number, value: string) => {
    const updatedRows = [...itemRows];
    updatedRows[index].id = value;
    setItemRows(updatedRows);
  };

  // Update price in a specific row
  const updateItemPrice = (index: number, value: string) => {
    const updatedRows = [...itemRows];
    updatedRows[index].price = value;
    setItemRows(updatedRows);
  };

  // Remove a specific row
  const removeRow = (index: number) => {
    if (itemRows.length > 1) {
      const updatedRows = itemRows.filter((_, i) => i !== index);
      setItemRows(updatedRows);
    } else {
      // If it's the last row, just clear it
      setItemRows([{ id: "", price: "" }]);
    }
  };

  // Handle save/done
  const handleSave = () => {
    // Filter out incomplete rows and add all valid items
    const validItems = itemRows.filter(item => item.id && item.price);
    validItems.forEach(item => {
      onAddItem(item.id, item.price);
    });
    
    // Close popup
    onOpenChange(false);
  };

  // Get all selected items (both already selected and currently in rows)
  const getAllSelectedItemIds = () => {
    const rowItemIds = itemRows.map(row => row.id).filter(id => id !== "");
    return [...selectedItems, ...rowItemIds];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <h2 className="text-xl font-semibold mb-6">Add Clothing Items</h2>
        
        <div className="space-y-4">
          {itemRows.map((row, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Clothing Item</label>
                  <Select value={row.id} onValueChange={(value) => updateItemId(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {clothingItems
                        .filter(item => 
                          item.active && 
                          (!getAllSelectedItemIds().includes(item.id) || item.id === row.id)
                        )
                        .map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Price (per item)"
                      value={row.price}
                      onChange={(e) => updateItemPrice(index, e.target.value)}
                    />
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
                      onClick={() => removeRow(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            type="button" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={addNewRow}
          >
            <Plus size={16} className="mr-2" /> Add more items
          </Button>
          
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              className="bg-neutral-900 hover:bg-neutral-800"
              onClick={handleSave}
              disabled={!itemRows.some(row => row.id && row.price)}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
