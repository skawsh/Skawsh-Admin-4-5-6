
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface PaymentCardProps {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  upiId: string;
  paymentSchedule: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  accountHolderName,
  bankName,
  accountNumber,
  ifscCode,
  branchName,
  upiId,
  paymentSchedule
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Account Holder Name</p>
            <p className="text-lg font-medium">{accountHolderName}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Bank Name</p>
            <p className="text-lg font-medium">{bankName}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Account Number</p>
            <p className="text-lg font-medium">{accountNumber}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">IFSC Code</p>
            <p className="text-lg font-medium">{ifscCode}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Branch Name</p>
            <p className="text-lg font-medium">{branchName}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">UPI ID</p>
            <p className="text-lg font-medium">{upiId}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Selected Payment Schedule</p>
            <p className="text-lg font-medium">{paymentSchedule}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
