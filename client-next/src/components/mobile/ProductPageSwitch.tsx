'use client';

import { use } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileProductDetail from '@/components/mobile/screens/MobileProductDetail';

/**
 * Client-side wrapper that either renders the mobile product detail
 * or falls through to let the server-rendered desktop version show.
 * The desktop version is passed in as children from the server component.
 */
export function ProductPageSwitch({ id, children }: { id: string; children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileProductDetail slug={id} />;
  }

  return <>{children}</>;
}
