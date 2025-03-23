
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Wallet, 
  CreditCard, 
  CheckCircle, 
  TruckIcon, 
  Calculator, 
  BadgePercent,
  Receipt
} from 'lucide-react';

interface RevenueTilesProps {
  revenueMetrics: {
    totalRevenue: number;
    pendingPayments: number;
    receivedPayments: number;
    pendingCount: number;
    markupRevenue: number;
    totalDeliveryRevenue: number;
    servicesTax: number;
    deliveryTax: number;
  };
  formatIndianCurrency: (amount: number) => string;
}

export const RevenueTiles: React.FC<RevenueTilesProps> = ({ revenueMetrics, formatIndianCurrency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Revenue Card */}
      <Card className="overflow-hidden bg-gradient-blue card-hover-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueMetrics.totalRevenue)}</h3>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Markup Revenue Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 card-hover-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 font-medium mb-1">Markup Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueMetrics.markupRevenue)}</h3>
              <p className="text-gray-600 text-sm mt-1">10% of subtotal</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Revenue Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 card-hover-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 font-medium mb-1">Delivery Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueMetrics.totalDeliveryRevenue)}</h3>
              <p className="text-gray-600 text-sm mt-1">Varies by distance</p>
            </div>
            <div className="bg-amber-500 p-3 rounded-lg">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Pending Card */}
      <Card className="overflow-hidden bg-gradient-purple card-hover-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium mb-1">Payments Pending</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueMetrics.pendingPayments)}</h3>
              <p className="text-amber-600 text-sm mt-1 flex items-center">
                <span>{revenueMetrics.pendingCount} pending transactions</span>
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Received Card */}
      <Card className="overflow-hidden bg-gradient-green card-hover-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium mb-1">Payments Received</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueMetrics.receivedPayments)}</h3>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Tax Card (new) */}
      <Card className="overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-100 card-hover-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-600 font-medium mb-1">Services Tax</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueMetrics.servicesTax)}</h3>
              <p className="text-gray-600 text-sm mt-1">18% on services</p>
            </div>
            <div className="bg-cyan-500 p-3 rounded-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Tax Card (new) */}
      <Card className="overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 card-hover-effect">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-600 font-medium mb-1">Delivery Tax</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatIndianCurrency(revenueMetrics.deliveryTax)}</h3>
              <p className="text-gray-600 text-sm mt-1">5% on delivery</p>
            </div>
            <div className="bg-teal-500 p-3 rounded-lg">
              <BadgePercent className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
