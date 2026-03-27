'use client';

import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Orders from '@/components/screens/Orders';
import MobileOrders from '@/components/mobile/screens/MobileOrders';

export default function OrdersPage() {
  return (
    <DeviceSwitch
      mobile={<MobileOrders />}
      desktop={<Orders />}
    />
  );
}
