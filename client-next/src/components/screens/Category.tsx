'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/home/ProductCard';
import CategoryHero from '@/components/category/CategoryHero';

import { ProductService } from '@/lib/api';
import type { Product } from '@/types';

// Define category sections with their own hero images and collection info
const CATEGORY_SECTIONS = [
  {
    category: 'New Arrival',
    collectionName: 'SS01 | THE KNOT',
    heroImages: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop",
    ],
    filter: null, // null = show all (new arrivals)
  },
  {
    category: 'Tops',
    collectionName: 'SS01 | ESSENTIAL TOPS',
    heroImages: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2000&auto=format&fit=crop",
    ],
    filter: 'Tops',
  },
  {
    category: 'Bottoms',
    collectionName: 'SS01 | TAILORED BOTTOMS',
    heroImages: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2000&auto=format&fit=crop",
    ],
    filter: 'Bottoms',
  },
  {
    category: 'Dresses',
    collectionName: 'SS01 | SILK & LACE',
    heroImages: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2000&auto=format&fit=crop",
    ],
    filter: 'Dresses',
  },
  {
    category: 'Outerwear',
    collectionName: 'SS01 | LAYER UP',
    heroImages: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2000&auto=format&fit=crop",
    ],
    filter: 'Outerwear',
  },
  {
    category: 'Accessories',
    collectionName: 'SS01 | FINISHING TOUCH',
    heroImages: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2000&auto=format&fit=crop",
    ],
    filter: 'Accessories',
  },
];

interface CategoryProps {
  slug?: string[];
}

const Category = ({ slug = [] }: CategoryProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAll({ pageSize: 100 });
        const items = Array.isArray(response) ? response : (response as any).items || [];
        setAllProducts(items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsFetchingProducts(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Parse category slugs from the URL path
  const categorySegments = useMemo(() => {
    return slug.map(s => decodeURIComponent(s.toLowerCase().replace(/-/g, ' ')));
  }, [slug]);

  // Determine which category sections to show
  const visibleSections = useMemo(() => {
    // If no specific category or "shop-all" or "shop", show all sections
    if (categorySegments.length === 0 || 
        categorySegments.includes('shop all') || 
        categorySegments.includes('shop-all') ||
        categorySegments.includes('shop')) {
      return CATEGORY_SECTIONS;
    }

    // Filter to only matching sections
    const matchingSections = CATEGORY_SECTIONS.filter(section => {
      const sectionSlug = section.category.toLowerCase();
      return categorySegments.some(seg => sectionSlug.includes(seg) || seg.includes(sectionSlug));
    });
    
    // Fallback: if no sections matched (e.g. custom marketing URL like /category/sky-tanktop), show all
    return matchingSections.length > 0 ? matchingSections : CATEGORY_SECTIONS;
  }, [categorySegments]);

  // Get products for a section
  const getProductsForSection = (filter: string | null) => {
    if (!filter) return allProducts;
    return allProducts.filter(p => p.category?.name === filter);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-28">
        {/* Category Sections */}
        {visibleSections.map((section, index) => {
          const products = getProductsForSection(section.filter);
          return (
            <section key={section.category + index}>
              {/* Dark Category Bar */}
              <div className="bg-[#f5f5f5] text-black px-4 md:px-8 py-2.5">
                <span className="text-[10px] md:text-[11px] tracking-[0.2em] font-medium uppercase">
                  {section.category}
                </span>
              </div>

              {/* Collection Info Line */}
              <div className="px-4 md:px-8 py-2.5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] md:text-[12px] tracking-[0.1em] font-medium text-black uppercase">
                    {section.collectionName}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-black/30 tracking-wide">
                    {products.length} items
                  </span>
                </div>
              </div>

              {/* Hero Banner */}
              <CategoryHero images={section.heroImages} />

              {/* Product Grid */}
              <div className="py-8 md:py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-0 gap-y-8 md:gap-y-10">
                  {isFetchingProducts && (
                    <div className="col-span-4 flex justify-center py-20">
                      <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin mb-4" />
                    </div>
                  )}
                  {!isFetchingProducts && products.map((product) => {
                    const mainImageURL = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || "";
                    const hoverImageURL = product.images?.find(img => !img.isMain)?.url;

                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        image={mainImageURL}
                        image2={hoverImageURL}
                        name={product.name}
                        price={`${new Intl.NumberFormat('vi-VN').format(product.basePrice)} VND`}
                        imageContainerClassName="bg-[#f5f5f5] aspect-[3/4]"
                        textAlign="left"
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
};

export default Category;
