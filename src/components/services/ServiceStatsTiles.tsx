
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Service, SubService, ClothingItem } from '@/types/services';
import { Package, Check, XCircle, FolderTree } from 'lucide-react';

interface ServiceStatsTilesProps {
  services: Service[];
  subServices: SubService[];
  clothingItems: ClothingItem[];
}

const ServiceStatsTiles: React.FC<ServiceStatsTilesProps> = ({
  services,
  subServices,
  clothingItems
}) => {
  // Calculate statistics
  const activeServices = services.filter(service => service.active).length;
  const inactiveServices = services.length - activeServices;
  
  const activeSubServices = subServices.filter(subService => subService.active).length;
  const inactiveSubServices = subServices.length - activeSubServices;

  const stats = [
    { 
      label: 'Total Services', 
      value: services.length, 
      icon: <Package className="h-6 w-6" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    { 
      label: 'Active Services', 
      value: activeServices, 
      icon: <Check className="h-6 w-6" />,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500'
    },
    { 
      label: 'Inactive Services', 
      value: inactiveServices, 
      icon: <XCircle className="h-6 w-6" />,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-500'
    },
    { 
      label: 'Total Sub-services', 
      value: subServices.length, 
      icon: <FolderTree className="h-6 w-6" />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500'
    },
    { 
      label: 'Active Sub-services', 
      value: activeSubServices, 
      icon: <Check className="h-6 w-6" />,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-500'
    },
    { 
      label: 'Inactive Sub-services', 
      value: inactiveSubServices, 
      icon: <XCircle className="h-6 w-6" />,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`${stat.bgColor} border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 bg-white/80 rounded-lg ${stat.iconColor}`}>{stat.icon}</div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-600 text-sm">{stat.label}</span>
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceStatsTiles;
