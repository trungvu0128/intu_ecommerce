'use client';

import { useState, useEffect } from 'react';
import MobileProductDetail from '@/components/mobile/screens/MobileProductDetail';

/**
 * Client-side wrapper that either renders the mobile product detail
 * or falls through to let the server-rendered desktop version show.
 * 
 * IMPORTANT: Always render children (desktop) on first render to match SSR.
 * Only switch to mobile after mount to avoid hydration mismatch.
 */
export function ProductPageSwitch({ id, children }: { id: string; children: React.ReactNode }) {
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
    return <MobileProductDetail slug={id} />;
  }

  return <>{children}</>;
}
