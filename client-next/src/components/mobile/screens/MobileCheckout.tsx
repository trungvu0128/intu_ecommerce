'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, Banknote, QrCode } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { OrderService, PaymentService } from '@/lib/api';
import { PaymentMethod } from '@/types';

export default function MobileCheckout() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', apartment: '',
    city: '', state: '', postcode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('qr');

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (items.length === 0) { setError('Cart is empty'); return; }
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address || !form.city) {
      setError('Please fill out all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      let mapped = PaymentMethod.COD;
      if (paymentMethod === 'online') mapped = PaymentMethod.CreditCard;
      if (paymentMethod === 'qr') mapped = PaymentMethod.BankTransfer;

      const orderResponse = await OrderService.create({
        userId: user ? user.id : null,
        guestItems: items.map(item => ({ productVariantId: item.id, quantity: item.quantity })),
        shippingAddressId: '00000000-0000-0000-0000-000000000000',
        recipientName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phoneNumber: form.phone,
        street: form.apartment ? `${form.apartment}, ${form.address}` : form.address,
        city: form.city,
        state: form.state,
        zipCode: form.postcode || '',
        country: 'Vietnam',
        couponCode: null,
        paymentMethod: mapped,
      });

      clearCart();

      if (mapped === PaymentMethod.BankTransfer && paymentMethod === 'qr') {
        const paymentData = await PaymentService.getCheckoutUrl({
          paymentMethod: '',
          orderInvoiceNumber: orderResponse.orderNumber,
          orderAmount: orderResponse.totalAmount,
          orderDescription: `Payment for Order ${orderResponse.orderNumber}`,
          successUrl: `${window.location.origin}/payment-success?orderNumber=${orderResponse.orderNumber}`,
          errorUrl: `${window.location.origin}/payment-failed?orderNumber=${orderResponse.orderNumber}`,
          cancelUrl: `${window.location.origin}/checkout`,
        });

        if (paymentData.checkoutUrl && paymentData.fields) {
          const formEl = document.createElement('form');
          formEl.method = 'POST';
          formEl.action = paymentData.checkoutUrl;
          const orderedKeys = ['merchant', 'operation', 'payment_method', 'order_amount', 'currency', 'order_invoice_number', 'order_description', 'customer_id', 'success_url', 'error_url', 'cancel_url', 'signature'];
          orderedKeys.forEach(key => {
            if (paymentData.fields[key] != null && paymentData.fields[key] !== '') {
              const input = document.createElement('input');
              input.type = 'hidden'; input.name = key; input.value = paymentData.fields[key] as string;
              formEl.appendChild(input);
            }
          });
          document.body.appendChild(formEl);
          formEl.submit();
          return;
        }
      }

      router.push(`/payment-success?orderNumber=${orderResponse.orderNumber}`);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return <MobileLayout><div /></MobileLayout>;

  const totalPrice = getTotalPrice();

  const inputStyle = (field: string) => ({
    width: '100%', height: 48, padding: '0 16px',
    border: `1px solid ${!form[field as keyof typeof form] ? '#e5e5e5' : '#111'}`,
    borderRadius: 12, fontSize: 15, background: '#fff', outline: 'none',
    boxSizing: 'border-box' as const,
  });

  return (
    <MobileLayout>
      {/* Header */}
      <div style={{ padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Checkout</h1>
      </div>

      {/* Error */}
      {error && (
        <div style={{ margin: '12px 16px', padding: 12, background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Contact Info */}
      <div style={{ padding: '20px 16px 0' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input style={inputStyle('firstName')} placeholder="First name *" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} />
            <input style={inputStyle('lastName')} placeholder="Last name *" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} />
          </div>
          <input style={inputStyle('email')} placeholder="Email *" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} />
          <input style={inputStyle('phone')} placeholder="Phone *" type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
        </div>
      </div>

      {/* Delivery */}
      <div style={{ padding: '24px 16px 0' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input style={inputStyle('address')} placeholder="Address *" value={form.address} onChange={e => handleChange('address', e.target.value)} />
          <input style={inputStyle('apartment')} placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={e => handleChange('apartment', e.target.value)} />
          <div style={{ display: 'flex', gap: 10 }}>
            <input style={inputStyle('city')} placeholder="City *" value={form.city} onChange={e => handleChange('city', e.target.value)} />
            <input style={inputStyle('state')} placeholder="Province" value={form.state} onChange={e => handleChange('state', e.target.value)} />
          </div>
          <input style={inputStyle('postcode')} placeholder="Postcode / ZIP" value={form.postcode} onChange={e => handleChange('postcode', e.target.value)} />
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ padding: '24px 16px 0' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</h2>
        {[
          { key: 'qr', label: 'QR Bank Transfer', icon: QrCode, desc: 'Pay via SePay QR code' },
          { key: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
          { key: 'online', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard' },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setPaymentMethod(m.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', padding: '14px 16px', marginBottom: 8,
              border: `1.5px solid ${paymentMethod === m.key ? '#111' : '#e5e5e5'}`,
              borderRadius: 12, background: paymentMethod === m.key ? '#fafafa' : '#fff',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <m.icon size={20} strokeWidth={1.5} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{m.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Order Summary */}
      <div style={{ padding: '24px 16px' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Order Summary ({items.length} items)
        </h2>
        {items.map(item => {
          let numericPrice = 0;
          if (typeof item.price === 'number') numericPrice = item.price;
          else if (typeof item.price === 'string') numericPrice = parseFloat(item.price.replace(/[^0-9]/g, ''));

          return (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
              <span style={{ color: '#444' }}>{item.name} × {item.quantity}</span>
              <span style={{ fontWeight: 600 }}>{new Intl.NumberFormat('vi-VN').format(numericPrice * item.quantity)}₫</span>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: 16 }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span style={{ fontWeight: 700 }}>{new Intl.NumberFormat('vi-VN').format(totalPrice)}₫</span>
        </div>
      </div>

      {/* Submit */}
      <div style={{ padding: '0 16px 32px' }}>
        <button
          className="mobile-btn mobile-btn--primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.6 : 1 }}
        >
          {isSubmitting ? 'Processing...' : `Place Order • ${new Intl.NumberFormat('vi-VN').format(totalPrice)}₫`}
        </button>
      </div>

      <div style={{ height: 40 }} />
    </MobileLayout>
  );
}
