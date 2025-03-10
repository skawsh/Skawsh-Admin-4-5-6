
import React from 'react';
import { Bell, Search } from 'lucide-react';

const TopBar: React.FC = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: undefined,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-laundry-blue focus:border-transparent transition-all"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Bell className="text-gray-600 cursor-pointer hover:text-laundry-blue transition-colors" size={20} />
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
            1
          </span>
        </div>
        <div className="text-gray-600 font-medium">
          Today: {formattedDate}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
