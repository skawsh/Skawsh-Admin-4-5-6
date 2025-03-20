
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
        className="flex items-center gap-2 bg-laundry-blue hover:bg-laundry-blue-dark text-white"
        onClick={onAddButtonClick}
      >
        <Plus size={18} />
        <span>{addButtonText}</span>
      </Button>
    </div>
  );
};

export default AddButtonsBar;
