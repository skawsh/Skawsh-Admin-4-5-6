
import React from 'react';

const EmptyServicesState: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm flex justify-center items-center min-h-[300px]">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">No Services Added</h3>
        <p className="text-gray-500 mb-4">
          This studio doesn't have any services configured yet.
        </p>
      </div>
    </div>
  );
};

export default EmptyServicesState;
