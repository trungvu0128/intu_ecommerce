'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * DeviceSwitch: renders mobile or desktop component based on viewport width.
 * Uses render-function props so only the active branch is ever instantiated.
 * This avoids mounting both components and triggering duplicate API calls.
 */
export function DeviceSwitch({
  mobile,
  desktop,
  breakpoint = 768,
}: {
  mobile: React.ReactNode | (() => React.ReactNode);
  desktop: React.ReactNode | (() => React.ReactNode);
  breakpoint?: number;
}) {
  const isMobile = useMediaQuery(`(max-width: ${breakpoint}px)`);

  // On first render (SSR / hydration), we don't know the viewport.
  // Default to desktop to avoid layout shift for the majority of users,
  // and useMediaQuery will correct on client mount.
  const active = isMobile ? mobile : desktop;
  return <>{typeof active === 'function' ? active() : active}</>;
}
