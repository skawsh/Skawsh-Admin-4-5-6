
/**
 * Function to determine badge color based on payment status
 */
export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'Failed':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};
