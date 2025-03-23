
import React from 'react';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CustomerInformationCard: React.FC = () => {
  return (
    <Card className="p-6 border-l-4 border-l-blue-500">
      <div className="flex items-center gap-2 text-xl font-semibold text-blue-700 mb-6">
        <User className="h-6 w-6" />
        <h2>Customer Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
        <div>
          <p className="text-sm text-gray-500">Customer Name</p>
          <p className="font-medium">Vijay Malhotra</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Number</p>
          <p className="font-medium">+91 9998887770</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">204, Jubilee Heights, Madhapur, Hyderabad</p>
        </div>
      </div>
    </Card>
  );
};

export default CustomerInformationCard;
