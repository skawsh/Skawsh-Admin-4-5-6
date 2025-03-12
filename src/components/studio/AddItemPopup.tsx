
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClothingItem } from '@/types/services';
import { Check, Search } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

interface AddItemPopupProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clothingItems: ClothingItem[];
  selectedItems: string[];
  onAddItem: (itemId: string, standardPrice: string, expressPrice: string) => void;
  washCategory: 'standard' | 'express' | 'both';
}

const AddItemPopup: React.FC<AddItemPopupProps> = ({
  isOpen,
  onOpenChange,
  clothingItems,
  selectedItems,
  onAddItem,
  washCategory
}) => {
  const [standardPrice, setStandardPrice] = useState<string>('');
  const [expressPrice, setExpressPrice] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  
  const availableItems = clothingItems.filter(item => !selectedItems.includes(item.id));
  
  const filteredItems = availableItems.filter(item => 
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setStandardPrice('');
    setExpressPrice('');
  };

  const handleAddItem = () => {
    if (selectedItemId) {
      onAddItem(selectedItemId, standardPrice, expressPrice);
      setSelectedItemId(null);
      setStandardPrice('');
      setExpressPrice('');
      setSearchValue("");
      onOpenChange(false);
    }
  };

  const renderPriceInputs = () => {
    if (washCategory === 'standard') {
      return (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <Input
            type="number"
            value={standardPrice}
            onChange={(e) => setStandardPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full"
          />
        </div>
      );
    } else if (washCategory === 'express') {
      return (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <Input
            type="number"
            value={expressPrice}
            onChange={(e) => setExpressPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full"
          />
        </div>
      );
    } else {
      return (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Standard Price</label>
            <Input
              type="number"
              value={standardPrice}
              onChange={(e) => setStandardPrice(e.target.value)}
              placeholder="Enter standard price"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Express Price</label>
            <Input
              type="number"
              value={expressPrice}
              onChange={(e) => setExpressPrice(e.target.value)}
              placeholder="Enter express price"
              className="w-full"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Clothing Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select an Item</label>
            
            <Command className="rounded-lg border shadow-md">
              <CommandInput 
                placeholder="Search items..." 
                value={searchValue}
                onValueChange={setSearchValue}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No items found</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[200px]">
                    {filteredItems.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => handleSelectItem(item.id)}
                        className={`flex items-center space-x-2 p-2 cursor-pointer ${selectedItemId === item.id ? 'bg-blue-50' : ''}`}
                      >
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${selectedItemId === item.id ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                          {selectedItemId === item.id && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span>{item.name}</span>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
          
          {selectedItemId && renderPriceInputs()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddItem} 
            disabled={!selectedItemId}
            className={!selectedItemId ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Add Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemPopup;
