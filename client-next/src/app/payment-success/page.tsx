'use client';

import { Suspense } from 'react';
import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import PaymentSuccess from '@/components/screens/PaymentSuccess';
import MobilePaymentSuccess from '@/components/mobile/screens/MobilePaymentSuccess';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeviceSwitch
        mobile={<MobilePaymentSuccess />}
        desktop={<PaymentSuccess />}
      />
    </Suspense>
  );
}
