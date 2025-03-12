
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
        const studios = JSON.parse(savedStudios);
        const studio = studios.find((s: any) => s.id.toString() === id.toString());
        
        if (studio) {
          setStudioData({
            studioName: studio.studioName,
            studioServices: studio.studioServices || []
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Studio not found"
          });
          navigate('/studios');
        }
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
      
      const savedStudios = localStorage.getItem('laundryStudios');
      if (savedStudios && id) {
        const studios = JSON.parse(savedStudios);
        const studioIndex = studios.findIndex((s: any) => s.id.toString() === id.toString());
        
        if (studioIndex !== -1) {
          studios[studioIndex].studioServices = updatedServices;
          localStorage.setItem('laundryStudios', JSON.stringify(studios));
          
          toast({
            title: "Service Status Updated",
            description: `${updatedServices[serviceIndex].name} has been ${updatedServices[serviceIndex].active ? 'activated' : 'deactivated'}.`
          });
        }
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
              onClick={() => navigate('/studios')}
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
        ) : studioData && studioData.studioServices.length > 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
            <StudioServicesDetails
              studioServices={studioData.studioServices}
              onServiceStatusChange={handleServiceStatusChange}
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
