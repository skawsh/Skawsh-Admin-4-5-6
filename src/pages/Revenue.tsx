
import React from 'react';
import Layout from '../components/layout/Layout';

const Revenue: React.FC = () => {
  return (
    <Layout activeSection="revenue">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Revenue</h1>
          <p className="text-gray-600 mt-1">Monitor your financial performance</p>
        </div>
        
        <div className="glass-card p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Revenue management section is under development.</p>
            <p className="text-gray-500 mt-2">Track your earnings in ₹ (Indian Rupees)</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Revenue;
