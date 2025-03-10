
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Search, Plus, Package, Layers, Shirt } from 'lucide-react';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  
  const tabs = [
    { id: 'services', label: 'Services', icon: Package },
    { id: 'sub-services', label: 'Sub-services', icon: Layers },
    { id: 'clothing-items', label: 'Clothing Items', icon: Shirt }
  ];
  
  const services = [
    // Placeholder for services data
  ];

  return (
    <Layout activeSection="services">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage all laundry services, subservices, and clothing items</p>
          </div>
          <button className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white font-medium py-2 px-4 rounded-md transition-colors">
            <Plus size={18} />
            <span>Add Service</span>
          </button>
        </div>

        <div className="flex bg-laundry-gray-light rounded-lg p-1 max-w-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-laundry-blue focus:border-transparent"
          />
        </div>
        
        <div className="glass-card p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No services found. Try adjusting your search.</p>
            <button className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white font-medium py-2 px-4 rounded-md transition-colors mx-auto">
              <Plus size={18} />
              <span>Add Service</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
