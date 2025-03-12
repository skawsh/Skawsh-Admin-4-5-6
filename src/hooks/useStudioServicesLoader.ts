
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
            
            // Check if studioServices exists in the studio object
            if (studio.studioServices) {
              console.log("Studio services found:", studio.studioServices);
              
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
            } else {
              console.log("No studio services found in the studio object");
              
              // Check if services data exists but is saved in a different format
              if (studio.services && Array.isArray(studio.services)) {
                setStudioData({
                  studioName: studio.studioName,
                  studioServices: studio.services
                });
              } else {
                // No services found in any expected format
                setStudioData({
                  studioName: studio.studioName,
                  studioServices: []
                });
              }
            }
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
        }
      } else {
        console.log("No studios data found in localStorage or ID is missing");
      }
      setLoading(false);
    };

    loadStudioServices();
  }, [studioId, navigate, toast]);

  return { studioData, setStudioData, loading };
};
