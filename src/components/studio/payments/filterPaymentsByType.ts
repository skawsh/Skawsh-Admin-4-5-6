
import { Payment } from '@/hooks/useStudioPayments';

export const filterPaymentsByType = (payments: Payment[], tabValue: string) => {
  if (tabValue === "all") return payments;
  return payments.filter(payment => 
    payment.serviceType.toLowerCase() === tabValue.toLowerCase().replace(" wash", "")
  );
};

export default filterPaymentsByType;
