'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedItem {
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
}

interface FeaturedSectionData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'Manual' | 'Category';
  gridColumns: number;
  displayOrder: number;
  isActive: boolean;
  items: FeaturedItem[];
}

const FeaturedSection = ({ section }: { section: FeaturedSectionData }) => {
  return (
    <section className="w-full py-16 px-6 lg:px-16 border-t border-black/5" id={`section-${section.id}`}>
      <div className="flex justify-between items-end mb-8 border-b border-black pb-4">
        <div>
          <h2 className="text-[12px] md:text-[14px] font-bold tracking-[0.2em] uppercase">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="text-[10px] uppercase tracking-widest text-black/50 mt-1">
              {section.subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div
        className={`grid gap-4 md:gap-6 grid-cols-2 auto-rows-fr items-stretch ${
          section.gridColumns === 1 ? 'md:grid-cols-1' :
          section.gridColumns === 3 ? 'md:grid-cols-3' :
          section.gridColumns === 4 ? 'md:grid-cols-4' :
          section.gridColumns === 5 ? 'md:grid-cols-5' :
          'md:grid-cols-2'
        }`}
      >
        {section.items.sort((a,b) => a.displayOrder - b.displayOrder).map((item) => (
          <Link href={item.linkUrl || `/product/${item.productSlug || item.productId}`} key={item.id} className="group relative block overflow-hidden bg-gray-50 aspect-[3/4] h-full">
            {(item.imageUrl || item.productImage) && (
             <img 
               src={item.imageUrl || item.productImage || ''} 
               alt={item.productName} 
               className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
             />
            )}
            
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/60 to-transparent">
              {item.overlayText && (
                <p className="text-white text-[10px] font-bold tracking-[0.2em] mb-1 uppercase">
                  {item.overlayText}
                </p>
              )}
              <h3 className="text-white text-[14px] uppercase tracking-widest">{item.productName}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
