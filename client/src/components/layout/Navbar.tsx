import { ShoppingBag, Search, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import LoginPopover from '@/components/auth/LoginPopover';
import CartDrawer from '@/components/layout/CartDrawer';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

import logoWhite from '../../assets/LOGO_white.png';
import logoBlack from '../../assets/LOGO_black.png';

import MenuDropdown from '@/components/layout/MenuDropdown';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const loginRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { getTotalItems, isCartOpen, setIsCartOpen } = useCartStore();

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Show navbar if scrolling up or at the very top
        if (currentScrollY < lastScrollY || currentScrollY < 50) {
          setIsVisible(true);
        } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
          // Hide navbar only after scrolling down a bit (100px) and scrolling down
          setIsVisible(false);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setIsLoginOpen(false);
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
        "fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 pointer-events-none transition-all duration-500",
        isHome ? "text-white" : "text-black bg-white/95 backdrop-blur-sm border-b border-black/5",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        {/* Left: Contact */}
        <div className={cn(
          "flex-1 pointer-events-auto"
        )}>
          <Link 
            to="/contact" 
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
          <Link to="/">
            <img src={isHome ? logoWhite : logoBlack} alt="AURA" className={cn("h-8 md:h-10", isHome && "mix-blend-difference")} />
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-6 pointer-events-auto">
          <button 
            className={cn(
              "hover:opacity-70 transition-opacity relative",
              isHome && "mix-blend-difference"
            )} 
            aria-label="Shopping Bag"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded-full px-1">
                {getTotalItems()}
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
            {isLoginOpen && <LoginPopover onClose={() => setIsLoginOpen(false)} />}
          </div>
          
          <button className={cn(
            "hover:opacity-70 transition-opacity",
            isHome && "mix-blend-difference"
          )} aria-label="Search">
            <Search size={18} strokeWidth={1.5} />
          </button>
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
            {isMenuOpen && <MenuDropdown />}
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;