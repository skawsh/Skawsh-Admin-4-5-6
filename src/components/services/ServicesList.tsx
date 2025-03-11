
import React from 'react';
import { Package, Pencil, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  active: boolean;
}

interface ServicesListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  searchTerm: string;
}

const ServicesList: React.FC<ServicesListProps> = ({ services, onEdit, searchTerm }) => {
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleServiceStatus = (id: string) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, active: !service.active } : service
    );
    
    try {
      localStorage.setItem('services', JSON.stringify(updatedServices));
      
      const service = services.find(s => s.id === id);
      const newStatus = service ? !service.active : false;
      
      toast({
        title: "Status Updated",
        description: `Service ${newStatus ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status"
      });
    }
  };
  
  const deleteService = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    
    try {
      localStorage.setItem('services', JSON.stringify(updatedServices));
      
      toast({
        title: "Service Deleted",
        description: "Service removed successfully"
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service"
      });
    }
  };

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
                onCheckedChange={() => toggleServiceStatus(service.id)} 
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
                onClick={() => deleteService(service.id)} 
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
