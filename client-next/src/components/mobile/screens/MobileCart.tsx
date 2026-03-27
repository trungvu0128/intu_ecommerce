'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { useCartStore } from '@/store/useCartStore';

export default function MobileCart() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <MobileLayout>
        <div style={{ padding: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="mobile-skeleton" style={{ height: 100, marginBottom: 12 }} />
          ))}
        </div>
      </MobileLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MobileLayout>
        <div className="mobile-empty">
          <ShoppingBag size={56} strokeWidth={1} className="mobile-empty__icon" />
          <h3 className="mobile-empty__title">Your cart is empty</h3>
          <p className="mobile-empty__text">Add some items to get started</p>
          <Link href="/shop" className="mobile-btn mobile-btn--primary" style={{ width: 'auto', padding: '0 32px', marginTop: 20, textDecoration: 'none' }}>
            Start Shopping
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <MobileLayout>
      <div style={{ padding: '8px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Cart ({items.length})</h1>
          <button
            onClick={clearCart}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            Clear all
          </button>
        </div>

        {/* Cart Items */}
        {items.map(item => {
          let numericPrice = 0;
          if (typeof item.price === 'number') numericPrice = item.price;
          else if (typeof item.price === 'string') numericPrice = parseFloat(item.price.replace(/[^0-9]/g, ''));

          return (
            <div
              key={item.id}
              style={{
                display: 'flex', gap: 12, padding: '16px 0',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              {/* Image */}
              <Link href={item.slug ? `/product/${item.slug}` : '#'} style={{ flexShrink: 0 }}>
                <div style={{ width: 90, height: 120, borderRadius: 8, overflow: 'hidden', background: '#f8f8f8' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 11 }}>
                      No image
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: '4px 0 0', color: '#111' }}>
                    {new Intl.NumberFormat('vi-VN').format(numericPrice)}₫
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Stepper */}
                  <div className="mobile-stepper">
                    <button className="mobile-stepper__btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span className="mobile-stepper__value">{item.quantity}</span>
                    <button className="mobile-stepper__btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: 8 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary + CTA */}
      <div className="mobile-sticky-bar" style={{ flexDirection: 'column', gap: 12, padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 15 }}>
          <span style={{ fontWeight: 500 }}>Total</span>
          <span style={{ fontWeight: 700 }}>{new Intl.NumberFormat('vi-VN').format(totalPrice)}₫</span>
        </div>
        <Link href="/checkout" className="mobile-btn mobile-btn--primary" style={{ textDecoration: 'none' }}>
          Proceed to Checkout
        </Link>
      </div>

      <div style={{ height: 100 }} />
    </MobileLayout>
  );
}
