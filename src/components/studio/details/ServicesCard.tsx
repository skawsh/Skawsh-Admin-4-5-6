import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useServicesData } from '@/hooks/useServicesData';

interface SubService {
  name: string;
  standardPricePerKg?: number;
  expressPricePerKg?: number;
  standardPricePerItem?: number;
  expressPricePerItem?: number;
  selectedItems?: string[];
  standardItemPrices?: { [key: string]: number };
  expressItemPrices?: { [key: string]: number };
  itemPrices?: { [key: string]: number };
  active?: boolean;
  clothingItemsStatus?: { [key: string]: boolean };
}

interface StudioService {
  id: string;
  name: string;
  active: boolean;
  price?: number;
  serviceId: string;
  subServices: SubService[];
}

interface ServicesCardProps {
  services: StudioService[];
  onServiceStatusChange: (serviceIndex: number) => void;
}

const ServicesCard: React.FC<ServicesCardProps> = ({ 
  services,
  onServiceStatusChange
}) => {
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const { services: allServices, subServices: allSubServices, clothingItems } = useServicesData();

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const formatPrice = (price?: number) => {
    return price !== undefined ? `₹${price}` : 'N/A';
  };

  const getSubServiceName = (id: string) => {
    const subService = allSubServices.find(s => s.id === id);
    return subService ? subService.name : id;
  };

  const getClothingItemName = (id: string) => {
    const item = clothingItems.find(i => i.id === id);
    return item ? item.name : id;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Studio Services
          </h2>
        </div>

        {services && services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service, index) => {
              const isExpanded = expandedServices[service.id] || false;
              
              return (
                <div key={service.id} className="border rounded-lg">
                  <div className="p-4 bg-gray-50 cursor-pointer" onClick={() => toggleServiceExpansion(service.id)}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {isExpanded ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                        <div>
                          <h3 className="text-lg font-semibold">{service.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={service.active}
                          onCheckedChange={() => onServiceStatusChange(index)}
                        />
                        <Badge variant={service.active ? "default" : "outline"}>
                          {service.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {isExpanded && service.subServices && (
                    <div className="p-4 border-t">
                      <div className="space-y-4">
                        {service.subServices.map((subService, subIndex) => (
                          <div key={`${service.id}-${subIndex}`} className="border rounded p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">{getSubServiceName(subService.name)}</h4>
                              <Badge variant={subService.active !== false ? "default" : "outline"}>
                                {subService.active !== false ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                {subService.standardPricePerKg !== undefined && (
                                  <div>
                                    <span className="text-sm text-gray-500">Standard Price per KG:</span>
                                    <span className="ml-2 font-medium">₹{subService.standardPricePerKg}</span>
                                  </div>
                                )}
                                {subService.expressPricePerKg !== undefined && (
                                  <div>
                                    <span className="text-sm text-gray-500">Express Price per KG:</span>
                                    <span className="ml-2 font-medium">₹{subService.expressPricePerKg}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                {subService.standardPricePerItem !== undefined && (
                                  <div>
                                    <span className="text-sm text-gray-500">Standard Price per Item:</span>
                                    <span className="ml-2 font-medium">₹{subService.standardPricePerItem}</span>
                                  </div>
                                )}
                                {subService.expressPricePerItem !== undefined && (
                                  <div>
                                    <span className="text-sm text-gray-500">Express Price per Item:</span>
                                    <span className="ml-2 font-medium">₹{subService.expressPricePerItem}</span>
                                  </div>
                                )}
                              </div>

                              {subService.selectedItems && subService.selectedItems.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-sm font-medium text-gray-600 mb-2">Clothing Items:</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {subService.selectedItems.map((itemId) => {
                                      const itemName = getClothingItemName(itemId);
                                      const itemActive = subService.clothingItemsStatus?.[itemId] !== false;
                                      
                                      return (
                                        <div key={itemId} className="border rounded p-3 bg-gray-50">
                                          <div className="flex justify-between items-center mb-2">
                                            <p className="font-medium text-gray-700">{itemName}</p>
                                            <Badge variant={itemActive ? "default" : "outline"}>
                                              {itemActive ? "Active" : "Inactive"}
                                            </Badge>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-sm">
                                            {subService.standardItemPrices && subService.standardItemPrices[itemId] !== undefined && (
                                              <div>
                                                <span className="text-gray-500">Standard: </span>
                                                <span>₹{subService.standardItemPrices[itemId]}</span>
                                              </div>
                                            )}
                                            {subService.expressItemPrices && subService.expressItemPrices[itemId] !== undefined && (
                                              <div>
                                                <span className="text-gray-500">Express: </span>
                                                <span>₹{subService.expressItemPrices[itemId]}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No services have been added to this studio yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicesCard;
