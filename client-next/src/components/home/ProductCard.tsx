'use client';

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { Plus } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  id: string | number;
  slug?: string;
  image: string;
  image2?: string;
  name: string;
  price: string;
  className?: string;
  imageContainerClassName?: string;
  textAlign?: 'left' | 'center';
}

const ProductCard = ({ id, slug, image, image2, name, price, className, imageContainerClassName, textAlign = 'center' }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    addItem({
      id: String(id),
      name,
      price,
      image,
      image2,
    });
  };

  return (
    <Link 
      href={`/product/${slug || id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("flex flex-col group cursor-pointer press-feedback", className)}
    >
      <div className={cn("relative w-full aspect-[3/4] overflow-hidden bg-[#F2F2F2]", imageContainerClassName)}>
        {/* Main Image */}
        <img
          src={image}
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105",
            image2 && "group-hover:opacity-0"
          )}
        />
        
        {/* Hover Image */}
        {image2 && (
          <img
            src={image2}
            alt={`${name} secondary view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out scale-110 group-hover:scale-105"
          />
        )}

        <div
          role="button"
          tabIndex={0}
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white text-black p-2 rounded-full md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white shadow-lg z-20"
          aria-label="Add to cart"
        >
          <Plus size={20} strokeWidth={1.5} />
        </div>
      </div>
      <div className={cn("mt-3 px-1 pb-4", textAlign === 'left' ? 'text-left' : 'text-center')}>
        <h3 className="text-[9px] md:text-[10px] font-medium uppercase text-black leading-tight tracking-widest">
          {name}
        </h3>
        <p className="mt-1 text-[8px] md:text-[9px] text-black/40 uppercase tracking-wider">
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
