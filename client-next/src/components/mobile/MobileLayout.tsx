'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import CartDrawer from '@/components/layout/CartDrawer';
import MobileCartDrawer from '@/components/layout/MobileCartDrawer';
import MobileFooter from '@/components/mobile/MobileFooter';
import logoBlack from '@/assets/LOGO_black.png';
import logoWhite from '@/assets/LOGO_white.png';
import '@/components/mobile/mobile.css';

const NAV_LINKS = [
  { label: 'SHOP', href: '/shop' },
  { label: 'CAMPAIGN', href: '/campaign' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
];

/* ─── Full-Screen Menu Drawer ─── */
function MenuDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Panel — slides in from right */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderBottom: '1px solid #f5f5f5', flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>MENU</span>
          <button
            onClick={onClose}
            style={{ 
              background: '#f5f5f5', 
              border: 'none', 
              borderRadius: '50%',
              cursor: 'pointer', 
              display: 'flex', 
              padding: 8,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {NAV_LINKS.map((link, index) => (
            <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: '#000',
                textDecoration: 'none',
                padding: '20px 0',
                borderBottom: index !== NAV_LINKS.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}
            >
              <span>{link.label}</span>
              <span style={{ fontSize: 18, color: '#999' }}>→</span>
            </Link>
          ))}
        </nav>

        {/* Footer links */}
        <div style={{ padding: '24px 20px 40px', borderTop: '1px solid #f5f5f5' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/account" onClick={onClose}
              style={{ 
                fontSize: 14, 
                color: '#666', 
                letterSpacing: '0.05em', 
                textDecoration: 'none',
                fontWeight: 500
              }}>
              My Account
            </Link>
            <Link href="/orders" onClick={onClose}
              style={{ 
                fontSize: 14, 
                color: '#666', 
                letterSpacing: '0.05em', 
                textDecoration: 'none',
                fontWeight: 500
              }}>
              My Orders
            </Link>
            <a href="mailto:intuoo@gmail.com"
              style={{ 
                fontSize: 14, 
                color: '#666', 
                letterSpacing: '0.05em', 
                textDecoration: 'none',
                fontWeight: 500
              }}>
              intuoo@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile Header ─── */
export function MobileHeader({
  onCartOpen,
  onMenuOpen,
}: {
  onCartOpen: () => void;
  onMenuOpen: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const { getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setIsScrolled(false);
    setIsVisible(true);
    lastScrollYRef.current = 0;
  }, [pathname]);

  useEffect(() => {
    // Set initial state based on current scroll position (e.g. after fast refresh or back-nav)
    const initialY = window.scrollY;
    setIsScrolled(initialY > 20);
    lastScrollYRef.current = initialY;

    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastScrollYRef.current;
      setIsVisible(y < prev || y < 50);
      setIsScrolled(y > 20);
      lastScrollYRef.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparent = isHome && !isScrolled;
  const logo = isTransparent ? logoWhite : logoBlack;
  const iconColor = isTransparent ? '#ffffff' : '#000000';

  return (
    <header className={`mobile-header ${!isVisible ? 'hidden' : ''} ${isScrolled || !isHome ? 'scrolled' : ''}`}>
      {/* Logo — Left */}
      <Link href="/">
        <img 
          src={logo.src} 
          alt="INTU∞" 
          width={logo.width}
          height={logo.height}
          className="mobile-header__logo" 
          fetchPriority="high" 
        />
      </Link>

      {/* Icons — Right */}
      <div className="mobile-header__right" style={{ color: iconColor }}>
        <Link href="/shop" style={{ color: iconColor }}>
          <button className="mobile-header__btn" aria-label="Search" style={{ color: iconColor }}>
            <Search size={20} strokeWidth={1.2} />
          </button>
        </Link>
        <Link href="/account" style={{ color: iconColor }}>
          <button className="mobile-header__btn" aria-label="Account" style={{ color: iconColor }}>
            <User size={20} strokeWidth={1.2} />
          </button>
        </Link>
        <button className="mobile-header__btn" aria-label="Cart" onClick={onCartOpen} style={{ color: iconColor }}>
          <ShoppingBag size={20} strokeWidth={1.2} />
          {mounted && getTotalItems() > 0 && (
            <span
              className="mobile-header__badge"
              style={{
                background: isTransparent ? '#fff' : '#000',
                color: isTransparent ? '#000' : '#fff',
              }}
            >
              {getTotalItems()}
            </span>
          )}
        </button>
        <button className="mobile-header__btn" aria-label="Menu" onClick={onMenuOpen} style={{ color: iconColor }}>
          <Menu size={22} strokeWidth={1.2} />
        </button>
      </div>
    </header>
  );
}

/* ─── Mobile Layout Shell ─── */
export default function MobileLayout({
  children,
  heroPage = false,
  showFooter = true,
}: {
  children: React.ReactNode;
  heroPage?: boolean;
  showFooter?: boolean;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mobile-shell">
      <MobileHeader
        onCartOpen={() => setIsCartOpen(true)}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
      <main className={heroPage ? 'hero-page' : ''}>
        {children}
      </main>
      {showFooter && <MobileFooter />}
      <MobileCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
