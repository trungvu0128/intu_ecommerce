'use client';

import { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/home/ProductCard';
import CategoryHero from '@/components/category/CategoryHero';

import { ProductService, CategoryService } from '@/lib/api';
import { getMainThumbnailUrl, getHoverImageUrl } from '@/lib/image-utils';
import type { Product, Category as CategoryType } from '@/types';

interface CategoryProps {
  slug?: string[];
}

const Category = ({ slug = [] }: CategoryProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isFetchingProducts, setIsFetchingProducts] = useState(true);

  // Parse category slugs from the URL path
  const categorySegments = useMemo(() => {
    return slug.map(s => decodeURIComponent(s.toLowerCase().replace(/-/g, ' ')));
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch categories
        const categoriesRes = await CategoryService.getAll();
        const fetchedCategories = Array.isArray(categoriesRes) ? categoriesRes : [];
        const activeCategories = fetchedCategories.filter(c => c.isActive !== false);
        setCategories(activeCategories);

        // 2. See if we need to query products for a specific category based on URL
        let categoryIdParam: string | undefined = undefined;
        if (categorySegments.length > 0 && 
            !categorySegments.includes('shop all') && 
            !categorySegments.includes('shop-all') &&
            !categorySegments.includes('shop')) {
          const matchCat = activeCategories.find(cat => {
            const catName = cat.name.toLowerCase();
            return categorySegments.some(seg => catName.includes(seg) || seg.includes(catName));
          });
          if (matchCat) {
            categoryIdParam = matchCat.id;
          }
        }

        // 3. Fetch products (either all, or specific to the mapped category IDs)
        const productsRes = await ProductService.getAll({ 
          pageSize: 100, 
          categoryId: categoryIdParam 
        });
        
        const items = Array.isArray(productsRes) ? productsRes : (productsRes as any).items || [];
        setAllProducts(items);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsFetchingProducts(false);
      }
    };
    
    fetchData();
  }, [categorySegments]);

  // Determine which category sections to show
  const visibleSections = useMemo(() => {
    // Only use active categories
    const activeCategories = categories.filter(c => c.isActive !== false);

    // Check if it's a "shop all" equivalent route
    const isShopAll = categorySegments.length === 0 || 
      categorySegments.some(seg => ['shop', 'shop all', 'shop-all', 'all'].includes(seg));

    console.log("DEBUG Category:", { categorySegments, isShopAll });

    if (isShopAll) {
      const allHeroImages = activeCategories
        .map(cat => cat.imageUrl)
        .filter((url): url is string => !!url); // Extract valid images from all categories

      return [{
        categoryId: null, // null means all products
        category: 'Shop',
        collectionName: 'ALL PRODUCTS',
        heroImages: allHeroImages, // Passing all images creates the slider (slicer banner)
        filter: null
      }];
    }

    // Specific category logic
    const matchingCategories = activeCategories.filter(cat => {
      const catName = cat.name.toLowerCase();
      return categorySegments.some(seg => catName.includes(seg) || seg.includes(catName));
    });

    const baseCategories = matchingCategories.length > 0 ? matchingCategories : activeCategories;

    if (baseCategories.length === 0) {
      return [{
        categoryId: null,
        category: 'Shop',
        collectionName: 'ALL PRODUCTS',
        heroImages: [],
        filter: null
      }];
    }

    return baseCategories.map(cat => ({
      categoryId: cat.id,
      category: cat.name,
      collectionName: cat.description || `COLLECTION | ${cat.name.toUpperCase()}`,
      heroImages: cat.imageUrl ? [cat.imageUrl] : [],
      filter: cat.name
    }));
  }, [categorySegments, categories]);

  // Get products for a section
  const getProductsForSection = (categoryId: string | null) => {
    const activeProducts = allProducts.filter(p => p.isActive !== false);

    if (!categoryId) return activeProducts;

    return activeProducts.filter(p => {
      const match = p.category?.id === categoryId || p.categories?.some(c => c.id === categoryId);
      if (!match) return false;

      // Ensure the matched category inside the product is also active
      const cat = p.categories?.find(c => c.id === categoryId) || (p.category?.id === categoryId ? p.category : null);
      if (cat && cat.isActive === false) return false;

      return true;
    });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-28">
        {/* Category Sections */}
        {visibleSections.map((section, index) => {
          const products = getProductsForSection(section.categoryId || null);
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
              {section.heroImages && section.heroImages.length > 0 && (
                <CategoryHero images={section.heroImages} />
              )}

              {/* Product Grid */}
              <div className="py-8 md:py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-0 gap-y-8 md:gap-y-10">
                  {isFetchingProducts && (
                    <div className="col-span-4 flex justify-center py-20">
                      <div className="w-8 h-8 border-2 border-zinc-200 border-t-black rounded-full animate-spin mb-4" />
                    </div>
                  )}
                  {!isFetchingProducts && products.map((product) => {
                    const mainImageURL = getMainThumbnailUrl(product.images);
                    const hoverImageURL = getHoverImageUrl(product.images);

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
