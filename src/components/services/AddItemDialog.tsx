
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { ClothingItem } from "@/types/services";

interface ClothingCategory {
  id: string;
  category: string;
  standardPrice: string;
  expressPrice: string;
}

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  clothingItems: ClothingItem[];
  selectedItems: string[];
  onSave: (selectedItems: string[]) => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onOpenChange,
  clothingItems,
  selectedItems,
  onSave
}) => {
  const [categories, setCategories] = useState<ClothingCategory[]>([
    {
      id: Date.now().toString(),
      category: "",
      standardPrice: "",
      expressPrice: ""
    }
  ]);

  const handleAddCategory = () => {
    setCategories([
      ...categories,
      {
        id: Date.now().toString(),
        category: "",
        standardPrice: "",
        expressPrice: ""
      }
    ]);
  };

  const handleRemoveCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  const handleCategoryChange = (id: string, field: keyof ClothingCategory, value: string) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, [field]: value } : category
    ));
  };

  const handleSave = () => {
    // Here you would normally process the categories
    // For now, we'll just close the dialog and pass back the existing selected items
    onSave(selectedItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Clothing Categories</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {categories.map((category, index) => (
            <div key={category.id} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-base font-medium">
                  Clothing Category
                </label>
                <Select 
                  value={category.category} 
                  onValueChange={(value) => handleCategoryChange(category.id, 'category', value)}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clothingItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-base font-medium">
                  Standard Price
                </label>
                <Input 
                  placeholder="Price (Standard)" 
                  value={category.standardPrice} 
                  onChange={(e) => handleCategoryChange(category.id, 'standardPrice', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-base font-medium">
                  Express Price
                </label>
                <Input 
                  placeholder="Price (Express)" 
                  value={category.expressPrice} 
                  onChange={(e) => handleCategoryChange(category.id, 'expressPrice', e.target.value)}
                />
              </div>

              <div className="flex justify-end md:col-span-2">
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => handleRemoveCategory(category.id)}
                  disabled={categories.length <= 1 && index === 0}
                  className="w-24"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <Button 
            type="button" 
            variant="secondary" 
            className="bg-blue-600 text-white hover:bg-blue-700 w-full md:w-auto"
            onClick={handleAddCategory}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <DialogFooter className="flex justify-between sm:justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
