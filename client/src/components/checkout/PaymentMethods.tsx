import { cn } from "@/lib/utils";
import { useState } from "react";

const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState("online");

  const methods = [
    {
      id: "online",
      label: "Online payment methods",
      sublabel: "(VNPAY-QR, Credit Card, Domestic Card)",
    },
    {
      id: "cod",
      label: "Cash on delivery",
      sublabel: "(COD)",
    },
    {
      id: "qr",
      label: "Transfer money via",
      sublabel: "QR code - TPbank",
    },
  ];

  return (
    <div className="flex flex-col gap-5 mt-6">
      <h3 className="text-[12px] font-bold tracking-[0.05em]">Payment method</h3>
      <div className="flex flex-col gap-5">
        {methods.map((method) => (
          <label
            key={method.id}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setSelectedMethod(method.id)}
          >
            <div
              className={cn(
                "w-5 h-5 border flex items-center justify-center transition-colors shrink-0",
                selectedMethod === method.id ? "bg-black border-black" : "bg-zinc-100 border-zinc-200 group-hover:border-zinc-300"
              )}
            >
              {selectedMethod === method.id && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-[12px] tracking-[0.02em] text-zinc-400">
                {method.label}
              </div>
              <div className="text-[12px] tracking-[0.02em] text-zinc-400">
                {method.sublabel}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
