'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileContact from '@/components/mobile/screens/MobileContact';

export function ContactPageSwitch({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileContact />;
  }

  return <>{children}</>;
}
