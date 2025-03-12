
import React from 'react';
import { StudioService } from '@/types/services';
import { Card } from '../ui/card';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface StudioServicesDetailsProps {
  studioServices: StudioService[];
  onServiceStatusChange: (serviceIndex: number) => void;
  onSubServiceStatusChange?: (serviceIndex: number, subServiceIndex: number, active: boolean) => void;
}

const StudioServicesDetails: React.FC<StudioServicesDetailsProps> = ({
  studioServices,
  onServiceStatusChange,
  onSubServiceStatusChange
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Studio Services</h2>
      {studioServices.map((service, serviceIndex) => (
        <Card key={service.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <Badge variant={service.active ? "success" : "secondary"}>
                  {service.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <Switch
                checked={service.active}
                onCheckedChange={() => onServiceStatusChange(serviceIndex)}
              />
            </div>
            
            <div className="pl-4 space-y-4">
              {service.subServices.map((subService, subIndex) => (
                <div key={subIndex} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{subService.name}</h4>
                    {onSubServiceStatusChange && (
                      <div className="flex items-center">
                        <Switch
                          checked={subService.active !== false}
                          onCheckedChange={(checked) => 
                            onSubServiceStatusChange(serviceIndex, subIndex, checked)
                          }
                          className="mr-2"
                        />
                        <Badge variant={subService.active !== false ? "success" : "secondary"}>
                          {subService.active !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Pricing Information */}
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    {(subService.standardPricePerKg || subService.expressPricePerKg) && (
                      <div className="space-y-1">
                        {subService.standardPricePerKg && (
                          <p>Standard Price: ₹{subService.standardPricePerKg}/kg</p>
                        )}
                        {subService.expressPricePerKg && (
                          <p>Express Price: ₹{subService.expressPricePerKg}/kg</p>
                        )}
                      </div>
                    )}
                    
                    {(subService.standardPricePerItem || subService.expressPricePerItem) && (
                      <div className="space-y-1">
                        {subService.standardPricePerItem && (
                          <p>Standard Price per Item: ₹{subService.standardPricePerItem}</p>
                        )}
                        {subService.expressPricePerItem && (
                          <p>Express Price per Item: ₹{subService.expressPricePerItem}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Clothing Items Section */}
                  {subService.selectedItems && subService.selectedItems.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 font-medium mb-2">Clothing Items:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        {subService.selectedItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm">
                            {item}
                            <div className="ml-2 space-y-1 text-gray-600">
                              {subService.standardItemPrices && subService.standardItemPrices[item] && (
                                <span className="block">
                                  Standard: ₹{subService.standardItemPrices[item]}
                                </span>
                              )}
                              {subService.expressItemPrices && subService.expressItemPrices[item] && (
                                <span className="block">
                                  Express: ₹{subService.expressItemPrices[item]}
                                </span>
                              )}
                              {subService.itemPrices && subService.itemPrices[item] && (
                                <span className="block">
                                  Price: ₹{subService.itemPrices[item]}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StudioServicesDetails;
