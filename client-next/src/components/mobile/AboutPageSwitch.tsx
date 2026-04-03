'use client';

import { useState, useEffect } from 'react';
import MobileAbout from '@/components/mobile/screens/MobileAbout';

export function AboutPageSwitch({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    setMounted(true);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (mounted && isMobile) {
    return <MobileAbout />;
  }

  return <>{children}</>;
}
