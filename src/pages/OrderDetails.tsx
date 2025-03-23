
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, ShoppingBag, Truck, CreditCard, User, MapPin } from 'lucide-react';
import { mockOrders } from '@/components/revenue/mockRevenueData';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Find the order in mock data
  const order = mockOrders.find(o => o.orderId === orderId);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Function to determine badge color based on payment status
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
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
            <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{orderId}</p>
          </div>
        </div>
        
        {order ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order Information</span>
                  <Badge 
                    variant="outline" 
                    className={getPaymentStatusColor(order.paymentStatus)}
                  >
                    {order.paymentStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Order ID
                    </p>
                    <p className="font-medium">#{order.orderId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Order Date
                    </p>
                    <p className="font-medium">{format(order.orderDate, 'dd MMMM yyyy')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Wash Type
                    </p>
                    <p className="font-medium">{order.washType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Delivery Status
                    </p>
                    <p className="font-medium">{order.deliveredDate ? 'Delivered' : 'Pending'}</p>
                  </div>
                  {order.deliveredDate && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Delivered Date
                      </p>
                      <p className="font-medium">{format(order.deliveredDate, 'dd MMMM yyyy')}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">Jane Smith</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">jane.smith@example.com</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </h3>
                  <p>123 Main Street, Apartment 4B<br />Mumbai, Maharashtra 400001<br />India</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹ {(order.amount * 0.85).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax (GST - 18%)</span>
                    <span>₹ {(order.amount * 0.15).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span>₹ 0</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹ {order.amount}</span>
                </div>
                
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="bg-gray-50 p-3 rounded-md flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-gray-500">**** **** **** 1234</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium">Order Not Found</h3>
                <p className="text-gray-500 mt-2">The order you're looking for doesn't exist or has been removed.</p>
                <Button 
                  className="mt-4" 
                  onClick={handleGoBack}
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetails;
