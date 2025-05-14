
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface RedirectServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RedirectServiceDialog: React.FC<RedirectServiceDialogProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const handleRedirect = () => {
    window.open("https://vendor-web-v2.vercel.app/services", "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Service Management</DialogTitle>
          <DialogDescription>
            Please refer to the vendor panel service section for this feature.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-blue-50 rounded-md border border-blue-100 text-blue-700 mt-2">
          This functionality is available in the vendor panel. Click the button below to access it.
        </div>
        <DialogFooter className="sm:justify-start mt-4">
          <Button 
            type="button" 
            variant="default"
            onClick={handleRedirect}
            className="flex items-center gap-2"
          >
            Go to Vendor Services <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RedirectServiceDialog;
