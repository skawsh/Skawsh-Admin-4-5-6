
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Search, Plus, ArrowLeft, Package, Layers, Shirt } from 'lucide-react';

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
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Services Management</h1>
            <p className="text-gray-500">Manage all laundry services, subservices, and clothing items</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2 shadow-sm">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm border border-gray-100' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-laundry-blue' : 'text-gray-500'} />
                <span className={activeTab === tab.id ? 'font-medium' : ''}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-laundry-blue focus:border-transparent"
            />
          </div>
          
          <button className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white font-medium py-2 px-4 rounded-md transition-colors">
            <Plus size={18} />
            <span>Add Service</span>
          </button>
        </div>
        
        <div className="bg-white p-8 min-h-[300px] rounded-lg border border-gray-100 shadow-sm flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No services found. Try adjusting your search.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
