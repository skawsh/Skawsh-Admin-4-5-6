
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  placeholder,
  value,
  onChange,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input 
            placeholder={placeholder} 
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

export default AddItemDialog;
