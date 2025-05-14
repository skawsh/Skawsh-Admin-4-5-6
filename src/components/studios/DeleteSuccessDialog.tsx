
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Undo } from "lucide-react";

interface DeleteSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUndo: () => void;
  studioName: string;
}

const DeleteSuccessDialog: React.FC<DeleteSuccessDialogProps> = ({
  isOpen,
  onClose,
  onUndo,
  studioName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Success</DialogTitle>
        </DialogHeader>
        <div className="py-3">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Check className="h-5 w-5" />
            <p className="font-medium">The studio has been deleted</p>
          </div>
          <p className="text-gray-600 text-sm">
            {studioName} has been successfully removed from your studios.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:order-1">
            OK
          </Button>
          <Button 
            variant="secondary" 
            onClick={onUndo} 
            className="flex gap-2 items-center sm:order-2"
          >
            <Undo className="h-4 w-4" />
            Undo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSuccessDialog;
