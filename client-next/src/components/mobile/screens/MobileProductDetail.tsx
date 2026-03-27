'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { ProductService } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import type { Product, ProductVariant } from '@/types';

export default function MobileProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const { addItem } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getBySlug(slug);
        setProduct(data);
        // Default selections
        if (data.variants?.length > 0) {
          const v = data.variants[0];
          setSelectedSize(v.size);
          setSelectedColor(v.color);
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
        <div style={{ padding: 16 }}>
          <div className="mobile-skeleton" style={{ aspectRatio: '3/4', width: '100%', marginBottom: 16 }} />
          <div className="mobile-skeleton" style={{ height: 20, width: '60%', marginBottom: 8 }} />
          <div className="mobile-skeleton" style={{ height: 20, width: '30%' }} />
        </div>
      </MobileLayout>
    );
  }

  if (!product) {
    return (
      <MobileLayout>
        <div className="mobile-empty">
          <h3 className="mobile-empty__title">Product not found</h3>
          <Link href="/shop" className="mobile-btn mobile-btn--primary" style={{ width: 'auto', padding: '0 24px', marginTop: 16, textDecoration: 'none' }}>
            Back to Shop
          </Link>
        </div>
      </MobileLayout>
    );
  }

  const images = product.images?.length > 0
    ? product.images.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0)).map(i => i.url)
    : [''];

  const sizes = [...new Set(product.variants?.map(v => v.size) || [])];
  const colors = [...new Set(product.variants?.map(v => v.color) || [])];

  const selectedVariant = product.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const price = product.basePrice + (selectedVariant?.priceAdjustment || 0);
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : true;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: selectedVariant?.id || product.id,
      name: `${product.name}${selectedSize ? ` - ${selectedSize}` : ''}${selectedColor ? ` / ${selectedColor}` : ''}`,
      price: price.toString(),
      image: images[0] || '',
      slug: product.slug,
      productId: product.id,
      skipCartOpen: true,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <MobileLayout>
      {/* Back button overlay */}
      <button
        onClick={() => router.back()}
        style={{
          position: 'fixed', top: 'calc(var(--mobile-header-height) + 8px)', left: 8,
          zIndex: 50, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Image Gallery */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#f8f8f8' }}>
        {images[currentImage] ? (
          <img src={images[currentImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No image</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mobile-gallery-dots">
          {images.map((_, i) => (
            <button key={i} className={`mobile-gallery-dot ${i === currentImage ? 'active' : ''}`} onClick={() => setCurrentImage(i)} />
          ))}
        </div>
      )}

      {/* Product Info */}
      <div style={{ padding: '16px 16px 0' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          {product.name}
        </h1>
        <p style={{ fontSize: 18, fontWeight: 600, margin: '8px 0 0', color: '#111' }}>
          {new Intl.NumberFormat('vi-VN').format(price)}₫
        </p>
        {product.category && (
          <p style={{ fontSize: 13, color: '#999', margin: '4px 0 0' }}>{product.category.name}</p>
        )}
      </div>

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div style={{ padding: '20px 16px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</p>
          <div className="mobile-variant-chips">
            {sizes.map(size => {
              const available = product.variants?.some(v => v.size === size && v.color === selectedColor && v.stockQuantity > 0);
              return (
                <button
                  key={size}
                  className={`mobile-variant-chip ${selectedSize === size ? 'active' : ''} ${!available ? 'disabled' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div style={{ padding: '16px 16px 0' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color</p>
          <div className="mobile-variant-chips">
            {colors.map(color => (
              <button
                key={color}
                className={`mobile-variant-chip ${selectedColor === color ? 'active' : ''}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock indicator */}
      {selectedVariant && (
        <div style={{ padding: '12px 16px 0' }}>
          <span style={{ fontSize: 12, color: inStock ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
            {inStock ? `In stock (${selectedVariant.stockQuantity})` : 'Out of stock'}
          </span>
        </div>
      )}

      {/* Description Accordion */}
      <div style={{ margin: '20px 0' }}>
        <div className="mobile-accordion">
          <button className="mobile-accordion__header" onClick={() => setShowDescription(!showDescription)}>
            <span>Description</span>
            {showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showDescription && (
            <div className="mobile-accordion__body" dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }} />
          )}
        </div>
      </div>

      {/* Sticky Add to Cart */}
      <div className="mobile-sticky-bar">
        <button
          className="mobile-btn mobile-btn--primary"
          onClick={handleAddToCart}
          disabled={!inStock}
          style={{ opacity: inStock ? 1 : 0.5, flex: 1 }}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      {/* Toast */}
      <div className={`mobile-toast ${addedToast ? 'show' : ''}`}>
        ✓ Added to cart
      </div>

      <div style={{ height: 60 }} />
    </MobileLayout>
  );
}
