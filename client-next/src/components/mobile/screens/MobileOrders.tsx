'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, ChevronUp, Package } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { OrderService } from '@/lib/api';
import type { Order, OrderStatus } from '@/types';

const statusLabels: Record<number, string> = {
  0: 'Pending', 1: 'Paid', 2: 'Failed', 3: 'Shipped', 4: 'Delivered', 5: 'Cancelled', 6: 'Processing',
};

const statusClasses: Record<number, string> = {
  0: 'mobile-status-badge--pending',
  1: 'mobile-status-badge--paid',
  2: 'mobile-status-badge--cancelled',
  3: 'mobile-status-badge--shipped',
  4: 'mobile-status-badge--delivered',
  5: 'mobile-status-badge--cancelled',
  6: 'mobile-status-badge--pending',
};

export default function MobileOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!mounted) return <MobileLayout><div /></MobileLayout>;

  if (!user) {
    return (
      <MobileLayout>
        <div className="mobile-empty">
          <Package size={48} className="mobile-empty__icon" />
          <h3 className="mobile-empty__title">Sign in to view orders</h3>
          <Link href="/account" className="mobile-btn mobile-btn--primary" style={{ width: 'auto', padding: '0 32px', marginTop: 16, textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>My Orders</h1>
      </div>

      {isLoading ? (
        <div style={{ padding: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="mobile-skeleton" style={{ height: 80, marginBottom: 12, borderRadius: 12 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mobile-empty">
          <Package size={48} className="mobile-empty__icon" />
          <h3 className="mobile-empty__title">No orders yet</h3>
          <p className="mobile-empty__text">Start shopping to see your orders here</p>
          <Link href="/shop" className="mobile-btn mobile-btn--primary" style={{ width: 'auto', padding: '0 32px', marginTop: 16, textDecoration: 'none' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ padding: '16px' }}>
          {orders.map(order => {
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} style={{ border: '1px solid #e5e5e5', borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
                {/* Order Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    width: '100%', padding: '14px 16px', border: 'none', background: '#fafafa',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>#{order.orderNumber}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`mobile-status-badge ${statusClasses[order.status] || ''}`}>
                      {statusLabels[order.status] || 'Unknown'}
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Order Details */}
                {isExpanded && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e5e5' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, borderBottom: '1px solid #f5f5f5' }}>
                        <span style={{ color: '#444' }}>{item.productName} × {item.quantity}</span>
                        <span style={{ fontWeight: 500 }}>{new Intl.NumberFormat('vi-VN').format(item.total)}₫</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: 15, fontWeight: 700 }}>
                      <span>Total</span>
                      <span>{new Intl.NumberFormat('vi-VN').format(order.totalAmount)}₫</span>
                    </div>
                    {order.shippingAddress && (
                      <div style={{ fontSize: 12, color: '#999', marginTop: 8, padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        📦 {order.shippingAddress}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: 20 }} />
    </MobileLayout>
  );
}
