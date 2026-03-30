'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('DETAILS');
  const [addedToast, setAddedToast] = useState(false);
  
  const addItem = useCartStore(s => s.addItem);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Match the same logic as desktop ProductDetail — UUID → getById, else → getBySlug
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
          <div className="mobile-skeleton" style={{ height: 20, width: '100%', marginBottom: 8 }} />
          <div className="mobile-skeleton" style={{ height: 20, width: '100%' }} />
        </div>
      </MobileLayout>
    );
  }

  if (!product) {
    return (
      <MobileLayout>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999' }}>Product not found</h3>
          <Link href="/shop" style={{ display: 'inline-block', marginTop: 24, padding: '12px 32px', backgroundColor: '#000', color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none' }}>
            BACK TO SHOP
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
    if (!product || !inStock) return;
    
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

  const getButtonText = () => {
    if (!selectedSize && sizes.length > 0) return 'SELECT SIZE';
    if (!selectedColor && colors.length > 0) return 'SELECT COLOR';
    if (!inStock) return 'OUT OF STOCK';
    return 'ADD TO BAG';
  };

  const isButtonDisabled = (!selectedSize && sizes.length > 0) || (!selectedColor && colors.length > 0) || !inStock;

  return (
    <MobileLayout>
      {/* Minimal Header Line */}
      <div style={{ borderBottom: '1px solid #eaeaea', height: 1 }} />

      {/* Image Gallery */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#f8f8f8' }}>
        {images[currentImage] ? (
          <img src={images[currentImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 11, letterSpacing: '0.05em' }}>NO IMAGE</div>
        )}
      </div>
      
      {/* Gallery Dots Minimal */}
      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '16px 0' }}>
          {images.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentImage(i)}
              style={{
                width: 6, height: 6, borderRadius: '50%', padding: 0,
                border: 'none', backgroundColor: i === currentImage ? '#000' : '#d4d4d4', transition: 'background-color 0.2s', cursor: 'pointer'
              }} 
            />
          ))}
        </div>
      )}

      {/* Product Info (Centered & Minimal) */}
      <div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 13, fontWeight: 300, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.4 }}>
          {product.name}
        </h1>
        <p style={{ fontSize: 12, fontWeight: 500, margin: '8px 0 0', letterSpacing: '0.05em' }}>
          {new Intl.NumberFormat('vi-VN').format(price)}₫
        </p>
      </div>

      <div style={{ padding: '32px 20px 0' }}>
        {/* Color Selector */}
        {colors.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              COLOR: <span style={{ color: '#666' }}>{selectedColor || 'SELECT'}</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '8px 16px', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                    backgroundColor: selectedColor === color ? '#000' : '#fff',
                    color: selectedColor === color ? '#fff' : '#000',
                    border: '1px solid #000', transition: 'all 0.2s', cursor: 'pointer'
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        {sizes.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              SIZE: <span style={{ color: '#666' }}>{selectedSize || 'SELECT'}</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {sizes.map(size => {
                const available = product.variants?.some(v => v.size === size && v.color === selectedColor && v.stockQuantity > 0);
                return (
                  <button
                    key={size}
                    onClick={() => available && setSelectedSize(size)}
                    style={{
                      padding: '8px 16px', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                      backgroundColor: selectedSize === size ? '#000' : '#fff',
                      color: selectedSize === size ? '#fff' : available ? '#000' : '#ccc',
                      border: `1px solid ${available ? '#000' : '#eaeaea'}`,
                      opacity: available ? 1 : 0.5,
                      textDecoration: available ? 'none' : 'line-through',
                      cursor: available ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Vô Cực */}
      <div style={{ margin: '40px 0 20px', borderTop: '1px solid #eaeaea' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #eaeaea' }}>
          {['DETAILS', 'SIZING', 'SHIPPING'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '16px 0', background: 'none', border: 'none', 
                fontSize: 11, fontWeight: activeTab === tab ? 600 : 400, 
                letterSpacing: '0.05em', borderBottom: activeTab === tab ? '1px solid #000' : 'none',
                marginBottom: -1, cursor: 'pointer', transition: 'all 0.2s', color: activeTab === tab ? '#000' : '#888'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ padding: '24px 20px', fontSize: 12, lineHeight: 1.6, color: '#444' }}>
          {activeTab === 'DETAILS' && (
             <div dangerouslySetInnerHTML={{ __html: product.description || 'No description available for this item.' }} />
          )}
          {activeTab === 'SIZING' && (
             <div style={{ textAlign: 'center' }}>
               <p style={{ margin: '0 0 12px' }}>Standard Fanci Club measurements apply.</p>
               <Link href="/size-guide" style={{ color: '#000', textDecoration: 'underline' }}>View Size Guide</Link>
             </div>
          )}
          {activeTab === 'SHIPPING' && (
             <div style={{ textAlign: 'center' }}>
               <p style={{ margin: '0 0 12px' }}>Worldwide shipping available.</p>
               <p style={{ margin: 0 }}>Standard delivery: 3-5 business days.</p>
             </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div style={{ borderTop: '1px solid #eaeaea', padding: '16px 20px', backgroundColor: '#fff', position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 40 }}>
        <button
          onClick={handleAddToCart}
          disabled={isButtonDisabled}
          style={{ 
            width: '100%', padding: '16px 0', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
            backgroundColor: isButtonDisabled ? '#f5f5f5' : '#000',
            color: isButtonDisabled ? '#999' : '#fff',
            border: isButtonDisabled ? '1px solid #eaeaea' : 'none',
            cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {getButtonText()}
        </button>
      </div>

      {/* Toast */}
      {addedToast && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#000', color: '#fff', padding: '12px 24px', fontSize: 11,
          fontWeight: 600, letterSpacing: '0.05em', zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          ADDED TO BAG
        </div>
      )}

    </MobileLayout>
  );
}
