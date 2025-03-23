
import React from 'react';

interface FeedbackTabsProps {
  activeTab: 'feedback' | 'reportedStudios';
  setActiveTab: (tab: 'feedback' | 'reportedStudios') => void;
  reportedStudiosCount: number;
}

export const FeedbackTabs: React.FC<FeedbackTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  reportedStudiosCount 
}) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`py-2 px-4 font-medium text-sm ${
          activeTab === 'feedback' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('feedback')}
      >
        User Feedback
      </button>
      <button
        className={`py-2 px-4 font-medium text-sm flex items-center ${
          activeTab === 'reportedStudios' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('reportedStudios')}
      >
        <span>Reported Studios</span>
        <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
          {reportedStudiosCount}
        </span>
      </button>
    </div>
  );
};
