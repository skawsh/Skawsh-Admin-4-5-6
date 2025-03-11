
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  placeholder: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  placeholder, 
  onSearchChange, 
  onClearSearch 
}) => {
  return (
    <div className="relative w-full max-w-lg">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full pl-10 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-laundry-blue focus:border-transparent" 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button 
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
