
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
  const { studioInfo: initialStudioInfo, loading, activeTab, setActiveTab, formatDate } = useStudioPayments(id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [paidPaymentIds, setPaidPaymentIds] = useState<number[]>([]);
  const { toast } = useToast();

  // Calculate the updated studioInfo with the correct pending amounts
  const studioInfo = useMemo(() => {
    if (!initialStudioInfo) return null;

    // Create a copy of the initial studio info that we'll update
    const updatedStudioInfo = { ...initialStudioInfo };

    // Filter out payments that have been marked as paid
    const actualPendingPayments = initialStudioInfo.payments.filter(p => 
      p.status === 'Pending' && !paidPaymentIds.includes(p.id)
    );

    // Recalculate pending amounts
    updatedStudioInfo.pendingAmount = actualPendingPayments.reduce((sum, p) => sum + p.amount, 0);
    
    updatedStudioInfo.standardWashPendingAmount = actualPendingPayments
      .filter(p => p.serviceType === 'Standard')
      .reduce((sum, p) => sum + p.amount, 0);
    
    updatedStudioInfo.expressWashPendingAmount = actualPendingPayments
      .filter(p => p.serviceType === 'Express')
      .reduce((sum, p) => sum + p.amount, 0);

    return updatedStudioInfo;
  }, [initialStudioInfo, paidPaymentIds]);

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
    
    // Update to take into account paidPaymentIds
    const pendingPayments = studioInfo.payments.filter(p => 
      p.status === 'Pending' && !paidPaymentIds.includes(p.id)
    );
    const completedPayments = studioInfo.payments.filter(p => 
      p.status === 'Completed' || paidPaymentIds.includes(p.id)
    );
    
    return {
      pending: filterPayments(pendingPayments),
      completed: filterPayments(completedPayments)
    };
  }, [studioInfo, searchTerm, paidPaymentIds]);

  const handleMarkSelectedAsPaid = () => {
    if (selectedPayments.length === 0) return;
    
    toast({
      title: "Payments Marked as Paid",
      description: `${selectedPayments.length} payments have been marked as paid successfully.`,
    });
    
    // Update the paidPaymentIds state to move payments to the "completed" list
    setPaidPaymentIds(prev => [...prev, ...selectedPayments]);
    
    // Clear the selection
    setSelectedPayments([]);
    
    // Switch to the history tab
    setActiveTab('history');
  };

  const handleMarkAsPaid = (paymentId: number) => {
    // Add the payment ID to the paid list
    setPaidPaymentIds(prev => [...prev, paymentId]);
    
    // If this payment was selected, remove it from the selection
    if (selectedPayments.includes(paymentId)) {
      setSelectedPayments(prev => prev.filter(id => id !== paymentId));
    }
    
    // Switch to the history tab
    setActiveTab('history');
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
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </Layout>
  );
};

export default StudioPayments;
