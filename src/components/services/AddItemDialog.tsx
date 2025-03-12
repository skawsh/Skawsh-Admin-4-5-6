
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSave: () => void;
  children?: ReactNode;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  placeholder,
  value,
  onChange,
  onSave,
  children
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {children ? (
            children
          ) : (
            <Input 
              placeholder={placeholder} 
              value={value} 
              onChange={(e) => onChange && onChange(e.target.value)} 
            />
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              onChange && onChange('');
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
