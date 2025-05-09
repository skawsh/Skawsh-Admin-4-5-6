
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface EditPricesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  priceData: {
    standardPricePerKg: string | number;
    expressPricePerKg: string | number;
    standardPricePerItem: string | number;
    expressPricePerItem: string | number;
  };
  onSave: (priceData: any) => void;
}

const EditPricesDialog: React.FC<EditPricesDialogProps> = ({
  isOpen,
  onOpenChange,
  priceData,
  onSave
}) => {
  const [editedPriceData, setEditedPriceData] = useState({
    standardPricePerKg: priceData.standardPricePerKg?.toString() || '',
    expressPricePerKg: priceData.expressPricePerKg?.toString() || '',
    standardPricePerItem: priceData.standardPricePerItem?.toString() || '',
    expressPricePerItem: priceData.expressPricePerItem?.toString() || '',
  });

  const handleChange = (field: string, value: string) => {
    setEditedPriceData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      standardPricePerKg: editedPriceData.standardPricePerKg || "0",
      expressPricePerKg: editedPriceData.expressPricePerKg || "0",
      standardPricePerItem: editedPriceData.standardPricePerItem || "0",
      expressPricePerItem: editedPriceData.expressPricePerItem || "0",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pricing</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standard-kg">Standard Price per KG</Label>
              <Input
                id="standard-kg"
                type="number"
                placeholder="0"
                value={editedPriceData.standardPricePerKg}
                onChange={(e) => handleChange('standardPricePerKg', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="express-kg">Express Price per KG</Label>
              <Input
                id="express-kg"
                type="number"
                placeholder="0"
                value={editedPriceData.expressPricePerKg}
                onChange={(e) => handleChange('expressPricePerKg', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standard-item">Standard Price per Item</Label>
              <Input
                id="standard-item"
                type="number"
                placeholder="0"
                value={editedPriceData.standardPricePerItem}
                onChange={(e) => handleChange('standardPricePerItem', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="express-item">Express Price per Item</Label>
              <Input
                id="express-item"
                type="number"
                placeholder="0"
                value={editedPriceData.expressPricePerItem}
                onChange={(e) => handleChange('expressPricePerItem', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPricesDialog;
