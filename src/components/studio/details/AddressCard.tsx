
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface AddressCardProps {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: string;
  longitude?: string;
}

const AddressCard: React.FC<AddressCardProps> = ({
  street,
  city,
  state,
  postalCode,
  latitude,
  longitude
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Address Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Street</p>
            <p className="text-lg font-medium">{street}</p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-1">City</p>
                <p className="text-lg font-medium">{city}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">State</p>
                <p className="text-lg font-medium">{state}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Latitude</p>
            <p className="text-lg font-medium">{latitude || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Longitude</p>
            <p className="text-lg font-medium">{longitude || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Postal Code</p>
            <p className="text-lg font-medium">{postalCode}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
