import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("order") || "WEB03-" + Date.now();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-20">
        <div
          className={`max-w-lg w-full text-center transition-all duration-700 ease-out ${
            show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Animated checkmark */}
          <div className="relative mx-auto mb-10 w-28 h-28">
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full bg-emerald-400/20 transition-all duration-1000 ease-out ${
                show ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
            {/* Main circle */}
            <div
              className={`absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-400/30 transition-all duration-700 delay-200 ease-out ${
                show ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              {/* Checkmark SVG */}
              <svg
                className={`w-12 h-12 text-white transition-all duration-500 delay-500 ${
                  show ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className={show ? "animate-draw-check" : ""}
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: show ? 0 : 24,
                    transition: "stroke-dashoffset 0.6s ease-out 0.7s",
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] text-black uppercase mb-6">
            Order Successful!
          </h1>

          {/* Order code */}
          <div className="inline-flex items-center gap-3 border border-zinc-300 rounded px-5 py-2.5 mb-6">
            <span className="text-[11px] tracking-[0.15em] text-zinc-500 uppercase font-medium">
              Order Code:
            </span>
            <span className="text-[13px] tracking-[0.08em] font-bold text-black">
              {orderCode}
            </span>
          </div>

          {/* Thank you message */}
          <p className="text-[13px] tracking-[0.12em] font-bold text-black uppercase mb-3">
            Thank you for shopping at INTUOO.COM
          </p>
          <p className="text-[11px] tracking-[0.05em] text-zinc-500 uppercase leading-relaxed mb-10">
            For further details, please contact us via hotline 0832.216.580
            <br />
            or send an email to intu@gmail.com
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-black text-white text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-zinc-800 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => {
                navigator.clipboard.writeText(orderCode);
              }}
              className="px-8 py-3 border border-zinc-300 text-black text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-zinc-50 transition-colors duration-300"
            >
              Copy Order Code
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
