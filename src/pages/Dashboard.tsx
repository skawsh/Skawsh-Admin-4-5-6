
import React from 'react';
import Layout from '../components/layout/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout activeSection="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your laundry management dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <div className="glass-card p-6 space-y-2 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold">1,257</p>
            <p className="text-sm text-green-600">+12% from last month</p>
          </div>
          
          <div className="glass-card p-6 space-y-2 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-gray-500">Active Studios</h3>
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm text-green-600">+2 new studios</p>
          </div>
          
          <div className="glass-card p-6 space-y-2 hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
            <p className="text-3xl font-bold">₹24,568</p>
            <p className="text-sm text-green-600">+18% from last month</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Order #{1000 + item}</p>
                    <p className="text-sm text-gray-500">Standard Wash • 2 items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹24.99</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              ))}
              <button className="text-laundry-blue font-medium hover:text-laundry-blue-dark transition-colors">
                View all orders
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Popular Services</h2>
            <div className="space-y-4">
              {[
                { name: 'Standard Wash', percentage: 45 },
                { name: 'Premium Wash', percentage: 30 },
                { name: 'Dry Cleaning', percentage: 15 },
                { name: 'Ironing', percentage: 10 },
              ].map((service) => (
                <div key={service.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">{service.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-laundry-blue to-blue-600 h-2 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
