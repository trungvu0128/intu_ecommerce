'use client';

import { Suspense } from 'react';
import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Shop from '@/components/screens/Shop';
import MobileShop from '@/components/mobile/screens/MobileShop';

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeviceSwitch
        mobile={() => <MobileShop />}
        desktop={() => <Shop />}
      />
    </Suspense>
  );
}
