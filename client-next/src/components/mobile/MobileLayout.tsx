'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Home, Grid3X3, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import logoBlack from '@/assets/LOGO_black.png';
import '@/components/mobile/mobile.css';

/* ─── Mobile Header ─── */
export function MobileHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsVisible(y < lastScrollY || y < 50);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  return (
    <header className={`mobile-header ${!isVisible ? 'hidden' : ''}`}>
      <Link href="/shop">
        <button className="mobile-header__btn" aria-label="Search">
          <Search size={20} strokeWidth={1.5} />
        </button>
      </Link>
      <Link href="/">
        <Image src={logoBlack} alt="INTU∞" className="mobile-header__logo" priority />
      </Link>
      <div className="mobile-header__actions">
        <Link href="/checkout">
          <button className="mobile-header__btn" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {mounted && getTotalItems() > 0 && (
              <span className="mobile-header__badge">{getTotalItems()}</span>
            )}
          </button>
        </Link>
      </div>
    </header>
  );
}

/* ─── Mobile Bottom Navigation ─── */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const tabs = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: Grid3X3, label: 'Shop' },
    { href: '/checkout', icon: ShoppingBag, label: 'Cart' },
    { href: '/account', icon: User, label: 'Account' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map(tab => (
        <Link key={tab.href} href={tab.href} className={`mobile-bottom-nav__item ${isActive(tab.href) ? 'active' : ''}`}>
          <span className="mobile-bottom-nav__icon">
            <tab.icon size={22} strokeWidth={1.5} />
            {tab.href === '/checkout' && mounted && getTotalItems() > 0 && (
              <span className="mobile-bottom-nav__badge">{getTotalItems()}</span>
            )}
          </span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}

/* ─── Mobile Layout Shell ─── */
export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-shell">
      <MobileHeader />
      <main>{children}</main>
      <MobileBottomNav />
    </div>
  );
}
