'use client';

import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Register from '@/components/screens/Register';
import MobileRegister from '@/components/mobile/screens/MobileRegister';

export default function RegisterPage() {
  return (
    <DeviceSwitch
      mobile={() => <MobileRegister />}
      desktop={() => <Register />}
    />
  );
}
