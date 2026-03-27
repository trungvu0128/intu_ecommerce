'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import { useCartStore } from '@/store/useCartStore';

interface ProductInfoProps {
  id: string;
  slug?: string;
  name: string;
  price: string;
  image: string;
  image2?: string;
  sizes: string[];
  variants?: any[];
  description: string;
  styleId: string;
}

const ProductInfo = ({ id, slug, name, price, image, image2, sizes, variants, description, styleId }: ProductInfoProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Vui lòng chọn size');
      return false;
    }

    const selectedVariant = variants?.find(v => v.size === selectedSize);
    const variantId = selectedVariant ? selectedVariant.id : id;

    addItem({
      id: variantId,
      productId: id,
      name: `${name}${selectedSize ? ` - Size ${selectedSize}` : ''}`,
      price,
      image,
      image2,
      slug,
      quantity,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    return true;
  };

  const handleBuyNow = () => {
    const added = handleAddToCart();
    if (added) {
      router.push('/checkout');
    }
  };

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 px-4 md:px-8 bg-white text-black pb-[140px] md:pb-12">
      {/* Left Column: Product Info */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase">{name}</h1>
          <p className="text-lg md:text-xl tracking-wider font-medium">
            {price}
          </p>
        </div>

        {/* Size Selector */}
        <div className="space-y-2 max-w-md">
          <div className="relative">
            <button
              onClick={() => setIsSizeOpen(!isSizeOpen)}
              className="w-full flex items-center justify-between border-b border-black py-2 px-1 text-[10px] md:text-xs tracking-widest uppercase font-medium"
            >
              <span>{selectedSize ? `Size ${selectedSize}` : 'Select A Size'}</span>
              {isSizeOpen ? <Minus size={14} /> : <Plus size={14} />}
            </button>
            {isSizeOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-black z-20 mt-[-1px]">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setIsSizeOpen(false);
                    }}
                    className={cn(
                      "w-full text-left py-3 px-4 text-xs md:text-sm tracking-widest transition-colors hover:bg-zinc-50 min-h-[44px]",
                      selectedSize === size ? "bg-zinc-100 font-bold" : ""
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button className="text-[10px] tracking-widest underline underline-offset-4 hover:opacity-60 transition-opacity">
              Size Chart
            </button>
          </div>
        </div>

        {/* Product Details Text */}
        <div className="space-y-4 max-w-lg">
          <h2 className="text-[10px] md:text-xs tracking-[0.2em] font-bold uppercase">PRODUC DETAILS</h2>
          <p className="text-[10px] text-zinc-400 font-light uppercase leading-relaxed tracking-wider">Style {styleId}</p>
          <p className="text-[11px] md:text-[13px] leading-relaxed tracking-wide font-light text-zinc-800">
            {description}
          </p>
        </div>
      </div>

      {/* Right Column: Actions */}
      <div className="flex flex-col gap-4 max-w-md">
        <button 
          onClick={handleBuyNow}
          className="w-full bg-black text-white text-[10px] md:text-xs font-bold uppercase tracking-widest py-4 hover:bg-zinc-800 transition-colors"
        >
          BUY NOW
        </button>
        <button 
          onClick={handleAddToCart}
          className={cn(
            "w-full text-[10px] md:text-xs font-bold uppercase tracking-widest py-4 transition-all duration-300",
            isAdded ? "bg-green-600 text-white" : "bg-black text-white hover:bg-zinc-800"
          )}
        >
          {isAdded ? 'ADDED TO BAG' : 'ADD TO CART'}
        </button>
        
        {/* Quantity Selector */}
        <div className="flex items-center justify-between border border-zinc-200 py-2 px-2">
          <button 
            onClick={decrementQuantity}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button 
            onClick={incrementQuantity}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-black transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>

      {/* ═══ MOBILE: Sticky bottom CTA bar (hidden on desktop) ═══ */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-zinc-200 px-4 py-3 pb-safe md:hidden">
        <div className="flex gap-3">
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-black text-white text-[11px] font-bold uppercase tracking-widest py-3.5 press-feedback"
          >
            BUY NOW
          </button>
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex-1 text-[11px] font-bold uppercase tracking-widest py-3.5 transition-all duration-300 press-feedback border",
              isAdded ? "bg-green-600 text-white border-green-600" : "bg-white text-black border-black"
            )}
          >
            {isAdded ? 'ADDED ✓' : 'ADD TO CART'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
