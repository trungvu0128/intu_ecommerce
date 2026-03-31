'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileCartDrawer = ({ isOpen, onClose }: MobileCartDrawerProps) => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string'
      ? parseFloat(price.replace(/\./g, '').replace(/[^0-9.-]+/g, ''))
      : price;
    return isNaN(num) ? '0₫' : `${num.toLocaleString('vi-VN')}₫`;
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[150] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-0 bg-white z-[151]',
          'transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold tracking-wide uppercase">
                Your Bag
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} strokeWidth={1} className="text-zinc-300" />
              </div>
              <p className="text-sm text-zinc-500 mb-2">Your bag is empty</p>
              <button
                onClick={() => {
                  onClose();
                  router.push('/shop');
                }}
                className="text-sm font-semibold text-black underline tracking-wide"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'bg-white rounded-2xl border border-zinc-100 overflow-hidden',
                        'transition-all duration-200'
                      )}
                    >
                      <div className="flex gap-3 p-3">
                        <div
                          className="relative w-24 h-32 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            onClose();
                            if (item.slug) router.push(`/product/${item.slug}`);
                          }}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>

                        <div className="flex-1 flex flex-col min-w-0">
                          <h3
                            className="text-xs font-medium text-black leading-tight line-clamp-2 mb-1 cursor-pointer"
                            onClick={() => {
                              onClose();
                              if (item.slug) router.push(`/product/${item.slug}`);
                            }}
                          >
                            {item.name}
                          </h3>

                          <p className="text-sm font-semibold text-black mb-2">
                            {formatPrice(item.price)}
                          </p>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-zinc-50 rounded-lg p-1">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-zinc-200 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} strokeWidth={2} />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-zinc-200 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} strokeWidth={2} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors group"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} strokeWidth={1.5} className="text-zinc-400 group-hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-100 bg-white px-4 py-4 pb-safe">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">Subtotal</span>
                    <span className="text-base font-semibold text-black">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Shipping & taxes calculated at checkout</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        router.push('/cart');
                      }}
                      className="flex-1 py-3.5 px-4 border border-black bg-white text-black text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      View Bag
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 py-3.5 px-4 bg-black text-white text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-zinc-800 transition-colors active:scale-[0.98]"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileCartDrawer;
