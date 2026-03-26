import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string | number;
  image: string;
  image2?: string;
  name: string;
  price: string;
  className?: string;
  imageContainerClassName?: string;
  textAlign?: 'left' | 'center';
}

const ProductCard = ({ id, image, image2, name, price, className, imageContainerClassName, textAlign = 'center' }: ProductCardProps) => {
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
      to={`/product/${id}`}
      className={cn("flex flex-col group cursor-pointer", className)}
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

        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 bg-white text-black p-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white shadow-lg z-20"
          aria-label="Add to cart"
        >
          <Plus size={20} strokeWidth={1.5} />
        </button>
      </div>
      <div className={cn("mt-3 px-1 pb-2", textAlign === 'left' ? 'text-left' : 'text-center')}>
        <h3 className="text-[10px] md:text-[11px] font-bold uppercase text-black leading-tight tracking-wide">
          {name}
        </h3>
        <p className="mt-1.5 text-[10px] md:text-[11px] text-black">
          {price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
