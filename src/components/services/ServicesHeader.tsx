
import React from 'react';
import SearchBar from './SearchBar';

interface ServicesHeaderProps {
  activeTab: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  addButtonText: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onAddButtonClick: () => void;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  title,
  description,
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  onClearSearch
}) => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <SearchBar 
          searchTerm={searchTerm}
          placeholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
        />
      </div>
    </>
  );
};

export default ServicesHeader;
