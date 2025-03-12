
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClothingItem } from '@/types/services';
import { Plus, X, Search } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';

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
  
  // Search state for each row
  const [openDropdowns, setOpenDropdowns] = useState<Record<number, boolean>>({});
  const [searchValues, setSearchValues] = useState<Record<number, string>>({});

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setItemRows([{ itemId: '', standardPrice: '', expressPrice: '' }]);
      setOpenDropdowns({});
      setSearchValues({});
    }
  }, [isOpen]);

  const handleItemChange = (index: number, itemId: string) => {
    const newRows = [...itemRows];
    newRows[index].itemId = itemId;
    setItemRows(newRows);
    
    // Close the dropdown after selection
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const handlePriceChange = (index: number, value: string, priceType: 'standard' | 'express' = 'standard') => {
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
        // Always pass both standard and express prices, component calling this will handle both
        onAddItem(row.itemId, row.standardPrice, row.expressPrice);
      }
    });
    
    onOpenChange(false);
  };

  const toggleDropdown = (index: number, isOpen: boolean) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: isOpen
    }));
  };

  const handleSearch = (index: number, value: string) => {
    setSearchValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  // Filter out already selected items and apply search filter
  const getFilteredItems = (index: number) => {
    const currentSearch = searchValues[index] || '';
    
    return clothingItems.filter(item => 
      // Must be active
      item.active && 
      // Not already selected in other rows
      !itemRows.some((row, idx) => idx !== index && row.itemId === item.id) &&
      // Not already in selectedItems (unless it's the current value for this row)
      (!selectedItems.includes(item.id) || itemRows[index].itemId === item.id) &&
      // Match search term (case insensitive)
      item.name.toLowerCase().includes(currentSearch.toLowerCase())
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl shadow-lg border-0">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-800">Add Clothing Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-5">
          {itemRows.map((row, index) => {
            const filteredItems = getFilteredItems(index);
            
            return (
              <div key={index} className="relative bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                <div className="space-y-4">
                  {/* Position the remove button outside and to the right of the dropdown */}
                  <div className="flex items-start mb-2">
                    <div className="flex-grow">
                      <Popover 
                        open={openDropdowns[index] || false}
                        onOpenChange={(open) => toggleDropdown(index, open)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDropdowns[index] || false}
                            className="w-full justify-between rounded-md border-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            {row.itemId ? clothingItems.find(item => item.id === row.itemId)?.name || "Select item" : "Select item"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search items..." 
                              value={searchValues[index] || ''}
                              onValueChange={(value) => handleSearch(index, value)}
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No items found</CommandEmpty>
                              <CommandGroup>
                                {filteredItems.map(item => (
                                  <CommandItem
                                    key={item.id}
                                    value={item.id}
                                    onSelect={() => handleItemChange(index, item.id)}
                                    className="flex items-center"
                                  >
                                    {item.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
            );
          })}
          
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
