import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

const OrderSummary = () => {
  const { items, getTotalPrice } = useCartStore();
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const shipping = items.length > 0 ? 45000 : 0;
  
  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
    }
  };

  const total = subtotal - discount + shipping;

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Product Items */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className="w-14 h-16 bg-zinc-100 overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex justify-between items-start gap-2 min-w-0">
              <div className="flex flex-col gap-1 min-w-0">
                <h4 className="text-[11px] tracking-[0.05em] font-normal uppercase leading-tight text-black">
                  {item.name}
                </h4>
                <div className="flex gap-6 text-[10px] tracking-[0.03em] text-zinc-500 uppercase">
                  <span>SIZES: 1</span>
                  <span>QUANTITY: {item.quantity}</span>
                </div>
              </div>
              <span className="text-[11px] tracking-[0.03em] font-normal whitespace-nowrap text-black shrink-0">
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Code */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="DISCOUNT CODE"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="flex-1 border border-zinc-300 px-3 py-2 text-[11px] tracking-[0.05em] text-black focus:outline-none focus:border-black transition-colors placeholder:text-zinc-400 uppercase"
        />
        <button 
          onClick={handleApplyDiscount}
          className="bg-white text-black border border-zinc-300 px-4 py-2 text-[11px] tracking-[0.05em] font-normal uppercase hover:bg-black hover:text-white hover:border-black transition-all duration-200"
        >
          APPLY
        </button>
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] tracking-[0.05em] uppercase font-medium text-black">SUBTOTAL</span>
          <span className="text-[11px] tracking-[0.03em] font-normal">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center h-4">
          <span className="text-[11px] tracking-[0.05em] uppercase font-medium text-black">DISCOUNT</span>
          <span className="text-[11px] tracking-[0.03em] font-normal text-red-500">
            {discount > 0 ? `- ${formatPrice(discount)}` : ""}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] tracking-[0.05em] uppercase font-medium text-black">SHIPPING</span>
          <span className="text-[11px] tracking-[0.03em] font-normal">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[13px] tracking-[0.05em] font-bold uppercase">TOTAL</span>
          <span className="text-[13px] tracking-[0.03em] font-bold">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
