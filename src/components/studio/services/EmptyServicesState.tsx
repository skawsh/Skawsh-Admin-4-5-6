
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyServicesState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">No Services Added</h3>
        <p className="text-gray-500 mb-4">
          This studio doesn't have any services configured yet.
        </p>
        <Button 
          onClick={() => navigate('./add')}
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
