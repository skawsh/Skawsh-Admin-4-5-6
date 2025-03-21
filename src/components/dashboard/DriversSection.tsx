
import React from 'react';
import { Users, Truck, Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface DriversSectionProps {
  totalDrivers: number;
  activeDrivers: number;
  inactiveDrivers: number;
}

const DriversSection: React.FC<DriversSectionProps> = ({ 
  totalDrivers, 
  activeDrivers, 
  inactiveDrivers 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Drivers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-bright-blue border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Drivers</p>
              <p className="text-3xl font-bold text-gray-800">{totalDrivers}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full text-white">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-bright-green border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Drivers</p>
              <p className="text-3xl font-bold text-gray-800">{activeDrivers}</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full text-white">
              <Truck className="h-6 w-6" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-bright-purple border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Inactive Drivers</p>
              <p className="text-3xl font-bold text-gray-800">{inactiveDrivers}</p>
            </div>
            <div className="p-3 bg-gray-500 rounded-full text-white">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DriversSection;
