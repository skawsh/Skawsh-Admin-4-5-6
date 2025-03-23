
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockOrders } from '@/components/revenue/data/orderData';
import { getPaymentStatusColor } from '@/components/orders/utils/paymentStatusUtils';
import OrderInformationCard from '@/components/orders/OrderInformationCard';
import CustomerInformationCard from '@/components/orders/CustomerInformationCard';
import StudioInformationCard from '@/components/orders/StudioInformationCard';
import ServicesInformationCard from '@/components/orders/ServicesInformationCard';
import PaymentInformationCard from '@/components/orders/PaymentInformationCard';
import DeliveryInformationCard from '@/components/orders/DeliveryInformationCard';
import OrderNotFound from '@/components/orders/OrderNotFound';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Find the order in mock data
  const order = mockOrders.find(o => o.orderId === orderId);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <Layout activeSection="revenue">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleGoBack}
            className="rounded-full h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Details: {orderId}</h1>
            <p className="text-gray-600 mt-1">View details for order {orderId}</p>
          </div>
        </div>
        
        {order ? (
          <div className="space-y-6">
            <OrderInformationCard order={order} />
            <CustomerInformationCard />
            <StudioInformationCard />
            <ServicesInformationCard order={order} />
            <PaymentInformationCard order={order} getPaymentStatusColor={getPaymentStatusColor} />
            <DeliveryInformationCard order={order} />
          </div>
        ) : (
          <OrderNotFound handleGoBack={handleGoBack} />
        )}
      </div>
    </Layout>
  );
};

export default OrderDetails;
