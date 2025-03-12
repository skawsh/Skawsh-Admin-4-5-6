
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Package } from 'lucide-react';

interface StudioService {
  id: string;
  name: string;
  active: boolean;
  price?: number;
}

interface ServicesCardProps {
  services: StudioService[];
  onServiceStatusChange: (serviceIndex: number) => void;
}

const ServicesCard: React.FC<ServicesCardProps> = ({ 
  services,
  onServiceStatusChange
}) => {
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
            {services.map((service, index) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-500">Price: ₹{service.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
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
            ))}
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
