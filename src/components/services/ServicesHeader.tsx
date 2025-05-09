
import React from 'react';
import SearchBar from './SearchBar';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';

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
  showMarkAsPaidButton?: boolean;
  onMarkAsPaid?: () => void;
  markAsPaidDisabled?: boolean;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  title,
  description,
  searchPlaceholder,
  searchTerm,
  onSearchChange,
  onClearSearch,
  showMarkAsPaidButton = false,
  onMarkAsPaid,
  markAsPaidDisabled = true
}) => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
      
      <div className="flex justify-between items-center gap-4">
        <SearchBar 
          searchTerm={searchTerm}
          placeholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
        />
        
        {showMarkAsPaidButton && (
          <Button 
            variant="primary"
            className="bg-green-400 hover:bg-green-500 text-white"
            onClick={onMarkAsPaid}
            disabled={markAsPaidDisabled}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            Mark Selected as Paid
          </Button>
        )}
      </div>
    </>
  );
};

export default ServicesHeader;
