
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { StudioPaymentInfo } from '@/hooks/useStudioPayments';

interface StudioPaymentHeaderProps {
  studioInfo: StudioPaymentInfo;
}

const StudioPaymentHeader: React.FC<StudioPaymentHeaderProps> = ({ studioInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between sticky top-0 z-10 bg-white pb-4 border-b">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/studios')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{studioInfo.studioName} - Payments</h1>
          <p className="text-gray-600">ID: {studioInfo.studioId}</p>
        </div>
      </div>
    </div>
  );
};

export default StudioPaymentHeader;
