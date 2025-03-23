
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Building, 
  FileText, 
  Truck,
  CreditCard
} from 'lucide-react';
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
            <h1 className="text-3xl font-bold text-gray-800">Order Details: {orderId}</h1>
            <p className="text-gray-600 mt-1">View details for order {orderId}</p>
          </div>
        </div>
        
        {order ? (
          <div className="space-y-6">
            {/* Order Information */}
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center gap-2 text-xl font-semibold text-green-700 mb-6">
                <Package className="h-6 w-6" />
                <h2>Order Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ordered Date & Time</p>
                  <p className="font-medium">{format(order.orderDate, 'dd MMM yyyy, h:mm a')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Delivered Date & Time</p>
                  <p className="font-medium">
                    {order.deliveredDate ? format(order.deliveredDate, 'dd MMM yyyy, h:mm a') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wash Type</p>
                  <p className="font-medium text-red-600">{order.washType}</p>
                </div>
              </div>
            </Card>

            {/* Customer Information */}
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 text-xl font-semibold text-blue-700 mb-6">
                <User className="h-6 w-6" />
                <h2>Customer Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium">Vijay Malhotra</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number</p>
                  <p className="font-medium">+91 9998887770</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">204, Jubilee Heights, Madhapur, Hyderabad</p>
                </div>
              </div>
            </Card>
            
            {/* Studio Information */}
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 text-xl font-semibold text-blue-700 mb-6">
                <Building className="h-6 w-6" />
                <h2>Studio Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                <div>
                  <p className="text-sm text-gray-500">Studio Name</p>
                  <p className="font-medium">CleanCorp</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Studio ID</p>
                  <p className="font-medium">STD-RT001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">+91 8887776660</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">23-A, Hi-Tech City Road, KPHB Colony, Hyderabad</p>
                </div>
              </div>
            </Card>
            
            {/* Services Information */}
            <Card className="p-6 border-l-4 border-l-yellow-500">
              <div className="flex items-center gap-2 text-xl font-semibold text-yellow-700 mb-6">
                <FileText className="h-6 w-6" />
                <h2>Services Information</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-500">Wash Type</p>
                  <p className="font-medium text-red-600">{order.washType}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-bold text-lg mb-3">Your Order</h3>
                  
                  {/* Core Laundry Service */}
                  <div className="mb-4">
                    <p className="font-bold text-gray-800">Core Laundry Service</p>
                    <div className="space-y-2 mt-1 pl-4">
                      <div className="flex justify-between">
                        <p>1) Wash & Fold</p>
                        <div className="flex space-x-4">
                          <span className="text-gray-600">4.3 Kg X ₹49</span>
                          <span className="font-medium">₹210.7</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <p>2) Wash & Iron</p>
                        <div className="flex space-x-4">
                          <span className="text-gray-600">2 Kg X ₹79</span>
                          <span className="font-medium">₹158</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dry Cleaning */}
                  <div className="mb-4">
                    <p className="font-bold text-gray-800">Dry Cleaning</p>
                    <div className="space-y-2 mt-1 pl-4">
                      <p className="font-medium text-gray-700">Upper Wear</p>
                      <div className="flex justify-between pl-4">
                        <p>1 Leather jacket X 199</p>
                        <span className="font-medium">₹199</span>
                      </div>
                      <div className="flex justify-between pl-4">
                        <p>2 Designer Saree X 499</p>
                        <span className="font-medium">₹499</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Totals */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <p className="font-medium">Service Total</p>
                      <p className="font-medium">₹1066</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Delivery Charges</p>
                      <p>₹50</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Taxes</p>
                      <p>₹194.38</p>
                    </div>
                    <div className="flex justify-between bg-green-100 p-2 rounded-md mt-2">
                      <p className="font-bold">Grand Total</p>
                      <p className="font-bold">₹1310.38</p>
                    </div>
                  </div>
                </div>
                
                {/* Deprecated sections that are now integrated above */}
                {/* Removed the original Dry Cleaning Services and Shoe Cleaning Services blocks */}
                {/* Removed the original Fee and Taxes section */}
              </div>
            </Card>
            
            {/* Payment Information Card */}
            <Card className="p-6 border-l-4 border-l-indigo-500">
              <div className="flex items-center gap-2 text-xl font-semibold text-indigo-700 mb-6">
                <CreditCard className="h-6 w-6" />
                <h2>Payment Information</h2>
              </div>
              
              {order.paymentStatus === 'Pending' ? (
                <div className="text-center py-6 text-yellow-600">
                  <p className="font-medium text-lg">Payment details will be shown after payment completion.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">Credit Card</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium">TXN123456789</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Date & Time</p>
                    <p className="font-medium">{format(order.orderDate, 'dd MMM yyyy, h:mm a')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                  </div>
                </div>
              )}
            </Card>
            
            {/* Delivery Information */}
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
          </div>
        ) : (
          <Card className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Order Not Found</h3>
              <p className="text-gray-500 mt-2">The order you're looking for doesn't exist or has been removed.</p>
              <Button 
                className="mt-4" 
                onClick={handleGoBack}
              >
                Go Back
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetails;
