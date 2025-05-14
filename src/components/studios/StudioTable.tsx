
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  MoreHorizontal, 
  CreditCard,
  Settings,
  Package,
  Trash 
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import DeleteStudioDialog from './DeleteStudioDialog';
import DeleteSuccessDialog from './DeleteSuccessDialog';

interface Studio {
  id: number;
  studioId: string;
  studioName: string;
  ownerName: string;
  contact: string;
  services: number;
  rating: number;
  status: boolean;
}

interface StudioTableProps {
  studios: Studio[];
  handleStatusToggle: (studioId: number, newStatus: boolean) => void;
  onDelete: (studio: Studio) => void;
}

const StudioTable: React.FC<StudioTableProps> = ({ 
  studios, 
  handleStatusToggle,
  onDelete
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);
  const [deletedStudio, setDeletedStudio] = useState<Studio | null>(null);

  const handlePaymentsClick = (studio: Studio) => {
    navigate(`/studios/${studio.id}/payments`);
  };

  const handleViewEditStudioClick = (studio: Studio) => {
    navigate(`/studios/${studio.id}`);
  };

  const handleViewEditServicesClick = (studio: Studio) => {
    navigate(`/studios/${studio.id}/services`);
  };

  const handleViewAnalyticsClick = (studio: Studio) => {
    navigate(`/studios/${studio.id}/ratings`);
  };

  const openDeleteDialog = (studio: Studio) => {
    setStudioToDelete(studio);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setStudioToDelete(null);
  };

  const confirmDelete = () => {
    if (studioToDelete) {
      // Save the studio before deletion for possible undo
      setDeletedStudio(studioToDelete);
      // Close the confirmation dialog
      setDeleteDialogOpen(false);
      // Perform the delete
      onDelete(studioToDelete);
      // Open the success dialog
      setSuccessDialogOpen(true);
    }
  };

  const handleUndo = () => {
    if (deletedStudio) {
      // This is a mock implementation - in a real app, you'd restore from your data store
      // Get studios from localStorage
      const savedStudios = localStorage.getItem('laundryStudios');
      if (savedStudios) {
        const studios = JSON.parse(savedStudios);
        // Check if the studio is already in the list
        const studioExists = studios.some((s: Studio) => s.id === deletedStudio.id);
        if (!studioExists) {
          // Add the deleted studio back
          studios.push(deletedStudio);
          // Sort by id to maintain order
          studios.sort((a: Studio, b: Studio) => a.id - b.id);
          // Save back to localStorage
          localStorage.setItem('laundryStudios', JSON.stringify(studios));
          
          toast({
            title: "Studio Restored",
            description: `${deletedStudio.studioName} has been restored`,
          });
          
          // Close the success dialog
          setSuccessDialogOpen(false);
          // Force a refresh of the component
          window.location.reload();
        }
      }
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">S.NO</TableHead>
              <TableHead>STUDIO ID</TableHead>
              <TableHead>STUDIO NAME</TableHead>
              <TableHead>OWNER NAME</TableHead>
              <TableHead>PRIMARY CONTACT</TableHead>
              <TableHead>SERVICES</TableHead>
              <TableHead>RATING</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studios.length > 0 ? (
              studios.map((studio) => (
                <TableRow key={studio.id}>
                  <TableCell>{studio.id}</TableCell>
                  <TableCell>{studio.studioId}</TableCell>
                  <TableCell>{studio.studioName}</TableCell>
                  <TableCell>{studio.ownerName}</TableCell>
                  <TableCell>{studio.contact}</TableCell>
                  <TableCell>{studio.services}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {studio.rating.toFixed(1)}
                      <Star className="ml-1 text-yellow-500 fill-yellow-500" size={16} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={studio.status}
                      onCheckedChange={(checked) => handleStatusToggle(studio.id, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem 
                          onClick={() => handlePaymentsClick(studio)}
                          className="flex items-center gap-2 cursor-pointer py-2"
                        >
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <span>Payments</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => handleViewEditStudioClick(studio)}
                          className="flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span>View/Edit Studio Details</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => handleViewEditServicesClick(studio)}
                          className="flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Package className="h-4 w-4 text-gray-500" />
                          <span>View/Edit Services</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => handleViewAnalyticsClick(studio)}
                          className="flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Star className="h-4 w-4 text-gray-500" />
                          <span>View Ratings & Reviews</span>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(studio)}
                          className="flex items-center gap-2 cursor-pointer py-2 text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                          <span>Delete Studio</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="font-medium">No studios found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete confirmation dialog */}
      {studioToDelete && (
        <DeleteStudioDialog 
          isOpen={deleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={confirmDelete}
          studioName={studioToDelete.studioName}
        />
      )}
      
      {/* Success dialog with undo option */}
      {deletedStudio && (
        <DeleteSuccessDialog 
          isOpen={successDialogOpen}
          onClose={() => setSuccessDialogOpen(false)}
          onUndo={handleUndo}
          studioName={deletedStudio.studioName}
        />
      )}
    </>
  );
};

export default StudioTable;
