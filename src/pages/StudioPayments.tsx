
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useStudioPayments } from '@/hooks/useStudioPayments';
import StudioPaymentHeader from '@/components/studio/payments/StudioPaymentHeader';
import PaymentSummaryCards from '@/components/studio/payments/PaymentSummaryCards';
import PaymentTables from '@/components/studio/payments/PaymentTables';
import PaymentLoading from '@/components/studio/payments/PaymentLoading';
import StudioNotFound from '@/components/studio/payments/StudioNotFound';

const StudioPayments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { studioInfo, loading, activeTab, setActiveTab, formatDate } = useStudioPayments(id);

  if (loading) {
    return <PaymentLoading />;
  }

  if (!studioInfo) {
    return <StudioNotFound />;
  }

  const pendingPayments = studioInfo.payments.filter(p => p.status === 'Pending');
  const completedPayments = studioInfo.payments.filter(p => p.status === 'Completed');

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <StudioPaymentHeader studioInfo={studioInfo} />
        <PaymentSummaryCards studioInfo={studioInfo} />
        <PaymentTables 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          pendingPayments={pendingPayments}
          completedPayments={completedPayments}
          formatDate={formatDate}
        />
      </div>
    </Layout>
  );
};

export default StudioPayments;
