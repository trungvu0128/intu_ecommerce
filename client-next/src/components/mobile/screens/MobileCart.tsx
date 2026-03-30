'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function MobileCart() {
  const router = useRouter();
  const { items, removeItem, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'string'
      ? parseFloat(price.replace(/\./g, '').replace(/[^0-9.-]+/g, ''))
      : price;
    return isNaN(num) ? '0₫' : `${num.toLocaleString('vi-VN')}₫`;
  };

  if (!mounted) {
    return (
      <div style={{ backgroundColor: '#fff', minHeight: '100dvh' }}>
        <div style={{ padding: 20 }}>
          {[1, 2].map(i => (
            <div key={i} className="mobile-skeleton" style={{ height: 220, marginBottom: 16 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── Top Bar ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        padding: '0 20px',
        borderBottom: '1px solid #eaeaea',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          YOUR BAG
        </span>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          aria-label="Close"
        >
          <X size={20} strokeWidth={1} />
        </button>
      </div>

      {/* ── Body ── */}
      {items.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase', margin: 0 }}>
            Your bag is empty
          </p>
          <Link
            href="/shop"
            style={{ fontSize: 11, letterSpacing: '0.1em', textDecoration: 'underline', color: '#000', textTransform: 'uppercase' }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Horizontal scroll — matches desktop CartDrawer */}
          <div style={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '32px 20px 24px',
            WebkitOverflowScrolling: 'touch' as any,
          }}>
            <div style={{ display: 'flex', gap: 24, height: '100%' }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 16, flexShrink: 0, width: 280 }}>
                  {/* Product Image — 3:4 */}
                  <div style={{ width: 140, flexShrink: 0, aspectRatio: '3/4', backgroundColor: '#f2f2f2', overflow: 'hidden' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#ccc' }}>
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, flex: 1 }}>
                    <h3 style={{ fontSize: 12, fontWeight: 500, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.4 }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: 12, margin: 0, letterSpacing: '0.03em', color: '#111' }}>
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        fontSize: 10, color: '#999', textDecoration: 'underline',
                        textAlign: 'left', cursor: 'pointer', letterSpacing: '0.05em',
                        marginTop: 4, width: 'fit-content',
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div style={{
            borderTop: '1px solid #eaeaea',
            padding: '20px 20px 40px',
            backgroundColor: '#fff',
            flexShrink: 0,
          }}>
            {/* Subtotal row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                SUBTOTAL
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.03em' }}>
                {formatPrice(getTotalPrice())}
              </span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <Link
                href="/cart"
                style={{
                  flex: 1, display: 'block',
                  border: '1px solid #000', backgroundColor: '#fff', color: '#000',
                  fontSize: 11, fontWeight: 600, padding: '16px 0',
                  textAlign: 'center', letterSpacing: '0.1em',
                  textDecoration: 'none', textTransform: 'uppercase',
                }}
              >
                VIEW BAG
              </Link>
              <Link
                href="/checkout"
                style={{
                  flex: 1, display: 'block',
                  border: '1px solid #000', backgroundColor: '#eaeaea', color: '#000',
                  fontSize: 11, fontWeight: 600, padding: '16px 0',
                  textAlign: 'center', letterSpacing: '0.1em',
                  textDecoration: 'none', textTransform: 'uppercase',
                }}
              >
                CHECK OUT
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
