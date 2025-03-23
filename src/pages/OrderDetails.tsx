
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Package, 
  User, 
  Building, 
  FileText, 
  Truck,
  CreditCard
} from 'lucide-react';
import { mockOrders } from '@/components/revenue/mockRevenueData';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Wash Type</p>
                  <p className="font-medium text-red-600">Express Wash</p>
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
                  <div className="text-right font-medium">₹1596</div>
                </div>
                
                {/* Delivery Fee */}
                <div className="grid grid-cols-3 gap-4 pb-3">
                  <div className="col-span-2 text-left">Delivery Fee</div>
                  <div className="text-right font-medium">₹50</div>
                </div>
                
                {/* Taxes */}
                <div className="space-y-3 pb-3 border-b">
                  <div className="font-medium">Taxes</div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 text-gray-600">GST on Services (18%)</div>
                    <div className="text-right font-medium">₹287.28</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 text-gray-600">GST on Delivery (5%)</div>
                    <div className="text-right font-medium">₹2.50</div>
                  </div>
                </div>
                
                {/* Grand Total */}
                <div className="grid grid-cols-3 gap-4 font-bold text-lg">
                  <div className="col-span-2 text-left">Grand Total</div>
                  <div className="text-right">₹{order.amount.toFixed(2)}</div>
                </div>
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
