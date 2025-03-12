
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface BasicInfoCardProps {
  ownerName: string;
  studioName: string;
  email: string;
  contact: string;
  secondaryContact?: string;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  ownerName,
  studioName,
  email,
  contact,
  secondaryContact
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Owner Name</p>
            <p className="text-lg font-medium">{ownerName}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Studio Name</p>
            <p className="text-lg font-medium">{studioName}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Email</p>
            <p className="text-lg font-medium">{email}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Primary Number</p>
            <p className="text-lg font-medium">{contact}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Secondary Number</p>
            <p className="text-lg font-medium">{secondaryContact || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
