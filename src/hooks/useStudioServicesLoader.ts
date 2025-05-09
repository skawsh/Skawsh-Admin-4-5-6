
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { StudioService } from '@/types/services';

export const useStudioServicesLoader = (studioId: string | undefined) => {
  const [studioData, setStudioData] = useState<{
    studioName: string;
    studioServices: StudioService[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadStudioServices = () => {
      setLoading(true);
      const savedStudios = localStorage.getItem('laundryStudios');
      
      if (savedStudios && studioId) {
        try {
          const studios = JSON.parse(savedStudios);
          const studio = studios.find((s: any) => s.id.toString() === studioId.toString());
          
          if (studio) {
            console.log("Found studio:", studio);
            
            // Initialize studioServices if it doesn't exist
            if (!studio.studioServices) {
              studio.studioServices = [];
              // Save the updated studios array back to localStorage
              const studioIndex = studios.findIndex((s: any) => s.id.toString() === studioId.toString());
              if (studioIndex !== -1) {
                studios[studioIndex] = studio;
                localStorage.setItem('laundryStudios', JSON.stringify(studios));
              }
            }
            
            // Ensure each subservice has an active property and clothingItemsStatus
            const updatedStudioServices = studio.studioServices.map((service: any) => ({
              ...service,
              subServices: service.subServices.map((subService: any) => {
                // Initialize clothingItemsStatus if it doesn't exist
                const clothingItemsStatus = subService.clothingItemsStatus || {};
                
                // If there are selectedItems but no status for them, initialize all to active
                if (subService.selectedItems && subService.selectedItems.length > 0) {
                  subService.selectedItems.forEach((itemId: string) => {
                    if (clothingItemsStatus[itemId] === undefined) {
                      clothingItemsStatus[itemId] = true;
                    }
                  });
                }
                
                return {
                  ...subService,
                  active: subService.active !== false, // Default to true if not explicitly false
                  clothingItemsStatus
                };
              })
            }));
            
            setStudioData({
              studioName: studio.studioName,
              studioServices: updatedStudioServices
            });
            console.log("Loaded studio services:", updatedStudioServices);
          } else {
            console.log("Studio not found with ID:", studioId);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Studio not found"
            });
            navigate('/studios');
          }
        } catch (error) {
          console.error("Error parsing studio data:", error);
          toast({
            variant: "destructive",
              title: "Error",
              description: "Failed to load studio data"
          });
          setStudioData({
            studioName: "Unknown Studio",
            studioServices: []
          });
        }
      } else {
        console.log("No studios data found in localStorage or ID is missing");
        setStudioData({
          studioName: "Unknown Studio",
          studioServices: []
        });
      }
      setLoading(false);
    };

    loadStudioServices();
  }, [studioId, navigate, toast]);

  return { studioData, setStudioData, loading };
};
