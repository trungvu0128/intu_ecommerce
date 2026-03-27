'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';

export default function MobilePaymentSuccess() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';

  return (
    <MobileLayout>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
        minHeight: '60dvh',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: '#d1fae5',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        }}>
          <CheckCircle size={40} color="#22c55e" strokeWidth={1.5} />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: 14, color: '#666', margin: '0 0 8px' }}>
          Thank you for your purchase
        </p>
        {orderNumber && (
          <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 32px', color: '#111' }}>
            Order #{orderNumber}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
          <Link href="/orders" className="mobile-btn mobile-btn--primary" style={{ textDecoration: 'none' }}>
            View My Orders
          </Link>
          <Link href="/shop" className="mobile-btn mobile-btn--secondary" style={{ textDecoration: 'none' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}
