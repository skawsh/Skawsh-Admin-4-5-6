
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrderNotFoundProps {
  handleGoBack: () => void;
}

const OrderNotFound: React.FC<OrderNotFoundProps> = ({ handleGoBack }) => {
  return (
    <Card className="p-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Order Not Found</h3>
        <p className="text-gray-500 mt-2">The order you're looking for doesn't exist or has been removed.</p>
        <Button 
          className="mt-4" 
          onClick={handleGoBack}
        >
          Go Back
        </Button>
      </div>
    </Card>
  );
};

export default OrderNotFound;
