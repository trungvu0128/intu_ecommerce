'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { OrderService } from '@/lib/api';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types';
import {
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  ShoppingBag,
  CreditCard,
  MapPin,
  ReceiptText,
  Settings2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AccountSidebar from '@/components/account/AccountSidebar';
import logoBlack from '@/assets/LOGO_black.png';

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN') + ' VND';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusConfig: Record<
  number,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  [OrderStatus.Pending]: { label: 'Chờ xử lý', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200', icon: Clock },
  [OrderStatus.Processing]: { label: 'Đang xử lý', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', icon: Settings2 },
  [OrderStatus.Shipped]: { label: 'Đang giao', color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', icon: Truck },
  [OrderStatus.Delivered]: { label: 'Đã giao', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', icon: CheckCircle2 },
  [OrderStatus.Cancelled]: { label: 'Đã huỷ', color: 'text-red-500', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
};

const paymentStatusLabel: Record<number, string> = {
  [PaymentStatus.Pending]: 'Chưa thanh toán',
  [PaymentStatus.Completed]: 'Đã thanh toán',
  [PaymentStatus.Failed]: 'Thanh toán thất bại',
  [PaymentStatus.Refunded]: 'Đã hoàn tiền',
};

const paymentMethodLabel: Record<number, string> = {
  [PaymentMethod.COD]: 'COD',
  [PaymentMethod.CreditCard]: 'Credit Card',
  [PaymentMethod.BankTransfer]: 'Bank Transfer',
};

type FilterTab = 'all' | 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipping', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'cancelled', label: 'Đã huỷ' },
];

const filterToStatus: Record<FilterTab, OrderStatus | null> = {
  all: null,
  pending: OrderStatus.Pending,
  processing: OrderStatus.Processing,
  shipping: OrderStatus.Shipped,
  delivered: OrderStatus.Delivered,
  cancelled: OrderStatus.Cancelled,
};

function parseShippingAddress(raw: string) {
  try {
    const obj = JSON.parse(raw);
    return {
      recipientName: obj.RecipientName || obj.recipientName,
      phoneNumber: obj.PhoneNumber || obj.phoneNumber,
      street: obj.Street || obj.street,
      city: obj.City || obj.city,
      country: obj.Country || obj.country,
    };
  } catch {
    return null;
  }
}

const OrderCard = ({ order, onCancel, isCancelling }: { order: Order; onCancel: (id: string) => void; isCancelling: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[order.status] ?? statusConfig[OrderStatus.Pending];
  const StatusIcon = cfg.icon;
  const address = parseShippingAddress(order.shippingAddress);

  return (
    <div className={`bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-zinc-100 overflow-hidden ${expanded ? 'ring-1 ring-black/5' : ''}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 press-feedback"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
            <Package size={16} className="text-zinc-600" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[12px] font-semibold text-black tracking-wide truncate">{order.orderNumber}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${cfg.bgColor} ${cfg.color}`}>
            <StatusIcon size={10} />
            {cfg.label}
          </span>
          {expanded ? <ChevronUp size={14} className="text-zinc-400" /> : <ChevronDown size={14} className="text-zinc-400" />}
        </div>
      </button>

      <div className={`transition-all duration-300 overflow-hidden ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-zinc-100 px-4 py-4 space-y-4">
          {/* Items */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500 mb-2">Sản phẩm</h4>
            <div className="space-y-2.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 py-1.5 border-b border-zinc-50 last:border-b-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 bg-zinc-100 rounded-lg shrink-0 flex items-center justify-center">
                      <ShoppingBag size={14} className="text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-black truncate">{item.productName}</p>
                      <p className="text-[9px] text-zinc-400 uppercase tracking-wide mt-0.5">SL: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-black shrink-0">{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-3">
            <div className="bg-zinc-50 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={13} className="text-zinc-500" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">Thanh toán</span>
              </div>
              <p className="text-[11px] text-black font-medium">{order.paymentMethod != null ? paymentMethodLabel[order.paymentMethod] : '—'}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{paymentStatusLabel[order.paymentStatus] ?? 'N/A'}</p>
            </div>

            {address && (
              <div className="bg-zinc-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={13} className="text-zinc-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">Địa chỉ</span>
                </div>
                <p className="text-[11px] text-black font-medium">{address.recipientName}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{[address.street, address.city, address.country].filter(Boolean).join(', ')}</p>
              </div>
            )}

            <div className="bg-zinc-50 rounded-xl p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <ReceiptText size={13} className="text-zinc-500" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">Chi tiết</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between"><span className="text-zinc-500">Tạm tính</span><span className="text-black">{formatPrice(order.subTotal)}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Phí ship</span><span className="text-black">{order.shippingCost === 0 ? 'Miễn phí' : formatPrice(order.shippingCost)}</span></div>
                {order.discountAmount > 0 && <div className="flex justify-between"><span className="text-zinc-500">Giảm giá</span><span className="text-red-500">-{formatPrice(order.discountAmount)}</span></div>}
                <div className="flex justify-between font-bold text-[11px] pt-1 border-t border-zinc-200"><span>Tổng</span><span>{formatPrice(order.totalAmount)}</span></div>
              </div>
            </div>
          </div>

          {order.status === OrderStatus.Pending && (
            <div className="flex justify-end pt-1">
              <button
                onClick={(e) => { e.stopPropagation(); onCancel(order.id); }}
                disabled={isCancelling}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] border border-red-200 text-red-600 rounded-lg press-feedback disabled:opacity-50"
              >
                {isCancelling ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                Huỷ đơn hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ filter }: { filter: FilterTab }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
    <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-5">
      <ShoppingBag size={32} className="text-zinc-300" />
    </div>
    <h3 className="text-base font-semibold text-black mb-1">
      {filter === 'all' ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng nào'}
    </h3>
    <p className="text-sm text-zinc-400 max-w-xs">
      {filter === 'all' ? 'Bạn chưa đặt hàng lần nào.' : 'Không tìm thấy đơn hàng.'}
    </p>
  </div>
);

const Orders = () => {
  const { user, token } = useAuthStore();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !token) { router.push('/'); return; }

    const fetchOrders = async () => {
      setIsLoading(true); setError(null);
      try {
        const data = await OrderService.getMyOrders();
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError('Không thể tải đơn hàng.');
      } finally { setIsLoading(false); }
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const target = filterToStatus[activeFilter];
    if (target === null) return orders;
    return orders.filter((o) => o.status === target);
  }, [orders, activeFilter]);

  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = { all: orders.length, pending: 0, processing: 0, shipping: 0, delivered: 0, cancelled: 0 };
    for (const o of orders) {
      if (o.status === OrderStatus.Pending) counts.pending++;
      else if (o.status === OrderStatus.Processing) counts.processing++;
      else if (o.status === OrderStatus.Shipped) counts.shipping++;
      else if (o.status === OrderStatus.Delivered) counts.delivered++;
      else if (o.status === OrderStatus.Cancelled) counts.cancelled++;
    }
    return counts;
  }, [orders]);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) return;
    setCancellingId(orderId);
    try {
      await OrderService.cancelOrder(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: OrderStatus.Cancelled } : o)));
    } catch (err) {
      alert('Huỷ đơn hàng thất bại.');
    } finally { setCancellingId(null); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <header className="w-full bg-white h-[71px] flex items-center border-b border-gray-100 shrink-0">
          <div className="w-full max-w-[1240px] mx-auto px-6">
            <Link href="/">
              <Image src={logoBlack} alt="INTU" className="h-[18px] w-auto object-contain" />
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="text-black animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <header className="w-full bg-white h-[71px] flex items-center border-b border-gray-100 shrink-0">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <Link href="/">
            <Image src={logoBlack} alt="INTU" className="h-[18px] w-auto object-contain" />
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <AccountSidebar activeTab="orders" />

          {/* RIGHT CONTENT */}
          <div className="flex-1 w-full max-w-[858px]">
            <h1 className="text-[20px] font-bold text-black mb-6 tracking-wide">
              Lịch sử đơn hàng
            </h1>

        {/* Filter Tabs */}
        <div className="mb-4 -mx-4 px-4 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-medium transition-all whitespace-nowrap press-feedback ${
                  activeFilter === tab.key ? 'bg-black text-white shadow-md' : 'bg-white text-zinc-600 border border-zinc-200'
                }`}
              >
                {tab.label}
                {tabCounts[tab.key] > 0 && (
                  <span className={`inline-flex items-center justify-center min-w-[16px] h-[16px] rounded-full text-[9px] font-bold px-1 ${
                    activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {tabCounts[tab.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => (
              <div key={order.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <OrderCard order={order} onCancel={handleCancel} isCancelling={cancellingId === order.id} />
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
