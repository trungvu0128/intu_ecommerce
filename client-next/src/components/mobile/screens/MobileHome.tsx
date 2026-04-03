'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MobileLayout from '@/components/mobile/MobileLayout';
import FeaturedSection from '@/components/home/FeaturedSection';
import Banner from '@/components/home/Banner';
import DualBanner from '@/components/home/DualBanner';

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
    productPrice: number;
    overlayText?: string;
    linkUrl?: string;
    imageUrl?: string;
    displayOrder: number;
  }[];
}

export default function MobileHome({ initialSections = [] }: { initialSections?: FeaturedSectionData[] }) {
  const [featuredSections, setFeaturedSections] = useState<FeaturedSectionData[]>(initialSections);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialSections.length === 0) {
      let isMounted = true;
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const sectionsRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7101'}/api/FeaturedSections`
          )
            .then(r => r.json())
            .then(r => r.data ?? [])
            .catch(() => []);

          if (isMounted) {
            setFeaturedSections(sectionsRes);
          }
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };
      fetchData();
      return () => { isMounted = false; };
    }
  }, [initialSections]);

  return (
    <MobileLayout heroPage>

      {!isLoading && [...featuredSections]
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((section, idx) => {
          if (section.type === 'Category') {
            const catProducts = section.items
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map(i => ({
                id: i.id,
                slug: i.productSlug,
                name: i.productName,
                price: new Intl.NumberFormat('vi-VN').format(i.productPrice),
                image: i.imageUrl || i.productImage || '',
              }));
            return (
              <div key={section.id} style={{ padding: '12px 16px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px 12px' }}>
                  {catProducts.map((product, idx) => (
                    <Link
                      key={`${section.id}-${product.id}-${idx}`}
                      href={`/product/${product.slug || product.id}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <div style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#f8f8f8', overflow: 'hidden', marginBottom: 10 }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#ccc' }}>NO IMAGE</div>
                        )}
                      </div>
                      <h3 style={{ fontSize: 10, fontWeight: 400, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: 10, margin: 0, color: '#555', letterSpacing: '0.05em' }}>
                        {product.price}₫
                      </p>
                    </Link>
                  ))}
                </div>
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
            const sortedItems = [...section.items].sort(
              (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
            );
            if (section.gridColumns === 1 && sortedItems.length >= 1) {
              const item = sortedItems[0];
              return (
                <Banner
                  key={section.id}
                  image={item.imageUrl || item.productImage || ''}
                  title={item.overlayText || item.productName || section.title}
                  link={item.linkUrl || `/product/${item.productSlug || item.productId}`}
                  className="h-[60vh]"
                  priority={idx === 0}
                  aspectRatio="auto"
                />
              );
            }
            if (section.gridColumns === 2 && sortedItems.length >= 2) {
              const left = sortedItems[0];
              const right = sortedItems[1];
              return (
                <div key={section.id} className="w-full">
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
            return <FeaturedSection key={section.id} section={section} />;
          }

          return null;
        })}
    </MobileLayout>
  );
}
