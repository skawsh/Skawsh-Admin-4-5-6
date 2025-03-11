
import { useState } from 'react';

export const useServicesTabs = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getTabInfo = () => {
    switch (activeTab) {
      case 'sub-services':
        return {
          title: 'Sub-services Management',
          description: 'Manage all sub-services for your laundry business',
          searchPlaceholder: 'Search sub-services...',
          addButtonText: 'Add Sub-service'
        };
      case 'clothing-items':
        return {
          title: 'Clothing Items Management',
          description: 'Manage all clothing items for your laundry services',
          searchPlaceholder: 'Search clothing items...',
          addButtonText: 'Add Clothing Item'
        };
      default:
        return {
          title: 'Services Management',
          description: 'Manage all laundry services, subservices, and clothing items',
          searchPlaceholder: 'Search services...',
          addButtonText: 'Add Service'
        };
    }
  };

  return {
    activeTab,
    searchTerm,
    setSearchTerm,
    handleTabChange,
    clearSearch,
    getTabInfo
  };
};
