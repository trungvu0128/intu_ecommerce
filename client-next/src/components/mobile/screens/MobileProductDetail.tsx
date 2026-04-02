'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Share2, Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { ProductService } from '@/lib/api';
import { getImageUrl, getMainThumbnailUrl, getHoverImageUrl } from '@/lib/image-utils';
import { useCartStore } from '@/store/useCartStore';
import type { Product, ProductVariant } from '@/types';
import ProductCard from '@/components/home/ProductCard';
import { cn } from '@/lib/utils';

export default function MobileProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState('DETAILS');
  const [addedToast, setAddedToast] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const addItem = useCartStore(s => s.addItem);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug);
        const data = isUuid
          ? await ProductService.getById(slug)
          : await ProductService.getBySlug(slug);
        setProduct(data);
        if (data.variants?.length > 0) {
          const v = data.variants[0];
          setSelectedSize(v.size);
          setSelectedColor(v.color);
        }
        
        // Fetch related products
        try {
          const categoryId = data?.category?.id || data?.categories?.[0]?.id || data?.categoryId;
          const relatedResponse = await ProductService.getAll({ categoryId, pageSize: 8 });
          const productsList = Array.isArray(relatedResponse) ? relatedResponse : (relatedResponse as any).items || [];
          setRelatedProducts(productsList.filter((p: any) => p.id !== data.id).slice(0, 4));
        } catch (relatedError) {
          console.error('Failed to fetch related products:', relatedError);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="p-4 space-y-4">
          <div className="aspect-[3/4] w-full bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-6 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-zinc-100 rounded animate-pulse" />
          <div className="h-12 bg-zinc-100 rounded-xl animate-pulse" />
        </div>
      </MobileLayout>
    );
  }

  if (!product) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <X size={24} className="text-zinc-400" />
          </div>
          <h3 className="text-sm font-medium text-zinc-500 mb-2">Product not found</h3>
          <Link 
            href="/shop"
            className="px-6 py-3 bg-black text-white text-xs font-semibold tracking-wider rounded-xl"
          >
            BACK TO SHOP
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const images = product.images?.length > 0
    ? product.images.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0)).map(i => getImageUrl(i))
    : [''];

  const sizes = [...new Set(product.variants?.map(v => v.size).filter(s => s && s.trim()) || [])];
  const colors = [...new Set(product.variants?.map(v => v.color).filter(c => c && c.trim()) || [])];

  const selectedVariant = product.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const price = product.basePrice + (selectedVariant?.priceAdjustment || 0);
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : true;

  const handleAddToCart = () => {
    if (!product || !inStock) return;
    
    addItem({
      id: selectedVariant?.id || product.id,
      name: `${product.name}${selectedSize ? ` - ${selectedSize}` : ''}${selectedColor ? ` / ${selectedColor}` : ''}`,
      price: price.toString(),
      image: images[0] || '',
      slug: product.slug,
      productId: product.id,
      quantity,
      skipCartOpen: true,
    });
    
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const getButtonText = () => {
    if (!selectedSize && sizes.length > 0) return 'SELECT SIZE';
    if (!selectedColor && colors.length > 0) return 'SELECT COLOR';
    if (!inStock) return 'OUT OF STOCK';
    return 'ADD TO BAG';
  };

  const isButtonDisabled = (!selectedSize && sizes.length > 0) || (!selectedColor && colors.length > 0) || !inStock;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 pb-32">
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-50">
              {images[currentImage] ? (
                <img
                  src={images[currentImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs tracking-wider">
                  NO IMAGE
                </div>
              )}

              <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-10 active:scale-95 transition-transform"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>

              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    "w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform",
                    isLiked && "bg-red-50"
                  )}
                >
                  <Heart 
                    size={18} 
                    strokeWidth={2} 
                    className={cn(isLiked ? "fill-red-500 text-red-500" : "text-zinc-600")}
                  />
                </button>
                <button
                  onClick={() => setShowShareSheet(true)}
                  className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  <Share2 size={18} strokeWidth={2} className="text-zinc-600" />
                </button>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex justify-center gap-2 py-4 px-4 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      "flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      i === currentImage ? "border-black scale-105" : "border-transparent opacity-60"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-6 space-y-6">
            <div>
              <h1 className="text-base font-medium text-black leading-snug mb-2">
                {product.name}
              </h1>
              <p className="text-lg font-semibold text-black">
                {formatPrice(price)}₫
              </p>
            </div>

            {colors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
                  Color: <span className="text-black">{selectedColor || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all",
                        selectedColor === color 
                          ? "bg-black text-white" 
                          : "bg-zinc-100 text-black hover:bg-zinc-200"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Size: <span className="text-black">{selectedSize || 'Select'}</span>
                  </p>
                  {!!product.sizeChartImage && (
                    <button 
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-[10px] tracking-widest underline underline-offset-4 text-black hover:opacity-60"
                    >
                      Size Chart
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => {
                    const available = product.variants?.some(
                      v => v.size === size && v.color === selectedColor && v.stockQuantity > 0
                    );
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={cn(
                          "w-12 h-12 rounded-lg text-sm font-medium tracking-wide transition-all",
                          selectedSize === size 
                            ? "bg-black text-white" 
                            : available 
                              ? "bg-zinc-100 text-black hover:bg-zinc-200" 
                              : "bg-zinc-50 text-zinc-400 line-through cursor-not-allowed"
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-zinc-500 mb-3 uppercase tracking-wider">
                Quantity
              </p>
              <div className="flex items-center gap-3 bg-zinc-50 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-zinc-100 transition-colors active:scale-95"
                >
                  <Minus size={16} strokeWidth={2} />
                </button>
                <span className="w-12 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-zinc-100 transition-colors active:scale-95"
                >
                  <Plus size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-100">
              <div className="flex border-b border-zinc-100">
                {['DETAILS', 'SIZING', 'SHIPPING'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 py-4 text-xs font-medium tracking-wide transition-colors",
                      activeTab === tab 
                        ? "text-black border-b-2 border-black" 
                        : "text-zinc-400 hover:text-zinc-600"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-5 text-sm text-zinc-600 leading-relaxed">
                {activeTab === 'DETAILS' && (
                  <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }} />
                )}
                {activeTab === 'SIZING' && (
                  <div className="text-center space-y-3">
                    <p>Standard Fanci Club measurements apply.</p>
                    <Link href="/size-guide" className="text-black underline font-medium">
                      View Size Guide
                    </Link>
                  </div>
                )}
                {activeTab === 'SHIPPING' && (
                  <div className="text-center space-y-2">
                    <p>Worldwide shipping available.</p>
                    <p>Standard delivery: 3-5 business days.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="py-12 bg-white border-t border-zinc-100">
              <h2 className="text-xs tracking-[0.2em] font-bold uppercase text-center mb-8">
                YOU MAY ALSO LIKE
              </h2>
              <div className="grid grid-cols-2 gap-x-0 gap-y-6">
                {relatedProducts.map((relProduct) => {
                  const relMainImageURL = getMainThumbnailUrl(relProduct.images);
                  const relHoverImageURL = getHoverImageUrl(relProduct.images);
                  return (
                    <ProductCard
                      key={relProduct.id}
                      id={relProduct.id}
                      slug={relProduct.slug}
                      image={relMainImageURL}
                      image2={relHoverImageURL}
                      name={relProduct.name}
                      price={`${new Intl.NumberFormat('vi-VN').format(relProduct.basePrice)} VND`}
                      imageContainerClassName="bg-[#f5f5f5] aspect-[3/4]"
                      textAlign="left"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-4 py-4 pb-safe z-[90] shadow-lg">
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all active:scale-[0.98]",
                isButtonDisabled 
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                  : "bg-zinc-100 text-black hover:bg-zinc-200"
              )}
            >
              Add to Bag
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isButtonDisabled}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all active:scale-[0.98]",
                isButtonDisabled 
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-zinc-800"
              )}
            >
              Buy Now
            </button>
          </div>
        </div>

        {addedToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl text-xs font-semibold tracking-wider shadow-xl z-[100] animate-fade-in-up">
            Added to Bag
          </div>
        )}

        {showShareSheet && (
          <div className="fixed inset-0 bg-black/50 z-[200] flex items-end justify-center" onClick={() => setShowShareSheet(false)}>
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-safe animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-6" />
              <h3 className="text-sm font-semibold mb-4 text-center">Share Product</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Copy Link', icon: '🔗' },
                  { label: 'Facebook', icon: '📘' },
                  { label: 'Instagram', icon: '📷' },
                  { label: 'WhatsApp', icon: '💬' },
                ].map(item => (
                  <button
                    key={item.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-zinc-50 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] font-medium text-zinc-600">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Size Chart Modal */}
        {isSizeChartOpen && !!product.sizeChartImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" onClick={() => setIsSizeChartOpen(false)}>
            <div className="relative w-full max-w-sm bg-white p-2 rounded-xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <button 
                className="absolute -top-12 right-0 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 transition-colors" 
                onClick={() => setIsSizeChartOpen(false)}
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center">
                <img src={product.sizeChartImage} alt="Size Chart" className="w-full h-auto object-contain rounded-lg max-h-[80vh]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
