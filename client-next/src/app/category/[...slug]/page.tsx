'use client';

import { use } from 'react';
import { DeviceSwitch } from '@/components/mobile/DeviceSwitch';
import Category from '@/components/screens/Category';
import MobileShop from '@/components/mobile/screens/MobileShop';

export default function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = use(params);
  return (
    <DeviceSwitch
      mobile={<MobileShop />}
      desktop={<Category slug={slug} />}
    />
  );
}
