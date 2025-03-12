
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StudioSetupCardProps {
  employees: number;
  dailyCapacity: number;
  specialEquipment: string;
  washCategory: string[];
}

const StudioSetupCard: React.FC<StudioSetupCardProps> = ({
  employees,
  dailyCapacity,
  specialEquipment,
  washCategory
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Studio Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Number of Employees</p>
            <p className="text-lg font-medium">{employees}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Daily Capacity (In KG's)</p>
            <p className="text-lg font-medium">{dailyCapacity}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Special Equipment</p>
            <p className="text-lg font-medium">{specialEquipment || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Selected Wash Category</p>
            <div className="space-y-1">
              {washCategory.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-800"></div>
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudioSetupCard;
