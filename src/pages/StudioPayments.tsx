
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useStudioPayments } from '@/hooks/useStudioPayments';
import StudioPaymentHeader from '@/components/studio/payments/StudioPaymentHeader';
import PaymentSummaryCards from '@/components/studio/payments/PaymentSummaryCards';
import PaymentTables from '@/components/studio/payments/PaymentTables';
import PaymentLoading from '@/components/studio/payments/PaymentLoading';
import StudioNotFound from '@/components/studio/payments/StudioNotFound';
import { useToast } from '@/hooks/use-toast';

const StudioPayments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { studioInfo, loading, activeTab, setActiveTab, formatDate } = useStudioPayments(id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const { toast } = useToast();

  const filteredPayments = useMemo(() => {
    if (!studioInfo) return { pending: [], completed: [] };
    
    const filterPayments = (payments: any[]) => {
      if (!searchTerm.trim()) return payments;
      
      const term = searchTerm.toLowerCase().trim();
      return payments.filter((payment) => 
        payment.transactionId.toLowerCase().includes(term) || 
        payment.serviceType.toLowerCase().includes(term) || 
        payment.amount.toString().includes(term) || 
        (payment.customerName && payment.customerName.toLowerCase().includes(term))
      );
    };
    
    const pendingPayments = studioInfo.payments.filter(p => p.status === 'Pending');
    const completedPayments = studioInfo.payments.filter(p => p.status === 'Completed');
    
    return {
      pending: filterPayments(pendingPayments),
      completed: filterPayments(completedPayments)
    };
  }, [studioInfo, searchTerm]);

  const handleMarkSelectedAsPaid = () => {
    if (selectedPayments.length === 0) return;
    
    toast({
      title: "Payments Marked as Paid",
      description: `${selectedPayments.length} payments have been marked as paid successfully.`,
    });
    
    // In a real application, this is where you would update the payment status in the database
    // For this demo, we just clear the selection
    setSelectedPayments([]);
  };

  if (loading) {
    return <PaymentLoading />;
  }

  if (!studioInfo) {
    return <StudioNotFound />;
  }

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
        <StudioPaymentHeader 
          studioInfo={studioInfo} 
        />
        <PaymentSummaryCards studioInfo={studioInfo} />
        <PaymentTables 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          pendingPayments={filteredPayments.pending}
          completedPayments={filteredPayments.completed}
          formatDate={formatDate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPayments={selectedPayments}
          setSelectedPayments={setSelectedPayments}
          onMarkSelectedAsPaid={handleMarkSelectedAsPaid}
        />
      </div>
    </Layout>
  );
};

export default StudioPayments;
