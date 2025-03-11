
import React from 'react';
import { Package, Pencil, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Service } from '@/types/services';

interface ServicesListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onStatusChange: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
}

const ServicesList: React.FC<ServicesListProps> = ({ 
  services, 
  onEdit, 
  onStatusChange,
  onDelete,
  searchTerm 
}) => {
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {filteredServices.length > 0 ? (
        filteredServices.map(service => (
          <div key={service.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900">{service.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <Switch 
                checked={service.active} 
                onCheckedChange={(checked) => onStatusChange(service.id, checked)} 
                className="data-[state=checked]:bg-green-500"
              />
              <button 
                onClick={() => onEdit(service)}
                className="text-gray-500 hover:text-blue-500 transition-colors"
                aria-label="Edit service"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(service.id)} 
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Delete service"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-600">
            {searchTerm 
              ? "No services found. Try adjusting your search." 
              : "No services found. Add a service to get started."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
