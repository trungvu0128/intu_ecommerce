'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import ProductGrid from '@/components/home/ProductGrid';
import FeaturedSection from '@/components/home/FeaturedSection';
import Footer from '@/components/layout/Footer';
import Banner from '@/components/home/Banner';
import DualBanner from '@/components/home/DualBanner';
import { ProductService } from '@/lib/api';
import type { Product } from '@/types';

interface FeaturedSectionData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'Manual' | 'Category' | 'Media';
  gridColumns: number;
  displayOrder: number;
  isActive: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  linkUrl?: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    productSlug?: string;
    productImage?: string;
    productImage2?: string;
    productPrice: number;
    overlayText?: string;
    linkUrl?: string;
    imageUrl?: string;
    displayOrder: number;
  }[];
}

const Home = ({ initialSections = [] }: { initialSections?: FeaturedSectionData[] }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredSections, setFeaturedSections] = useState<FeaturedSectionData[]>(initialSections);
  const [isLoading, setIsLoading] = useState(initialSections.length === 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises: Promise<any>[] = [ProductService.getAll({ pageSize: 8 })];
        if (initialSections.length === 0) {
          promises.push(
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7101'}/api/FeaturedSections`)
              .then(r => r.json())
              .then(r => Array.isArray(r.data) ? r.data : [])
              .catch(() => [])
          );
        }
        
        const results = await Promise.all(promises);
        setProducts(results[0]);
        
        if (initialSections.length === 0 && results.length > 1) {
          setFeaturedSections(Array.isArray(results[1]) ? results[1] : []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialSections]);

  return (
    <div className="relative min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar />
      <main>
        {/* <Hero /> */}

        {/* Dynamic Featured Sections from CMS */}
        {mounted && !isLoading && [...featuredSections].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((section, idx) => {
          if (section.type === 'Category') {
            const catProducts = section.items
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map(i => ({
                id: i.id,
                slug: i.productSlug,
                name: i.productName,
                price: `${new Intl.NumberFormat('vi-VN').format(i.productPrice)} VND`,
                image: i.imageUrl || i.productImage || '',
                image2: i.productImage2 || undefined,
              }));
            return (
              <div key={section.id}>
                <ProductGrid products={catProducts as any} />
              </div>
            );
          }
          if (section.type === 'Media' && section.mediaUrl) {
            return (
              <Banner
                key={section.id}
                image={section.mediaUrl}
                mediaType={section.mediaType}
                title={section.title}
                link={section.linkUrl || undefined}
                className="w-full h-screen"
                priority={idx === 0}
                aspectRatio="auto"
              />
            );
          }

          if (section.type === 'Manual') {
            const sortedItems = [...section.items].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            // 1 column Manual -> Banner
            if (section.gridColumns === 1 && sortedItems.length >= 1) {
              const item = sortedItems[0];
              return (
                <Banner
                  key={section.id}
                  image={section.mediaUrl || item.imageUrl || item.productImage || ''}
                  mediaType={section.mediaType}
                  title={item.overlayText || item.productName || section.title}
                  link={section.items.length === 1 && !section.mediaUrl ? (item.linkUrl || `/product/${item.productSlug || item.productId}`) : undefined}
                  className="h-[50vh] md:h-[70vh] lg:h-[90vh]"
                  priority={idx === 0}
                  aspectRatio="auto"
                />
              );
            }
            // 2 column Manual -> Dual Banner
            if (section.gridColumns === 2 && sortedItems.length >= 2) {
              const left = sortedItems[0];
              const right = sortedItems[1];
              return (
                <div key={section.id}>
                  <DualBanner
                    leftImage={left.imageUrl || left.productImage || ''}
                    leftTitle={left.overlayText || left.productName || section.title}
                    leftLink={left.linkUrl || `/product/${left.productSlug || left.productId}`}
                    rightImage={right.imageUrl || right.productImage || ''}
                    rightTitle={right.overlayText || right.productName || section.title}
                    rightLink={right.linkUrl || `/product/${right.productSlug || right.productId}`}
                    priority={idx === 0}
                  />
                </div>
              );
            }
            // Fallback for other manual grids
            return <FeaturedSection key={section.id} section={section} />;
          }

          return null;
        })}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
