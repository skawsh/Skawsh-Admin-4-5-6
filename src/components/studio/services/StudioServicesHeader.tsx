
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface StudioServicesHeaderProps {
  studioName: string;
  studioId: string;
  loading: boolean;
}

const StudioServicesHeader: React.FC<StudioServicesHeaderProps> = ({ 
  studioName,
  studioId,
  loading
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="bg-white" 
          onClick={() => navigate(`/studios/${studioId}`)}
          size="icon"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {loading ? 'Loading...' : `${studioName || 'Studio'} Services`}
          </h1>
          <p className="text-gray-600 mt-1">
            Manage services for this studio
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudioServicesHeader;
