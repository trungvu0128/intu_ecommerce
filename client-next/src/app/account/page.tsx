'use client';

import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Account from '@/components/screens/Account';
import MobileAccount from '@/components/mobile/screens/MobileAccount';

export default function AccountPage() {
  return (
    <DeviceSwitch
      mobile={() => <MobileAccount />}
      desktop={() => <Account />}
    />
  );
}
