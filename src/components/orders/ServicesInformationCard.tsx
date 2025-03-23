
import React from 'react';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RevenueOrder } from '@/components/revenue/RevenueTable';

interface ServicesInformationCardProps {
  order: RevenueOrder;
}

const ServicesInformationCard: React.FC<ServicesInformationCardProps> = ({ order }) => {
  // Calculate service totals
  const dryCleaning = 400; // Jeans: 2 X 200 = 400
  const shoeCleaning = 1196; // Regular: 2 X 598/Pair = 1196
  const serviceTotal = dryCleaning + shoeCleaning; // 1596
  const deliveryFee = 50;
  const gstOnServices = Math.round(serviceTotal * 0.18 * 100) / 100; // 287.28
  const gstOnDelivery = Math.round(deliveryFee * 0.05 * 100) / 100; // 2.50
  const grandTotal = serviceTotal + deliveryFee + gstOnServices + gstOnDelivery; // 1935.78

  return (
    <Card className="p-6 border-l-4 border-l-yellow-500">
      <div className="flex items-center gap-2 text-xl font-semibold text-yellow-700 mb-6">
        <FileText className="h-6 w-6" />
        <h2>Services Information</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">Wash Type</p>
          <p className="font-medium text-red-600">{order.washType}</p>
        </div>
        
        {/* Dry Cleaning Services */}
        <div className="border rounded-md p-4">
          <h3 className="font-semibold text-lg mb-4">Dry Cleaning Services</h3>
          
          <div className="mb-2 font-medium">Bottom Wear</div>
          
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div>1) Jeans</div>
            <div className="text-right">2 X 200</div>
            <div className="text-right font-medium">₹400</div>
          </div>
        </div>
        
        {/* Shoe Cleaning Services */}
        <div className="border rounded-md p-4">
          <h3 className="font-semibold text-lg mb-4">Shoe Cleaning Services</h3>
          
          <div className="mb-2 font-medium">Regular</div>
          
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div></div>
            <div className="text-right">2 X 598/Pair</div>
            <div className="text-right font-medium">₹1196</div>
          </div>
        </div>
        
        {/* Service Total */}
        <div className="grid grid-cols-3 gap-4 pb-3 border-b">
          <div className="font-medium col-span-2 text-left">Service Total</div>
          <div className="text-right font-medium">₹{serviceTotal}</div>
        </div>
        
        {/* Delivery Fee */}
        <div className="grid grid-cols-3 gap-4 pb-3">
          <div className="col-span-2 text-left">Delivery Fee</div>
          <div className="text-right font-medium">₹{deliveryFee}</div>
        </div>
        
        {/* Taxes */}
        <div className="space-y-3 pb-3 border-b">
          <div className="font-medium">Taxes</div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 text-gray-600">GST on Services (18%)</div>
            <div className="text-right font-medium">₹{gstOnServices.toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 text-gray-600">GST on Delivery (5%)</div>
            <div className="text-right font-medium">₹{gstOnDelivery.toFixed(2)}</div>
          </div>
        </div>
        
        {/* Grand Total */}
        <div className="grid grid-cols-3 gap-4 font-bold text-lg">
          <div className="col-span-2 text-left">Grand Total</div>
          <div className="text-right">₹{grandTotal.toFixed(2)}</div>
        </div>
      </div>
    </Card>
  );
};

export default ServicesInformationCard;
