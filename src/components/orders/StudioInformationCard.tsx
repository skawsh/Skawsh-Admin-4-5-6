
import React from 'react';
import { Building } from 'lucide-react';
import { Card } from '@/components/ui/card';

const StudioInformationCard: React.FC = () => {
  return (
    <Card className="p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center gap-2 text-xl font-semibold text-blue-700 mb-6">
        <Building className="h-6 w-6" />
        <h2>Studio Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
        <div>
          <p className="text-sm text-gray-500">Studio Name</p>
          <p className="font-medium">CleanCorp</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Studio ID</p>
          <p className="font-medium">STD-RT001</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Contact</p>
          <p className="font-medium">+91 8887776660</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">23-A, Hi-Tech City Road, KPHB Colony, Hyderabad</p>
        </div>
      </div>
    </Card>
  );
};

export default StudioInformationCard;
