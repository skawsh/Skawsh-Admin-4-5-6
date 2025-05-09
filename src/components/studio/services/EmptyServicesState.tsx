
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const EmptyServicesState: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const handleAddService = () => {
    // Create a basic service structure if none exists
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios && id) {
      try {
        const studios = JSON.parse(savedStudios);
        const studioIndex = studios.findIndex((s: any) => s.id.toString() === id.toString());
        
        if (studioIndex !== -1) {
          // Initialize empty services array if it doesn't exist
          if (!studios[studioIndex].studioServices) {
            studios[studioIndex].studioServices = [];
          }
          
          // Create a default service to get started
          const defaultService = {
            id: Date.now().toString(),
            name: "Laundry Service",
            active: true,
            serviceId: "laundry-service",
            subServices: [
              {
                name: "wash-fold", // Assuming this is the ID of a subservice
                standardPricePerKg: 80,
                expressPricePerKg: 120,
                active: true,
                selectedItems: [],
                standardItemPrices: {},
                expressItemPrices: {},
                clothingItemsStatus: {}
              }
            ]
          };
          
          studios[studioIndex].studioServices.push(defaultService);
          localStorage.setItem('laundryStudios', JSON.stringify(studios));
          
          toast({
            title: "Service Created",
            description: "Added a default service to get you started."
          });
          
          // Force reload the current page to show the service management UI
          window.location.reload();
        }
      } catch (error) {
        console.error("Error initializing services:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize services."
        });
      }
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">No Services Added</h3>
        <p className="text-gray-500 mb-4">
          This studio doesn't have any services configured yet.
        </p>
        <Button 
          onClick={handleAddService}
          className="mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Services
        </Button>
      </div>
    </div>
  );
};

export default EmptyServicesState;
