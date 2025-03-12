
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServicesData } from '@/hooks/useServicesData';
import { useToast } from "@/hooks/use-toast";

interface CreateItemsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onItemsCreated: () => void;
}

const CreateItemsDialog: React.FC<CreateItemsDialogProps> = ({
  isOpen,
  onOpenChange,
  onItemsCreated
}) => {
  const [serviceName, setServiceName] = useState('');
  const [subServiceName, setSubServiceName] = useState('');
  const [clothingItemName, setClothingItemName] = useState('');
  const { addService, addSubService, addClothingItem } = useServicesData();
  const { toast } = useToast();

  const handleSave = () => {
    let hasCreated = false;

    if (serviceName.trim()) {
      const success = addService(serviceName.trim());
      if (success) hasCreated = true;
    }

    if (subServiceName.trim()) {
      const success = addSubService(subServiceName.trim());
      if (success) hasCreated = true;
    }

    if (clothingItemName.trim()) {
      const success = addClothingItem(clothingItemName.trim());
      if (success) hasCreated = true;
    }

    if (hasCreated) {
      onItemsCreated();
      onOpenChange(false);
      setServiceName('');
      setSubServiceName('');
      setClothingItemName('');
      toast({
        title: "Success",
        description: "Items created successfully"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter at least one item name"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="service-name">Service Name</Label>
            <Input
              id="service-name"
              placeholder="Enter service name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sub-service-name">Sub Service Name</Label>
            <Input
              id="sub-service-name"
              placeholder="Enter sub service name"
              value={subServiceName}
              onChange={(e) => setSubServiceName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clothing-item-name">Clothing Item Name</Label>
            <Input
              id="clothing-item-name"
              placeholder="Enter clothing item name"
              value={clothingItemName}
              onChange={(e) => setClothingItemName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemsDialog;
