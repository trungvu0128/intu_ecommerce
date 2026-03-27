'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { ProductService, CategoryService } from '@/lib/api';
import type { Product, Category } from '@/types';

interface FeaturedSectionData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'Manual' | 'Category';
  gridColumns: number;
  displayOrder: number;
  isActive: boolean;
  items: {
    id: string;
    productId: string;
    productName: string;
    productSlug?: string;
    productImage?: string;
    productPrice: number;
    overlayText?: string;
    linkUrl?: string;
    imageUrl?: string;
    displayOrder: number;
  }[];
}

function HeroCarousel({ sections }: { sections: FeaturedSectionData[] }) {
  const [current, setCurrent] = useState(0);
  const banners = sections
    .filter(s => s.type === 'Manual' && s.gridColumns === 1 && s.items.length > 0)
    .map(s => {
      const item = s.items[0];
      return {
        image: item.imageUrl || item.productImage || '',
        title: item.overlayText || item.productName || s.title,
        link: item.linkUrl || `/product/${item.productSlug || item.productId}`,
      };
    });

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="mobile-hero">
      <div className="mobile-hero__slide">
        <Link href={banners[current]?.link || '/'}>
          {banners[current]?.image && (
            <img src={banners[current].image} alt={banners[current].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div className="mobile-hero__overlay">
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              {banners[current]?.title}
            </h2>
            <span style={{ fontSize: 13, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              Shop Now <ChevronRight size={14} />
            </span>
          </div>
        </Link>
      </div>
      {banners.length > 1 && (
        <div className="mobile-hero__dots">
          {banners.map((_, i) => (
            <button key={i} className={`mobile-hero__dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryPills({ categories, active, onSelect }: { categories: Category[]; active: string; onSelect: (slug: string) => void }) {
  return (
    <div className="mobile-categories">
      <button className={`mobile-category-pill ${active === '' ? 'active' : ''}`} onClick={() => onSelect('')}>
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`mobile-category-pill ${active === cat.slug ? 'active' : ''}`}
          onClick={() => onSelect(cat.slug || '')}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const mainImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '';
  const price = new Intl.NumberFormat('vi-VN').format(product.basePrice);

  return (
    <Link href={`/product/${product.slug}`} className="mobile-product-card">
      <div className="mobile-product-card__image">
        {mainImage ? (
          <img src={mainImage} alt={product.name} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 13 }}>
            No image
          </div>
        )}
      </div>
      <div className="mobile-product-card__info">
        <h3 className="mobile-product-card__name">{product.name}</h3>
        <p className="mobile-product-card__price">{price}₫</p>
      </div>
    </Link>
  );
}

function SkeletonGrid() {
  return (
    <div className="mobile-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i}>
          <div className="mobile-skeleton" style={{ aspectRatio: '3/4', width: '100%' }} />
          <div className="mobile-skeleton" style={{ height: 14, width: '70%', marginTop: 8 }} />
          <div className="mobile-skeleton" style={{ height: 14, width: '40%', marginTop: 4 }} />
        </div>
      ))}
    </div>
  );
}

export default function MobileHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredSections, setFeaturedSections] = useState<FeaturedSectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, sectionsRes] = await Promise.all([
          ProductService.getAll({ pageSize: 12 }),
          CategoryService.getAll().catch(() => []),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7101'}/api/FeaturedSections`)
            .then(r => r.json())
            .then(r => r.data ?? [])
            .catch(() => []),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setFeaturedSections(sectionsRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = activeCategory
    ? products.filter(p => p.category?.slug === activeCategory)
    : products;

  // Featured section products (Category type)
  const categoryGridSections = featuredSections
    .filter(s => s.type === 'Category' && s.items.length > 0)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <MobileLayout>
      {/* Hero */}
      {!isLoading && <HeroCarousel sections={featuredSections} />}

      {/* Categories */}
      {categories.length > 0 && (
        <CategoryPills categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      )}

      {/* Featured Category Sections */}
      {!isLoading && categoryGridSections.map(section => (
        <div key={section.id} className="mobile-section">
          <h2 className="mobile-section__title">{section.title}</h2>
          {section.subtitle && <p className="mobile-section__subtitle">{section.subtitle}</p>}
          <div className="mobile-grid">
            {section.items
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .slice(0, 4)
              .map(item => (
                <Link key={item.id} href={`/product/${item.productSlug || item.productId}`} className="mobile-product-card">
                  <div className="mobile-product-card__image">
                    <img src={item.imageUrl || item.productImage || ''} alt={item.productName} loading="lazy" />
                  </div>
                  <div className="mobile-product-card__info">
                    <h3 className="mobile-product-card__name">{item.productName}</h3>
                    <p className="mobile-product-card__price">
                      {new Intl.NumberFormat('vi-VN').format(item.productPrice)}₫
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}

      {/* New Arrivals */}
      <div className="mobile-section">
        <h2 className="mobile-section__title">New Arrivals</h2>
        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <div className="mobile-grid">
            {filteredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* View All CTA */}
      {filteredProducts.length > 8 && (
        <div style={{ padding: '0 16px 24px' }}>
          <Link href="/shop" className="mobile-btn mobile-btn--secondary" style={{ textDecoration: 'none' }}>
            View All Products
          </Link>
        </div>
      )}
    </MobileLayout>
  );
}
