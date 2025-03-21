
import React from 'react';
import { Building2, Check, XCircle, ShoppingBag } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

interface StudiosSectionProps {
  totalStudios: number;
  activeStudios: number;
  inactiveStudios: number;
}

const StudiosSection: React.FC<StudiosSectionProps> = ({ 
  totalStudios, 
  activeStudios, 
  inactiveStudios 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Studios</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-blue-500">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Studios</p>
              <p className="text-2xl font-bold text-gray-800">{totalStudios}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-green-50 border-green-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-green-500">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Studios</p>
              <p className="text-2xl font-bold text-gray-800">{activeStudios}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-red-50 border-red-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-red-500">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Inactive Studios</p>
              <p className="text-2xl font-bold text-gray-800">{inactiveStudios}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-purple-50 border-purple-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-purple-500">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Avg. Sack Value</p>
              <p className="text-2xl font-bold text-gray-800">₹396</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudiosSection;
