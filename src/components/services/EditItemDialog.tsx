
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: 'service' | 'sub-service' | 'clothing-item';
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  isOpen,
  onOpenChange,
  itemType,
  value,
  onChange,
  onSave
}) => {
  const getTitle = () => {
    switch (itemType) {
      case 'sub-service':
        return 'Edit Sub-service';
      case 'clothing-item':
        return 'Edit Clothing Item';
      default:
        return 'Edit Service';
    }
  };

  const getPlaceholder = () => {
    switch (itemType) {
      case 'sub-service':
        return 'Enter sub-service name';
      case 'clothing-item':
        return 'Enter clothing item name';
      default:
        return 'Enter service name';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder={getPlaceholder()}
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onChange('');
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
