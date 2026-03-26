'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PaymentFailed = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "PAYMENT_DECLINED";
  const orderNumber = searchParams.get("orderNumber");
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
          {/* Animated X mark */}
          <div className="relative mx-auto mb-10 w-28 h-28">
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full bg-red-400/20 transition-all duration-1000 ease-out ${
                show ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            />
            {/* Main circle */}
            <div
              className={`absolute inset-2 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-400/30 transition-all duration-700 delay-200 ease-out ${
                show ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
            >
              {/* X mark SVG */}
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
                  d="M6 18L18 6"
                  style={{
                    strokeDasharray: 20,
                    strokeDashoffset: show ? 0 : 20,
                    transition: "stroke-dashoffset 0.5s ease-out 0.7s",
                  }}
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12"
                  style={{
                    strokeDasharray: 20,
                    strokeDashoffset: show ? 0 : 20,
                    transition: "stroke-dashoffset 0.5s ease-out 0.9s",
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-[0.12em] text-black uppercase mb-6">
            Payment Failed
          </h1>

          {/* Order code & Error */}
          <div className="flex flex-col gap-2 items-center mb-6">
            {orderNumber && (
              <div className="inline-flex items-center gap-3 border border-zinc-200 bg-zinc-50 rounded px-5 py-2">
                <span className="text-[11px] tracking-[0.15em] text-zinc-500 uppercase font-medium">
                  Order Code:
                </span>
                <span className="text-[12px] tracking-[0.08em] font-bold text-black">
                  {orderNumber}
                </span>
              </div>
            )}
            <div className="inline-flex items-center gap-3 border border-red-200 bg-red-50 rounded px-5 py-2">
              <span className="text-[11px] tracking-[0.15em] text-red-400 uppercase font-medium">
                Error:
              </span>
              <span className="text-[12px] tracking-[0.08em] font-bold text-red-600">
                {errorCode}
              </span>
            </div>
          </div>

          {/* Error message */}
          <p className="text-[13px] tracking-[0.12em] font-bold text-black uppercase mb-3">
            Your payment could not be processed
          </p>
          <p className="text-[11px] tracking-[0.05em] text-zinc-500 uppercase leading-relaxed mb-10">
            Please check your payment details and try again.
            <br />
            If the issue persists, contact us via hotline 0832.216.580
            <br />
            or send an email to intu@gmail.com
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checkout"
              className="px-8 py-3 bg-black text-white text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-zinc-800 transition-colors duration-300"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-zinc-300 text-black text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-zinc-50 transition-colors duration-300"
            >
              Back to Home
            </Link>
          </div>

          {/* Help section */}
          <div className="mt-12 pt-8 border-t border-zinc-100">
            <p className="text-[11px] tracking-[0.1em] text-zinc-400 uppercase mb-4">
              Common reasons for payment failure
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 border border-zinc-100 rounded">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <p className="text-[10px] tracking-[0.08em] text-zinc-600 uppercase font-medium">
                  Insufficient funds in your account
                </p>
              </div>
              <div className="p-4 border border-zinc-100 rounded">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-[10px] tracking-[0.08em] text-zinc-600 uppercase font-medium">
                  Incorrect card details entered
                </p>
              </div>
              <div className="p-4 border border-zinc-100 rounded">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[10px] tracking-[0.08em] text-zinc-600 uppercase font-medium">
                  Session expired, please retry
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFailed;
