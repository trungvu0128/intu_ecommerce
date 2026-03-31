'use client';

import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Addresses from '@/components/screens/Addresses';
import MobileAddresses from '@/components/mobile/screens/MobileAddresses';

export default function AddressesPage() {
  return (
    <DeviceSwitch
      mobile={() => <MobileAddresses />}
      desktop={() => <Addresses />}
    />
  );
}
