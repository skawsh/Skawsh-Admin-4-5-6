
import React from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const StudioHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Laundry Studios</h1>
        <p className="text-gray-600 mt-1">Manage all laundry studios on your platform</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button 
          variant="outline" 
          className="bg-white"
          onClick={() => navigate('/studios/onboard-requests')}
        >
          <ClipboardList className="mr-2 h-4 w-4" />
          Onboard Requests
        </Button>
        <Button 
          className="bg-blue-700 hover:bg-blue-800"
          onClick={() => navigate('/studios/add')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Studio
        </Button>
      </div>
    </div>
  );
};

export default StudioHeader;
