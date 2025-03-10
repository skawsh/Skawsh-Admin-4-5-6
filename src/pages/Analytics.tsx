
import React from 'react';
import Layout from '../components/layout/Layout';

const Analytics: React.FC = () => {
  return (
    <Layout activeSection="analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance</p>
        </div>
        
        <div className="glass-card p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Analytics section is under development.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
