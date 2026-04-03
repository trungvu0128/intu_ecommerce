'use client';

import { useState, useEffect } from 'react';

/**
 * DeviceSwitch: renders mobile or desktop component based on viewport width.
 * Uses render-function props so only the active branch is ever instantiated.
 *
 * IMPORTANT: To avoid hydration mismatch, we always render `desktop` on the
 * first render (which matches what SSR produces). Only after the component has
 * mounted on the client do we check the real viewport width and potentially
 * switch to `mobile`.
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
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mql.matches);
    setMounted(true);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  // Before mount, always render desktop to match SSR output exactly.
  const active = mounted && isMobile ? mobile : desktop;
  return <>{typeof active === 'function' ? active() : active}</>;
}
