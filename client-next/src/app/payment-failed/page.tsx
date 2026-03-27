'use client';

import { Suspense } from 'react';
import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import PaymentFailed from '@/components/screens/PaymentFailed';
import MobilePaymentFailed from '@/components/mobile/screens/MobilePaymentFailed';

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeviceSwitch
        mobile={<MobilePaymentFailed />}
        desktop={<PaymentFailed />}
      />
    </Suspense>
  );
}
