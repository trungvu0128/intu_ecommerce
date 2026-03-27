'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, Search } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { ProductService, CategoryService } from '@/lib/api';
import type { Product, Category } from '@/types';

export default function MobileShop() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          ProductService.getAll({ pageSize: 50 }),
          CategoryService.getAll().catch(() => []),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products
    .filter(p => {
      if (activeCategory && p.category?.slug !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.basePrice - b.basePrice;
        case 'price-desc': return b.basePrice - a.basePrice;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const mainImage = (p: Product) => p.images?.find(i => i.isMain)?.url || p.images?.[0]?.url || '';

  return (
    <MobileLayout>
      {/* Search Bar */}
      <div style={{ padding: '12px 16px 0' }}>
        <div className="mobile-search">
          <Search size={16} className="mobile-search__icon" />
          <input
            className="mobile-search__input"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mobile-categories">
        <button
          className={`mobile-category-pill ${activeCategory === '' ? 'active' : ''}`}
          onClick={() => setActiveCategory('')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`mobile-category-pill ${activeCategory === cat.slug ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.slug || '')}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort/Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px 12px' }}>
        <span style={{ fontSize: 13, color: '#666' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: '1px solid #e5e5e5', borderRadius: 8,
            padding: '6px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <SlidersHorizontal size={14} /> Sort
        </button>
      </div>

      {/* Sort Bottom Sheet */}
      <div className={`mobile-bottom-sheet-overlay ${showFilter ? 'open' : ''}`} onClick={() => setShowFilter(false)} />
      <div className={`mobile-bottom-sheet ${showFilter ? 'open' : ''}`}>
        <div className="mobile-bottom-sheet__handle" />
        <div style={{ padding: '0 16px 24px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Sort By</h3>
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'name', label: 'Name A-Z' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => { setSortBy(opt.value); setShowFilter(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '14px 0', borderBottom: '1px solid #f0f0f0',
                background: 'none', border: 'none', borderBottomStyle: 'solid',
                fontSize: 15, fontWeight: sortBy === opt.value ? 600 : 400,
                color: sortBy === opt.value ? '#111' : '#666', cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="mobile-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i}>
              <div className="mobile-skeleton" style={{ aspectRatio: '3/4', width: '100%' }} />
              <div className="mobile-skeleton" style={{ height: 14, width: '70%', marginTop: 8 }} />
              <div className="mobile-skeleton" style={{ height: 14, width: '40%', marginTop: 4 }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mobile-empty">
          <Search size={48} className="mobile-empty__icon" />
          <h3 className="mobile-empty__title">No products found</h3>
          <p className="mobile-empty__text">Try a different search or category</p>
        </div>
      ) : (
        <div className="mobile-grid">
          {filtered.map(product => (
            <Link key={product.id} href={`/product/${product.slug}`} className="mobile-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mobile-product-card__image">
                {mainImage(product) ? (
                  <img src={mainImage(product)} alt={product.name} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 13 }}>
                    No image
                  </div>
                )}
              </div>
              <div className="mobile-product-card__info">
                <h3 className="mobile-product-card__name">{product.name}</h3>
                <p className="mobile-product-card__price">{new Intl.NumberFormat('vi-VN').format(product.basePrice)}₫</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ height: 24 }} />
    </MobileLayout>
  );
}
