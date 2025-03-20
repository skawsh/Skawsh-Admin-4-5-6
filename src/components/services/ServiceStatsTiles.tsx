
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Service, SubService, ClothingItem } from '@/types/services';
import { List, ListChecks, Shirt, Check, XCircle, FolderTree, FolderClosed, PackageCheck, Package } from 'lucide-react';

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
  
  const activeClothingItems = clothingItems.filter(item => item.active).length;
  const inactiveClothingItems = clothingItems.length - activeClothingItems;

  const stats = [
    { label: 'Total Services', value: services.length, icon: <Package className="h-5 w-5" /> },
    { label: 'Active Services', value: activeServices, icon: <Check className="h-5 w-5 text-green-500" /> },
    { label: 'Inactive Services', value: inactiveServices, icon: <XCircle className="h-5 w-5 text-red-500" /> },
    { label: 'Total Sub-services', value: subServices.length, icon: <FolderTree className="h-5 w-5" /> },
    { label: 'Active Sub-services', value: activeSubServices, icon: <Check className="h-5 w-5 text-green-500" /> },
    { label: 'Inactive Sub-services', value: inactiveSubServices, icon: <XCircle className="h-5 w-5 text-red-500" /> },
    { label: 'Total Clothing Items', value: clothingItems.length, icon: <Shirt className="h-5 w-5" /> },
    { label: 'Active Clothing Items', value: activeClothingItems, icon: <Check className="h-5 w-5 text-green-500" /> },
    { label: 'Inactive Clothing Items', value: inactiveClothingItems, icon: <XCircle className="h-5 w-5 text-red-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-md">{stat.icon}</div>
                <span className="font-medium text-gray-600">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceStatsTiles;
