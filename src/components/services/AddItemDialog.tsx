
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

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
  // Optional footer buttons for more customization
  footerButtons?: ReactNode;
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
  children,
  footerButtons
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
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
          {footerButtons ? (
            footerButtons
          ) : (
            <>
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
