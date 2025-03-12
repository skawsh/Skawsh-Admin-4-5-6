
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service, SubService, ClothingItem } from '@/types/services';
import { useToast } from "@/hooks/use-toast";
import { useServicesData } from "@/hooks/useServicesData";

interface CreateItemsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  subServices: SubService[];
  clothingItems: ClothingItem[];
}

const CreateItemsDialog: React.FC<CreateItemsDialogProps> = ({
  isOpen,
  onOpenChange,
  services,
  subServices,
  clothingItems
}) => {
  const [activeTab, setActiveTab] = useState<string>("service");
  const [serviceName, setServiceName] = useState<string>("");
  const [subServiceName, setSubServiceName] = useState<string>("");
  const [clothingItemName, setClothingItemName] = useState<string>("");
  
  const { toast } = useToast();
  const { addService, addSubService, addClothingItem } = useServicesData();

  const generateId = (type: string): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${type}-${timestamp}-${random}`;
  };

  const handleCreateService = () => {
    if (serviceName.trim() === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name cannot be empty"
      });
      return;
    }

    const newService: Service = {
      id: generateId('service'),
      name: serviceName.trim(),
      active: true
    };

    addService(newService);
    
    toast({
      title: "Success",
      description: `Service "${serviceName}" has been created`
    });

    setServiceName("");
  };

  const handleCreateSubService = () => {
    if (subServiceName.trim() === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sub-service name cannot be empty"
      });
      return;
    }

    const newSubService: SubService = {
      id: generateId('subservice'),
      name: subServiceName.trim(),
      active: true
    };

    addSubService(newSubService);
    
    toast({
      title: "Success",
      description: `Sub-service "${subServiceName}" has been created`
    });

    setSubServiceName("");
  };

  const handleCreateClothingItem = () => {
    if (clothingItemName.trim() === "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Clothing item name cannot be empty"
      });
      return;
    }

    const newClothingItem: ClothingItem = {
      id: generateId('clothing'),
      name: clothingItemName.trim(),
      active: true
    };

    addClothingItem(newClothingItem);
    
    toast({
      title: "Success",
      description: `Clothing item "${clothingItemName}" has been created`
    });

    setClothingItemName("");
  };

  const handleClose = () => {
    setServiceName("");
    setSubServiceName("");
    setClothingItemName("");
    setActiveTab("service");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] bg-white shadow-xl border-0">
        <DialogHeader className="text-center pb-2 border-b">
          <DialogTitle className="text-xl font-bold text-blue-600">Create New Items</DialogTitle>
          <p className="text-gray-500 text-sm mt-1">Add new services, sub-services, and clothing items</p>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="subservice">Sub Service</TabsTrigger>
            <TabsTrigger value="clothingitem">Clothing Item</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name</Label>
              <Input
                id="service-name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter service name"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleCreateService}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Create Service
            </Button>
            
            {services.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Existing Services</h4>
                <div className="max-h-[150px] overflow-y-auto bg-gray-50 rounded p-2 border">
                  {services.filter(s => s.active).map(service => (
                    <div key={service.id} className="py-1 px-2 border-b last:border-b-0">
                      {service.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="subservice" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subservice-name">Sub Service Name</Label>
              <Input
                id="subservice-name"
                value={subServiceName}
                onChange={(e) => setSubServiceName(e.target.value)}
                placeholder="Enter sub service name"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleCreateSubService}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Create Sub Service
            </Button>
            
            {subServices.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Existing Sub Services</h4>
                <div className="max-h-[150px] overflow-y-auto bg-gray-50 rounded p-2 border">
                  {subServices.filter(s => s.active).map(subService => (
                    <div key={subService.id} className="py-1 px-2 border-b last:border-b-0">
                      {subService.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="clothingitem" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clothingitem-name">Clothing Item Name</Label>
              <Input
                id="clothingitem-name"
                value={clothingItemName}
                onChange={(e) => setClothingItemName(e.target.value)}
                placeholder="Enter clothing item name"
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleCreateClothingItem}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Create Clothing Item
            </Button>
            
            {clothingItems.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Existing Clothing Items</h4>
                <div className="max-h-[150px] overflow-y-auto bg-gray-50 rounded p-2 border">
                  {clothingItems.filter(c => c.active).map(clothingItem => (
                    <div key={clothingItem.id} className="py-1 px-2 border-b last:border-b-0">
                      {clothingItem.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="px-5 py-2 font-medium text-gray-700 hover:bg-gray-100 border-gray-300"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemsDialog;
