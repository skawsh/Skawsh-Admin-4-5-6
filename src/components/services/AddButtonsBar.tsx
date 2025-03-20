
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface AddButtonsBarProps {
  activeTab: string;
  onAddButtonClick: () => void;
  addButtonText: string;
}

const AddButtonsBar: React.FC<AddButtonsBarProps> = ({
  activeTab,
  onAddButtonClick,
  addButtonText
}) => {
  return (
    <div className="flex justify-end mb-4">
      <Button 
        className="flex items-center gap-2 bg-gradient-to-r from-laundry-blue to-blue-600 hover:from-blue-600 hover:to-laundry-blue text-white shadow-md transition-all duration-300 rounded-md"
        onClick={onAddButtonClick}
      >
        <Plus size={18} className="animate-pulse" />
        <span>{addButtonText}</span>
      </Button>
    </div>
  );
};

export default AddButtonsBar;
