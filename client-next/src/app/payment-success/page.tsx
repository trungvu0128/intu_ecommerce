import PaymentSuccess from '@/components/screens/PaymentSuccess';
import { Suspense } from 'react';

export const metadata = {
  title: 'INTU∞ | Order Successful',
  description: 'Order successful.',
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
