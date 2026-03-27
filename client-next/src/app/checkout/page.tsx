'use client';

import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Checkout from '@/components/screens/Checkout';
import MobileCheckout from '@/components/mobile/screens/MobileCheckout';

export default function CheckoutPage() {
  return (
    <DeviceSwitch
      mobile={<MobileCheckout />}
      desktop={<Checkout />}
    />
  );
}
