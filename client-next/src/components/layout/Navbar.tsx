'use client';

import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import logoWhite from '@/assets/LOGO_white.png';
import logoBlack from '@/assets/LOGO_black.png';

// Lazy-load heavy components that aren't needed at first paint
const LoginPopover = lazy(() => import('@/components/auth/LoginPopover'));
const SearchPopover = lazy(() => import('@/components/layout/SearchPopover'));
const CartDrawer = lazy(() => import('@/components/layout/CartDrawer'));
const MobileCartDrawer = lazy(() => import('@/components/layout/MobileCartDrawer'));
const MenuDropdown = lazy(() => import('@/components/layout/MenuDropdown'));

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const loginRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const totalItems = useCartStore(s => s.items.reduce((a, i) => a + i.quantity, 0));

  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  const lastScrollYRef = useRef(0);

  const controlNavbar = useCallback(() => {
    const currentScrollY = window.scrollY;
    const prev = lastScrollYRef.current;
    
    if (currentScrollY < prev || currentScrollY < 50) {
      setIsVisible(true);
    } else if (currentScrollY > 100 && currentScrollY > prev) {
      setIsVisible(false);
    }
    
    lastScrollYRef.current = currentScrollY;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [controlNavbar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setIsLoginOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 lg:px-20 py-4 md:py-8 pointer-events-none transition-all duration-500",
        isHome ? "text-white" : "text-black bg-white/95 backdrop-blur-sm border-b border-black/5",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        {/* Left: Contact */}
        <div className={cn(
          "flex-1 pointer-events-auto"
        )}>
          <Link 
            href="/contact" 
            className={cn(
              "text-xs tracking-wider font-medium hover:opacity-70 transition-opacity flex items-center gap-1",
              isHome && "mix-blend-difference"
            )}
          >
            <span>+</span> CONTACT US
          </Link>
        </div>

        {/* Center: Logo */}
        <div className={cn(
          "flex-1 flex justify-center pointer-events-auto"
        )}>
          <Link href="/">
            <Image 
              src={isHome ? logoWhite : logoBlack} 
              alt="INTU" 
              className={cn("h-[25px] w-auto", isHome && "mix-blend-difference")} 
              priority
            />
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-6 md:gap-8 lg:gap-[40px] pointer-events-auto">
          <button 
            className={cn(
              "hover:opacity-70 transition-opacity relative",
              isHome && "mix-blend-difference"
            )} 
            aria-label="Shopping Bag"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded-full px-1">
                {totalItems}
              </span>
            )}
          </button>
          <div className="relative" ref={loginRef}>
            <button 
              className={cn(
                "hover:opacity-70 transition-opacity block",
                isHome && "mix-blend-difference"
              )}
              aria-label="Account"
              onClick={() => setIsLoginOpen(!isLoginOpen)}
            >
              <User size={18} strokeWidth={1.5} />
            </button>
            {isLoginOpen && (
              <Suspense fallback={null}>
                <LoginPopover onClose={() => setIsLoginOpen(false)} />
              </Suspense>
            )}
          </div>
          
          <div className="relative" ref={searchRef}>
            <button 
              className={cn(
                "hover:opacity-70 transition-opacity",
                isHome && "mix-blend-difference"
              )} 
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            {isSearchOpen && (
              <Suspense fallback={null}>
                <SearchPopover onClose={() => setIsSearchOpen(false)} />
              </Suspense>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              className={cn(
                "hover:opacity-70 transition-opacity flex items-center gap-2",
                isHome && "mix-blend-difference"
              )}
              aria-label="Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={18} strokeWidth={1.5} />
              <span className="text-[10px] tracking-widest hidden md:inline-block">MENU</span>
            </button>
            {isMenuOpen && (
              <Suspense fallback={null}>
                <MenuDropdown />
              </Suspense>
            )}
          </div>
        </div>
      </nav>
      <Suspense fallback={null}>
        {isMobile ? (
          <MobileCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        ) : (
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        )}
      </Suspense>
    </>
  );
};

export default Navbar;
