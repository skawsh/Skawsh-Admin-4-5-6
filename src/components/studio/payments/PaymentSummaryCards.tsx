
import React from 'react';
import { Card } from "@/components/ui/card";
import { StudioPaymentInfo } from '@/hooks/useStudioPayments';

interface PaymentSummaryCardsProps {
  studioInfo: StudioPaymentInfo;
}

const PaymentSummaryCards: React.FC<PaymentSummaryCardsProps> = ({ studioInfo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-yellow-50 border-yellow-100 shadow-sm">
        <div className="flex flex-col">
          <p className="text-gray-600 text-sm">Total Pending Amount</p>
          <p className="text-2xl font-bold">₹{studioInfo.pendingAmount.toFixed(2)}</p>
        </div>
      </Card>
      <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm">
        <div className="flex flex-col">
          <p className="text-gray-600 text-sm">Standard Wash Pending Amount</p>
          <p className="text-2xl font-bold">₹{studioInfo.standardWashPendingAmount.toFixed(2)}</p>
        </div>
      </Card>
      <Card className="p-6 bg-purple-50 border-purple-100 shadow-sm">
        <div className="flex flex-col">
          <p className="text-gray-600 text-sm">Express Wash Pending Amount</p>
          <p className="text-2xl font-bold">₹{studioInfo.expressWashPendingAmount.toFixed(2)}</p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSummaryCards;
