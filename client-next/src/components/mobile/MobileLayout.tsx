'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import CartDrawer from '@/components/layout/CartDrawer';
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
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel — slides in from right */}
      <div
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: '80%', maxWidth: 320,
          background: '#fff',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 20px', height: 56, borderBottom: '1px solid #eaeaea', flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.15em' }}>MENU</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: '#000',
                textDecoration: 'none',
                padding: '16px 0',
                borderBottom: '1px solid #f8f8f8',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer links */}
        <div style={{ padding: '24px 28px 40px', borderTop: '1px solid #eaeaea' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/account" onClick={onClose}
              style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', textDecoration: 'none' }}>
              MY ACCOUNT
            </Link>
            <Link href="/orders" onClick={onClose}
              style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', textDecoration: 'none' }}>
              MY ORDERS
            </Link>
            <a href="mailto:intuoo@gmail.com"
              style={{ fontSize: 10, color: '#888', letterSpacing: '0.15em', textDecoration: 'none' }}>
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
  const [lastScrollY, setLastScrollY] = useState(0);
  const { getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setIsScrolled(false);
    setIsVisible(true);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsVisible(y < lastScrollY || y < 50);
      setIsScrolled(y > 20);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  const isTransparent = isHome && !isScrolled;
  const logo = isTransparent ? logoWhite : logoBlack;
  const iconColor = isTransparent ? '#ffffff' : '#000000';

  return (
    <header className={`mobile-header ${!isVisible ? 'hidden' : ''} ${isScrolled || !isHome ? 'scrolled' : ''}`}>
      {/* Logo — Left */}
      <Link href="/">
        <Image src={logo} alt="INTU∞" className="mobile-header__logo" priority />
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
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
