'use client';

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentMethods from "@/components/checkout/PaymentMethods";
import OrderSummary from "@/components/checkout/OrderSummary";
import logoBlack from "@/assets/LOGO_black.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { OrderService, PaymentService } from "@/lib/api";
import { PaymentMethod } from "@/types";

const Checkout = () => {
  const router = useRouter();
  const items = useCartStore(s => s.items);
  const clearCart = useCartStore(s => s.clearCart);
  const getTotalPrice = useCartStore(s => s.getTotalPrice);
  const user = useAuthStore(s => s.user);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    state: "",
    postcode: "",
  });

  const [selectedMethod, setSelectedMethod] = useState("qr");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError("Please fill out all required contact and delivery fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      let mappedPaymentMethod = PaymentMethod.COD;
      if (selectedMethod === 'online') mappedPaymentMethod = PaymentMethod.CreditCard;
      if (selectedMethod === 'qr') mappedPaymentMethod = PaymentMethod.BankTransfer;

      // Make the API request
      const orderResponse = await OrderService.create({
        userId: user ? user.id : null,
        guestItems: items.map(item => ({
          productVariantId: item.id,
          quantity: item.quantity
        })),
        shippingAddressId: "00000000-0000-0000-0000-000000000000",
        recipientName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phoneNumber: formData.phone,
        street: formData.apartment ? `${formData.apartment}, ${formData.address}` : formData.address,
        city: formData.city,
        state: formData.state || formData.region,
        zipCode: formData.postcode || "",
        country: "Vietnam",
        couponCode: discountCode || null,
        paymentMethod: mappedPaymentMethod
      });

      // Clear cart on success
      clearCart();

      // Handle actual payment integration
      if (mappedPaymentMethod === PaymentMethod.BankTransfer && selectedMethod === 'qr') {
        const paymentData = await PaymentService.getCheckoutUrl({
          paymentMethod: '',
          orderInvoiceNumber: orderResponse.orderNumber,
          orderAmount: orderResponse.totalAmount,
          orderDescription: `Payment for Order ${orderResponse.orderNumber}`,
          successUrl: `${window.location.origin}/payment-success?orderNumber=${orderResponse.orderNumber}`,
          errorUrl: `${window.location.origin}/payment-failed?orderNumber=${orderResponse.orderNumber}`,
          cancelUrl: `${window.location.origin}/checkout`
        });

        if (paymentData.checkoutUrl && paymentData.fields) {
          // SePay requires a POST form submission to checkout/init
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = paymentData.checkoutUrl;

          // Append all hidden fields strictly in required order
          const orderedKeys = [
            'merchant', 'operation', 'payment_method', 'order_amount', 'currency', 
            'order_invoice_number', 'order_description', 'customer_id', 
            'success_url', 'error_url', 'cancel_url', 'signature'
          ];

          orderedKeys.forEach((key) => {
            if (paymentData.fields[key] !== undefined && paymentData.fields[key] !== null && paymentData.fields[key] !== '') {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = paymentData.fields[key] as string;
              form.appendChild(input);
            }
          });

          document.body.appendChild(form);
          form.submit();
          return;
        }
      }

      router.push(`/payment-success?orderNumber=${orderResponse.orderNumber}`);
      
    } catch (err: any) {
      setError(err?.message || "Something went wrong during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getTotalPrice();
  const shipping = items.length > 0 ? 45000 : 0;
  const total = subtotal - discountAmount + shipping;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 w-full pt-20 lg:pt-32 pb-20 px-0 lg:px-6 xl:px-10">
          {/* Skeleton or empty state to match server render */}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full pt-20 lg:pt-32 pb-20 px-0 lg:px-6 xl:px-10">
        <div className="max-w-[1024px] mx-auto w-full">
          {/* Mobile toggle for order summary */}
          <div className="lg:hidden w-full border-y border-zinc-200 bg-zinc-50 mb-6">
            <button 
              onClick={() => setShowSummary(!showSummary)}
              className="w-full flex justify-between items-center px-6 py-4"
            >
              <span className="text-[12px] tracking-[0.05em] flex gap-2 items-center text-black font-medium">
                <svg width="18" height="19" viewBox="0 0 20 20" fill="none" className={`text-black inline-block transition-transform duration-300 ${showSummary ? 'rotate-180' : ''}`}>
                   <path d="M5.83333 7.5L10 11.6667L14.1667 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {showSummary ? 'HIDE ORDER SUMMARY' : 'SHOW ORDER SUMMARY'}
              </span>
              <span className="text-[14px] font-bold text-black">{total.toLocaleString('vi-VN')} VND</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${showSummary ? 'max-h-[1000px] border-t border-zinc-200 pb-6 pt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
              <OrderSummary 
                discountCode={discountCode} 
                setDiscountCode={setDiscountCode} 
                discount={discountAmount} 
                setDiscount={setDiscountAmount} 
              />
            </div>
          </div>

          <div className="px-6 lg:px-0 font-bold text-[14px] tracking-[0.1em] text-black mb-6 lg:hidden">
            Delivery information
          </div>

          {/* Desktop Headers */}
          <div className="hidden lg:grid grid-cols-[55%_45%] gap-14 items-center mb-8 px-6 lg:px-0">
             <div className="relative w-full">
                <span className="text-[14px] tracking-[0.05em] text-black">
                  Delivery information
                </span>
                <span className="absolute -right-7 top-1/2 -translate-y-1/2">
                   <img src={logoBlack.src} alt="INTU" className="h-[14px] opacity-40 ml-10 object-contain" />
                </span>
             </div>
             <div className="w-full ml-6">
                <span className="text-[14px] tracking-[0.05em] text-black">
                  Order information
                </span>
             </div>
          </div>

          {/* Content columns */}
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-[55%_45%] xl:grid-cols-[55%_45%] gap-8 lg:gap-14 items-start px-6 lg:px-0">
            {/* Left Column: Delivery & Payment */}
            <div className="flex flex-col gap-8 w-full">
              <CheckoutForm formData={formData} setFormData={setFormData} />
              
              <PaymentMethods selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
            </div>

            {/* Right Column: Order Summary — static on scroll */}
            <div className="hidden lg:flex flex-col gap-6 w-full pl-0 lg:pl-6">
              <OrderSummary 
                discountCode={discountCode} 
                setDiscountCode={setDiscountCode} 
                discount={discountAmount} 
                setDiscount={setDiscountAmount} 
              />
              
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded text-[11px] border border-red-100 uppercase tracking-widest mt-2">
                  {error}
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-black text-white text-[13px] font-bold uppercase py-4 mt-2 hover:bg-zinc-800 transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'PLACE ORDER'
                )}
              </button>
            </div>

            {/* Mobile View: PLACE ORDER button at the bottom of the left column */}
            <div className="lg:hidden flex flex-col w-full gap-4 mt-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded text-[11px] border border-red-100 uppercase tracking-widest">
                  {error}
                </div>
              )}
              <button 
                onClick={handleCheckout}
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-black text-white text-[13px] font-bold uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'PLACE ORDER'
                )}
              </button>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

