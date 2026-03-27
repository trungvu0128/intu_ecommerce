'use client';

import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Home from '@/components/screens/Home';
import MobileHome from '@/components/mobile/screens/MobileHome';

export default function HomePage() {
  return (
    <DeviceSwitch
      mobile={<MobileHome />}
      desktop={<Home />}
    />
  );
}
