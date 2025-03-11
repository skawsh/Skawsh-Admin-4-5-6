
import React from 'react';
import { Package, Layers, Shirt } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'services', label: 'Services', icon: Package },
    { id: 'sub-services', label: 'Sub-services', icon: Layers },
    { id: 'clothing-items', label: 'Clothing Items', icon: Shirt }
  ];

  return (
    <div className="bg-white rounded-lg p-2 shadow-sm">
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === tab.id ? 'bg-white shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-50'
            }`} 
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon size={18} className={activeTab === tab.id ? 'text-laundry-blue' : 'text-gray-500'} />
            <span className={activeTab === tab.id ? 'font-medium' : ''}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
