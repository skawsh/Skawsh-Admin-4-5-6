
import React from 'react';
import { StudioService } from '@/types/services';
import { Card } from '../ui/card';

interface StudioServicesDetailsProps {
  studioServices: StudioService[];
  onServiceStatusChange: (serviceIndex: number) => void;
}

const StudioServicesDetails: React.FC<StudioServicesDetailsProps> = ({
  studioServices,
  onServiceStatusChange
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Studio Services</h2>
      {studioServices.map((service, serviceIndex) => (
        <Card key={service.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <Switch
                checked={service.active}
                onCheckedChange={() => onServiceStatusChange(serviceIndex)}
              />
            </div>
            
            <div className="pl-4 space-y-4">
              {service.subServices.map((subService, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h4 className="font-medium mb-2">{subService.name}</h4>
                  
                  {subService.selectedItems && subService.selectedItems.length > 0 && (
                    <div className="pl-4">
                      <p className="text-sm text-gray-600 mb-2">Clothing Items:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {subService.selectedItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm">
                            {item}
                            {subService.itemPrices?.[item] && (
                              <span className="text-gray-600 ml-2">
                                (₹{subService.itemPrices[item]})
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {(subService.standardPricePerKg || subService.expressPricePerKg) && (
                    <div className="mt-2 text-sm text-gray-600">
                      {subService.standardPricePerKg && (
                        <p>Standard Price: ₹{subService.standardPricePerKg}/kg</p>
                      )}
                      {subService.expressPricePerKg && (
                        <p>Express Price: ₹{subService.expressPricePerKg}/kg</p>
                      )}
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
