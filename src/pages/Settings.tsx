
import React from 'react';
import Layout from '../components/layout/Layout';

const Settings: React.FC = () => {
  return (
    <Layout activeSection="settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your application preferences</p>
        </div>
        
        <div className="glass-card p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Settings section is under development.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
