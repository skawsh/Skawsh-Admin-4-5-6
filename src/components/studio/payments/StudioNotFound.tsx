
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";

const StudioNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout activeSection="studios">
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl">Studio not found</p>
        <Button className="mt-4" onClick={() => navigate('/studios')}>
          Return to Studios
        </Button>
      </div>
    </Layout>
  );
};

export default StudioNotFound;
