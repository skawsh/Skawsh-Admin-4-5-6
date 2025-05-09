
import React from 'react';
import { Filter, Search, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudioFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  ratingFilter: string | null;
  setRatingFilter: (value: string | null) => void;
  resetFilters: () => void;
}

const StudioFilters: React.FC<StudioFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
  resetFilters
}) => {
  return (
    <div className="flex flex-wrap justify-between gap-4">
      <div className="flex items-center gap-3">
        <p className="text-gray-500">Filter by:</p>
        <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
          <SelectTrigger className="w-[120px]">
            <span className="flex items-center gap-2">
              <span>Status</span>
              <ChevronDown size={16} />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter || "all"} onValueChange={(value) => setRatingFilter(value === "all" ? null : value)}>
          <SelectTrigger className="w-[120px]">
            <span className="flex items-center gap-2">
              <span>Rating</span>
              <ChevronDown size={16} />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="above4.5">Above 4.5</SelectItem>
            <SelectItem value="4to4.5">4.0 - 4.5</SelectItem>
            <SelectItem value="below4">Below 4.0</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="bg-white" 
          onClick={resetFilters}
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search by studio ID, name, etc."
            className="pl-10 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioFilters;
