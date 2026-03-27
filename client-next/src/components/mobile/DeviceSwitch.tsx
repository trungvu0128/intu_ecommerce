'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * DeviceSwitch: renders mobile or desktop component based on viewport width.
 * Completely hides one version from the other — no responsive CSS tricks.
 */
export function DeviceSwitch({
  mobile,
  desktop,
  breakpoint = 768,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  breakpoint?: number;
}) {
  const isMobile = useMediaQuery(`(max-width: ${breakpoint}px)`);

  // On first render (SSR / hydration), we don't know the viewport.
  // Default to desktop to avoid layout shift for the majority of users,
  // and useMediaQuery will correct on client mount.
  return <>{isMobile ? mobile : desktop}</>;
}
