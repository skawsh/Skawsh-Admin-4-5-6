
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface BusinessCardProps {
  registrationNumber: string;
  gstVatNumber: string;
  panNumber: string;
  openingTime: string;
  closingTime: string;
  priceAdjustment: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  registrationNumber,
  gstVatNumber,
  panNumber,
  openingTime,
  closingTime,
  priceAdjustment
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Business Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Business Registration Number</p>
            <p className="text-lg font-medium">{registrationNumber}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">GST/VAT Number</p>
            <p className="text-lg font-medium">{gstVatNumber}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">PAN Number</p>
            <p className="text-lg font-medium">{panNumber}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Opening Time</p>
            <p className="text-lg font-medium">{openingTime}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Closing Time</p>
            <p className="text-lg font-medium">{closingTime}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Price Adjustment %</p>
            <p className="text-lg font-medium">{priceAdjustment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
