
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StudioServicesDetails from '../components/services/StudioServicesDetails';
import { StudioService } from '@/types/services';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const StudioServices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studioData, setStudioData] = useState<{
    studioName: string;
    studioServices: StudioService[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudioServices = () => {
      setLoading(true);
      const savedStudios = localStorage.getItem('laundryStudios');
      
      if (savedStudios && id) {
        try {
          const studios = JSON.parse(savedStudios);
          const studio = studios.find((s: any) => s.id.toString() === id.toString());
          
          if (studio) {
            console.log("Found studio:", studio);
            
            // Check if studioServices exists in the studio object
            if (studio.studioServices) {
              console.log("Studio services found:", studio.studioServices);
              
              // Ensure each subservice has an active property
              const updatedStudioServices = studio.studioServices.map((service: any) => ({
                ...service,
                subServices: service.subServices.map((subService: any) => ({
                  ...subService,
                  active: subService.active !== false // Default to true if not explicitly false
                }))
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
            console.log("Studio not found with ID:", id);
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
  }, [id, navigate, toast]);

  const handleServiceStatusChange = (serviceIndex: number) => {
    if (studioData && studioData.studioServices) {
      const updatedServices = [...studioData.studioServices];
      updatedServices[serviceIndex].active = !updatedServices[serviceIndex].active;
      
      setStudioData({
        ...studioData,
        studioServices: updatedServices
      });
      
      saveUpdatedServicesToLocalStorage(updatedServices);
      
      toast({
        title: "Service Status Updated",
        description: `${updatedServices[serviceIndex].name} has been ${updatedServices[serviceIndex].active ? 'activated' : 'deactivated'}.`
      });
    }
  };

  const handleSubServiceStatusChange = (serviceIndex: number, subServiceIndex: number, active: boolean) => {
    if (studioData && studioData.studioServices) {
      const updatedServices = [...studioData.studioServices];
      // Ensure subServices array exists and has the specified index
      if (updatedServices[serviceIndex] && 
          updatedServices[serviceIndex].subServices && 
          updatedServices[serviceIndex].subServices[subServiceIndex]) {
        
        updatedServices[serviceIndex].subServices[subServiceIndex].active = active;
        
        setStudioData({
          ...studioData,
          studioServices: updatedServices
        });
        
        saveUpdatedServicesToLocalStorage(updatedServices);
        
        const subServiceName = updatedServices[serviceIndex].subServices[subServiceIndex].name;
        toast({
          title: "Sub-Service Status Updated",
          description: `${subServiceName} has been ${active ? 'activated' : 'deactivated'}.`
        });
      }
    }
  };

  const saveUpdatedServicesToLocalStorage = (updatedServices: StudioService[]) => {
    const savedStudios = localStorage.getItem('laundryStudios');
    if (savedStudios && id) {
      try {
        const studios = JSON.parse(savedStudios);
        const studioIndex = studios.findIndex((s: any) => s.id.toString() === id.toString());
        
        if (studioIndex !== -1) {
          studios[studioIndex].studioServices = updatedServices;
          localStorage.setItem('laundryStudios', JSON.stringify(studios));
        }
      } catch (error) {
        console.error("Error updating service status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update service status"
        });
      }
    }
  };

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="bg-white" 
              onClick={() => navigate(`/studios/${id}`)}
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {loading ? 'Loading...' : `${studioData?.studioName || 'Studio'} Services`}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage services for this studio
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
            Loading...
          </div>
        ) : studioData && studioData.studioServices && studioData.studioServices.length > 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
            <StudioServicesDetails
              studioServices={studioData.studioServices}
              onServiceStatusChange={handleServiceStatusChange}
              onSubServiceStatusChange={handleSubServiceStatusChange}
            />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Services Added</h3>
              <p className="text-gray-500 mb-4">
                This studio doesn't have any services configured yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudioServices;
