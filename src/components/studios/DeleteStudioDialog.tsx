
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface DeleteStudioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studioName: string;
}

const DeleteStudioDialog: React.FC<DeleteStudioDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studioName
}) => {
  const [countdown, setCountdown] = useState(5);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    
    if (isOpen && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setButtonEnabled(true);
            clearInterval(timer);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
      // Reset state when dialog closes
      if (!isOpen) {
        setCountdown(5);
        setButtonEnabled(false);
      }
    };
  }, [isOpen, countdown]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Studio</DialogTitle>
        </DialogHeader>
        <div className="py-3">
          <p className="text-gray-700">Are you sure you want to delete <span className="font-semibold">{studioName}</span>?</p>
          <p className="text-red-500 mt-2 text-sm">This action cannot be undone immediately.</p>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={!buttonEnabled}
            className="relative"
          >
            {!buttonEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-600/80 rounded-md">
                <Clock className="h-4 w-4 mr-1" /> {countdown}s
              </div>
            )}
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStudioDialog;
