'use client';

import { X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, getTotalPrice } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/\./g, "").replace(/[^0-9.-]+/g, ""))
      : price;

    return (
      <span>
        {numericPrice.toLocaleString('vi-VN')}.<sup className="text-[0.65em] font-medium">VNĐ</sup>
      </span>
    );
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] transition-opacity duration-300 pointer-events-none",
        isOpen ? "bg-black/40 opacity-100 pointer-events-auto" : "opacity-0"
      )}
    >
      <div
        ref={drawerRef}
        className={cn(
          "absolute left-0 w-full bg-white shadow-[0_-4px_30px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out transform",
          "inset-0 md:inset-auto md:bottom-0",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:opacity-70 transition-opacity z-10"
          aria-label="Close cart"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {items.length === 0 ? (
          /* Empty state */
          <div className="py-16 flex flex-col items-center justify-center text-zinc-400 space-y-4">
            <p className="text-sm tracking-widest uppercase">Your bag is empty</p>
            <button
              onClick={onClose}
              className="text-xs font-medium underline tracking-widest uppercase hover:text-black transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items — horizontal scroll */}
            <div className="px-6 md:px-12 pt-10 pb-12 overflow-x-auto cart-scrollbar">
              <div className="flex gap-12 md:gap-16">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 md:gap-6 shrink-0 min-w-[280px] md:min-w-[400px] max-w-[500px]">
                    {/* Product Image */}
                    <div className="group relative w-[140px] h-[180px] md:w-[220px] md:h-[260px] bg-[#F2F2F2] shrink-0 overflow-hidden cursor-pointer">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className={cn(
                          "object-cover transition-all duration-700 ease-in-out group-hover:scale-105",
                          item.image2 && "group-hover:opacity-0"
                        )}
                        sizes="(max-width: 768px) 200px, 220px"
                      />
                      {item.image2 && (
                        <Image
                          src={item.image2}
                          alt={`${item.name} secondary view`}
                          fill
                          className="object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out scale-110 group-hover:scale-105"
                          sizes="(max-width: 768px) 200px, 220px"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-2 justify-start pt-2 min-w-0">
                      <h3 className="text-[14px] font-medium tracking-[0.02em] uppercase leading-tight text-black">
                        {item.name}
                      </h3>
                      <p className="text-[13px] tracking-[0.02em] text-black mt-1">
                        Sizes: 1
                      </p>
                      <p className="text-[13px] tracking-[0.02em] text-black">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] tracking-[0.03em] text-zinc-500 hover:text-black transition-colors text-left mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-4 md:px-12 py-6 md:py-8 bg-white border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4 pb-safe md:pb-8">
              <span className="text-[18px] md:text-[20px] font-normal tracking-[0.02em] uppercase text-black">
                SUBTOTAL: {formatPrice(getTotalPrice())}
              </span>
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="border border-black bg-white px-8 py-3 text-[12px] font-medium tracking-[0.05em] uppercase text-black hover:bg-zinc-50 transition-colors"
                >
                  VIEW BAG
                </button>
                <button
                  onClick={handleCheckout}
                  className="border border-black bg-[#EAEAEA] text-black px-8 py-3 text-[12px] font-medium tracking-[0.05em] uppercase hover:bg-[#D5D5D5] transition-colors duration-200"
                >
                  CHECK OUT
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
