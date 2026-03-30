'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileAbout from '@/components/mobile/screens/MobileAbout';

export function AboutPageSwitch({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileAbout />;
  }

  return <>{children}</>;
}
