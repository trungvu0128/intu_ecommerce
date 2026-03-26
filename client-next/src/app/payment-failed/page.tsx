import PaymentFailed from '@/components/screens/PaymentFailed';
import { Suspense } from 'react';

export const metadata = {
  title: 'INTU∞ | Payment Failed',
  description: 'Payment failed.',
};

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailed />
    </Suspense>
  );
}
