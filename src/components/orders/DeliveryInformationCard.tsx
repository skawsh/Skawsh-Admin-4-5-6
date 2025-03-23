
import React from 'react';
import { Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { RevenueOrder } from '@/components/revenue/RevenueTable';

interface DeliveryInformationCardProps {
  order: RevenueOrder;
}

const DeliveryInformationCard: React.FC<DeliveryInformationCardProps> = ({ order }) => {
  return (
    <Card className="p-6 border-l-4 border-l-purple-500">
      <div className="flex items-center gap-2 text-xl font-semibold text-purple-700 mb-6">
        <Truck className="h-6 w-6" />
        <h2>Delivery Information</h2>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="font-medium text-lg mb-4">Pickup and Drop</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
            <div>
              <p className="text-sm text-gray-500">Assigned to</p>
              <p className="font-medium">Deepak</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle details</p>
              <p className="font-medium">Passion Pro - TS02EF0808</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Picked up date & time</p>
              <p className="font-medium">Jun 10, 2025 at 10:30 AM</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dropped off date & time</p>
              <p className="font-medium">Jun 11, 2025 at 04:30 PM</p>
            </div>
          </div>
        </div>
        
        {/* Only show Collect and Delivery section if order has been delivered */}
        {order.deliveredDate && (
          <div>
            <h3 className="font-medium text-lg mb-4">Collect and Delivery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-medium">Saiteja</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicle details</p>
                <p className="font-medium">Honda Activa - TS02FF2703</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Collected date & time</p>
                <p className="font-medium">Jun 12, 2025 at 09:45 AM</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivered date & time</p>
                <p className="font-medium">Jun 15, 2025 at 06:15 PM</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DeliveryInformationCard;
