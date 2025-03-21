
import React from 'react';
import { Package, Check, XCircle, FolderTree } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface ServicesSectionProps {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  totalSubServices: number;
  activeSubServices: number;
  inactiveSubServices: number;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  totalServices, 
  activeServices, 
  inactiveServices, 
  totalSubServices, 
  activeSubServices, 
  inactiveSubServices 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Services and Sub-services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-blue-500">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Services</p>
              <p className="text-2xl font-bold text-gray-800">{totalServices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-green-50 border-green-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-green-500">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Services</p>
              <p className="text-2xl font-bold text-gray-800">{activeServices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-red-50 border-red-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-red-500">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Inactive Services</p>
              <p className="text-2xl font-bold text-gray-800">{inactiveServices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-purple-50 border-purple-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-purple-500">
              <FolderTree className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Sub-services</p>
              <p className="text-2xl font-bold text-gray-800">{totalSubServices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-emerald-50 border-emerald-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Sub-services</p>
              <p className="text-2xl font-bold text-gray-800">{activeSubServices}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-orange-50 border-orange-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg text-orange-500">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Inactive Sub-services</p>
              <p className="text-2xl font-bold text-gray-800">{inactiveSubServices}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ServicesSection;
