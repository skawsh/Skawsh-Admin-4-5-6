
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  id: number;
  transactionId: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
}

interface StudioPaymentInfo {
  studioId: string;
  studioName: string;
  ownerName: string;
  pendingAmount: number;
  totalPaid: number;
  payments: Payment[];
}

const StudioPayments: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
          const studio = studios.find((s: any) => s.id === Number(id));
          
          if (studio) {
            // Mock payment data
            const mockPayments: Payment[] = [
              {
                id: 1,
                transactionId: 'TXN20240501001',
                amount: 1250,
                date: '2024-05-01T10:30:00',
                status: 'Completed'
              },
              {
                id: 2,
                transactionId: 'TXN20240505002',
                amount: 980,
                date: '2024-05-05T14:15:00',
                status: 'Completed'
              },
              {
                id: 3,
                transactionId: 'TXN20240508003',
                amount: 1450,
                date: '2024-05-08T09:45:00',
                status: 'Pending'
              },
              {
                id: 4,
                transactionId: 'TXN20240509004',
                amount: 875,
                date: '2024-05-09T16:20:00',
                status: 'Pending'
              }
            ];
            
            // Calculate totals
            const pendingAmount = mockPayments
              .filter(p => p.status === 'Pending')
              .reduce((sum, p) => sum + p.amount, 0);
              
            const totalPaid = mockPayments
              .filter(p => p.status === 'Completed')
              .reduce((sum, p) => sum + p.amount, 0);
            
            setStudioInfo({
              studioId: studio.studioId,
              studioName: studio.studioName,
              ownerName: studio.ownerName,
              pendingAmount,
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
  }, [id, navigate, toast]);

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

  if (loading) {
    return (
      <Layout activeSection="studios">
        <div className="flex items-center justify-center h-screen">
          <p>Loading payment details...</p>
        </div>
      </Layout>
    );
  }

  if (!studioInfo) {
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
  }

  const pendingPayments = studioInfo.payments.filter(p => p.status === 'Pending');
  const completedPayments = studioInfo.payments.filter(p => p.status === 'Completed');

  return (
    <Layout activeSection="studios">
      <div className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-blue-50 border-blue-100 shadow-sm">
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">Owner</p>
              <p className="text-lg font-medium">{studioInfo.ownerName}</p>
            </div>
          </Card>
          <Card className="p-6 bg-yellow-50 border-yellow-100 shadow-sm">
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold">₹{studioInfo.pendingAmount.toFixed(2)}</p>
            </div>
          </Card>
          <Card className="p-6 bg-green-50 border-green-100 shadow-sm">
            <div className="flex flex-col">
              <p className="text-gray-600 text-sm">Total Paid</p>
              <p className="text-2xl font-bold">₹{studioInfo.totalPaid.toFixed(2)}</p>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending Payments</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">S.NO</TableHead>
                      <TableHead>TRANSACTION ID</TableHead>
                      <TableHead>DATE & TIME</TableHead>
                      <TableHead className="text-right">AMOUNT (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.length > 0 ? (
                      pendingPayments.map((payment, index) => (
                        <TableRow key={payment.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{payment.transactionId}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell className="text-right font-medium">{payment.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="font-medium">No pending payments found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">S.NO</TableHead>
                      <TableHead>TRANSACTION ID</TableHead>
                      <TableHead>DATE & TIME</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">AMOUNT (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedPayments.length > 0 ? (
                      completedPayments.map((payment, index) => (
                        <TableRow key={payment.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{payment.transactionId}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium text-xs">
                              {payment.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">{payment.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="font-medium">No payment history found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default StudioPayments;
