
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  serviceType: 'Standard' | 'Express';
  customerName?: string;
  deliveredDate?: string;
}

export interface StudioPaymentInfo {
  studioId: string;
  studioName: string;
  ownerName: string;
  pendingAmount: number;
  standardWashPendingAmount: number;
  expressWashPendingAmount: number;
  totalPaid: number;
  payments: Payment[];
}

export const useStudioPayments = (studioId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [studioInfo, setStudioInfo] = useState<StudioPaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudioAndPayments = () => {
      setLoading(true);
      try {
        const savedStudios = localStorage.getItem('laundryStudios');
        
        if (savedStudios) {
          const studios = JSON.parse(savedStudios);
          const studio = studios.find((s: any) => s.id === Number(studioId));
          
          if (studio) {
            // Mock payment data with updated order IDs and delivered dates
            const mockPayments: Payment[] = [
              {
                id: 1,
                transactionId: 'Ord-1001',
                amount: 1250,
                date: '2024-05-01T10:30:00',
                status: 'Completed',
                serviceType: 'Standard',
                customerName: 'John Doe',
                deliveredDate: '2024-05-12T14:30:00'
              },
              {
                id: 2,
                transactionId: 'Ord-1002',
                amount: 980,
                date: '2024-05-05T14:15:00',
                status: 'Completed',
                serviceType: 'Express',
                customerName: 'Jane Smith',
                deliveredDate: '2024-05-11T18:45:00'
              },
              {
                id: 3,
                transactionId: 'Ord-1003',
                amount: 1450,
                date: '2024-05-08T09:45:00',
                status: 'Pending',
                serviceType: 'Standard',
                customerName: 'Robert Johnson'
              },
              {
                id: 4,
                transactionId: 'Ord-1004',
                amount: 875,
                date: '2024-05-09T16:20:00',
                status: 'Pending',
                serviceType: 'Express',
                customerName: 'Emily Williams'
              }
            ];
            
            // Calculate totals
            const pendingAmount = mockPayments
              .filter(p => p.status === 'Pending')
              .reduce((sum, p) => sum + p.amount, 0);
              
            const standardWashPendingAmount = mockPayments
              .filter(p => p.status === 'Pending' && p.serviceType === 'Standard')
              .reduce((sum, p) => sum + p.amount, 0);
              
            const expressWashPendingAmount = mockPayments
              .filter(p => p.status === 'Pending' && p.serviceType === 'Express')
              .reduce((sum, p) => sum + p.amount, 0);
              
            const totalPaid = mockPayments
              .filter(p => p.status === 'Completed')
              .reduce((sum, p) => sum + p.amount, 0);
            
            setStudioInfo({
              studioId: studio.studioId,
              studioName: studio.studioName,
              ownerName: studio.ownerName,
              pendingAmount,
              standardWashPendingAmount,
              expressWashPendingAmount,
              totalPaid,
              payments: mockPayments
            });
          } else {
            toast({
              variant: "destructive",
              title: "Studio not found",
              description: "The requested studio could not be found"
            });
            navigate('/studios');
          }
        } else {
          toast({
            variant: "destructive",
            title: "No studios found",
            description: "No studios are available in the system"
          });
          navigate('/studios');
        }
      } catch (error) {
        console.error('Error fetching studio payment details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load studio payment details"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudioAndPayments();
  }, [studioId, navigate, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    studioInfo,
    loading,
    activeTab,
    setActiveTab,
    formatDate
  };
};
