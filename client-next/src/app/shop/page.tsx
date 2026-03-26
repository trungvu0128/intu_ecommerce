import Shop from '@/components/screens/Shop';
import { Suspense } from 'react';

export const metadata = {
  title: 'INTU∞ | Shop',
  description: 'Shop the latest collection from INTU∞.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Shop />
    </Suspense>
  );
}
