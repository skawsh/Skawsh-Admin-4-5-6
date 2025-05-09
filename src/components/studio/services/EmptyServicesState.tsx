
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, WashingMachine } from 'lucide-react';

const EmptyServicesState: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const defaultServices = [
    { id: "service-1", name: "Core Laundry Services" },
    { id: "service-2", name: "Dry Cleaning" },
    { id: "service-3", name: "Specialized Laundry Services" },
    { id: "service-4", name: "Shoe Cleaning" },
  ];

  const handleAddService = (serviceId: string, serviceName: string) => {
    // Create a new service with the specified name
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios && id) {
      try {
        const studios = JSON.parse(savedStudios);
        const studioIndex = studios.findIndex((s: any) => s.id.toString() === id.toString());
        
        if (studioIndex !== -1) {
          if (!studios[studioIndex].studioServices) {
            studios[studioIndex].studioServices = [];
          }
          
          const newService = {
            id: serviceId,
            name: serviceName,
            active: true,
            serviceId: serviceId,
            subServices: []
          };
          
          studios[studioIndex].studioServices.push(newService);
          localStorage.setItem('laundryStudios', JSON.stringify(studios));
          
          // Refresh the page to show the new service
          window.location.reload();
        }
      } catch (error) {
        console.error("Error adding service:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <WashingMachine size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Services Added Yet</h2>
        <p className="text-gray-600 mb-8">Start by adding services to this laundry studio</p>
        
        <div className="space-y-3 w-full">
          {defaultServices.map((service) => (
            <Button 
              key={service.id}
              onClick={() => handleAddService(service.id, service.name)}
              variant="outline"
              className="flex items-center justify-center gap-2 w-full py-3"
            >
              <Plus size={16} /> {service.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyServicesState;
