
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  open,
  onOpenChange,
  orderId
}) => {
  const navigate = useNavigate();

  const handleGoToRevenue = () => {
    navigate('/revenue');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-blue-500" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            To view complete order details for order #{orderId}, please refer to the Revenue section.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500">
            The Revenue section contains comprehensive information about all orders including payment status, customer details, and delivery information.
          </p>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGoToRevenue}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Revenue Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
