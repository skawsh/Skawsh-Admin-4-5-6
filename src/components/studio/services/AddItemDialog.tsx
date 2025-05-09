
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServicesData } from '@/hooks/useServicesData';

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newItem: any) => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave
}) => {
  const { clothingItems } = useServicesData();
  const [selectedItem, setSelectedItem] = useState('');
  const [standardPrice, setStandardPrice] = useState('');
  const [expressPrice, setExpressPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!selectedItem) {
      setError('Please select an item');
      return;
    }

    // Validate prices are numbers
    const stdPrice = standardPrice || '0';
    const expPrice = expressPrice || '0';

    onSave({
      id: selectedItem,
      standardPrice: stdPrice,
      expressPrice: expPrice
    });

    // Reset form
    setSelectedItem('');
    setStandardPrice('');
    setExpressPrice('');
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-2 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="item">Select Item</Label>
            <Select 
              value={selectedItem} 
              onValueChange={setSelectedItem}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an item" />
              </SelectTrigger>
              <SelectContent>
                {clothingItems
                  .filter(item => item.active)
                  .map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standard-price">Standard Price</Label>
              <Input
                id="standard-price"
                type="number"
                placeholder="0"
                value={standardPrice}
                onChange={(e) => setStandardPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="express-price">Express Price</Label>
              <Input
                id="express-price"
                type="number"
                placeholder="0"
                value={expressPrice}
                onChange={(e) => setExpressPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
