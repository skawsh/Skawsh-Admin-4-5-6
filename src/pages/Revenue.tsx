
import React from 'react';
import Layout from '../components/layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BarChart, Calendar, CreditCard, IndianRupee, PieChart, TrendingUp, Wallet, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Revenue: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout activeSection="revenue">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="rounded-full h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Revenue</h1>
              <p className="text-gray-600 mt-1">Monitor your financial performance</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="overflow-hidden bg-gradient-blue card-hover-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-800">₹ 145,280</h3>
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12.5% from last month</span>
                  </p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-gradient-purple card-hover-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium mb-1">Payments Pending</p>
                  <h3 className="text-2xl font-bold text-gray-800">₹ 12,540</h3>
                  <p className="text-amber-600 text-sm mt-1 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    <span>5 pending transactions</span>
                  </p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-gradient-green card-hover-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium mb-1">Payments Received</p>
                  <h3 className="text-2xl font-bold text-gray-800">₹ 132,740</h3>
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+8.2% from last month</span>
                  </p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-hover-effect border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Revenue Breakdown</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PieChart className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-gray-500">Revenue breakdown charts coming soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover-effect border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Monthly Trends</h3>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BarChart className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-gray-500">Monthly trend analysis coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Revenue;
