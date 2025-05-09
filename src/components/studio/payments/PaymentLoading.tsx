
import React from 'react';
import Layout from '@/components/layout/Layout';

const PaymentLoading: React.FC = () => {
  return (
    <Layout activeSection="studios">
      <div className="flex items-center justify-center h-screen">
        <p>Loading payment details...</p>
      </div>
    </Layout>
  );
};

export default PaymentLoading;
