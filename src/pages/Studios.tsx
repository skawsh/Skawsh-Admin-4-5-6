
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { MapPin, Phone, Users, Clock, Search, Plus } from 'lucide-react';

const Studios: React.FC = () => {
  const [activeStudio, setActiveStudio] = useState<number | null>(1);

  const studios = [
    {
      id: 1,
      name: 'Downtown Studio',
      address: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      staff: 8,
      hours: '7AM - 10PM',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Westside Studio',
      address: '456 Elm St, Westside',
      phone: '(555) 234-5678',
      staff: 6,
      hours: '8AM - 9PM',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Northside Studio',
      address: '789 Oak St, Northside',
      phone: '(555) 345-6789',
      staff: 7,
      hours: '7AM - 9PM',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Eastside Studio',
      address: '321 Pine St, Eastside',
      phone: '(555) 456-7890',
      staff: 5,
      hours: '8AM - 8PM',
      status: 'Maintenance'
    }
  ];

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Studios</h1>
            <p className="text-gray-600 mt-1">Manage your laundry locations</p>
          </div>
          <button className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white font-medium py-2 px-4 rounded-md transition-colors">
            <Plus size={18} />
            <span>Add Studio</span>
          </button>
        </div>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search studios..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-laundry-blue focus:border-transparent"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {studios.map((studio) => (
              <div
                key={studio.id}
                className={`glass-card p-5 cursor-pointer transition-all ${
                  activeStudio === studio.id 
                    ? 'ring-2 ring-laundry-blue shadow-md' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveStudio(studio.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{studio.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    studio.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {studio.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{studio.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{studio.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {activeStudio && (
            <div className="lg:col-span-2 glass-card p-6 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">
                {studios.find(s => s.id === activeStudio)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Users size={16} />
                    <span className="text-sm">Staff Members</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {studios.find(s => s.id === activeStudio)?.staff}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock size={16} />
                    <span className="text-sm">Hours</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {studios.find(s => s.id === activeStudio)?.hours}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Phone size={16} />
                    <span className="text-sm">Contact</span>
                  </div>
                  <p className="text-lg font-medium">
                    {studios.find(s => s.id === activeStudio)?.phone}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance</h3>
                <div className="space-y-2">
                  {['Orders Processed', 'Customer Satisfaction', 'Average Processing Time'].map((metric) => (
                    <div key={metric} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{metric}</span>
                        <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-laundry-blue h-2 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Studios;
