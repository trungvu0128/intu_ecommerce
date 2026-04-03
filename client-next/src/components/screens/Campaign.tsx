'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const campaignImages = {
  hero: '/assets/campaign/hero.png',
  product1: '/assets/campaign/product1.png',
  product2: '/assets/campaign/product2.png',
  lifestyle: '/assets/campaign/lifestyle.png',
  logoWhite: '/assets/campaign/logo-white.png',
  grid1: '/assets/campaign/grid1.png',
  grid2: '/assets/campaign/grid2.png',
  grid3: '/assets/campaign/grid3.png',
  grid4: '/assets/campaign/grid4.png',
  grid5: '/assets/campaign/grid5.png',
  grid6: '/assets/campaign/grid6.png',
};

const Campaign = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('campaign-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div className="min-h-screen bg-white text-black" style={{ fontFamily: "'Archivo', sans-serif" }}>
      <Navbar />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        
        .campaign-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .campaign-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .campaign-hero-img {
          transition: transform 8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .campaign-hero-img:hover {
          transform: scale(1.03);
        }

        .product-cell {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-cell:hover {
          background-color: #fafafa;
        }

        .product-cell img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-cell:hover img {
          transform: scale(1.03);
        }

        .grid-cell {
          overflow: hidden;
        }

        .grid-cell img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .grid-cell:hover img {
          transform: scale(1.05);
        }

        .lifestyle-banner {
          position: relative;
        }

        .lifestyle-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.15);
          pointer-events: none;
        }

        .detail-row {
          position: relative;
        }

        .detail-row::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: #d9d9d9;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .campaign-visible .detail-row::after {
          transform: scaleX(1);
        }
      `}</style>

      {/* Section 1: Full-Width Hero Banner */}
      <section 
        className={`w-full overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaignImages.hero}
          alt="INTU Campaign - The Choir Without Voice"
          className="w-full h-auto object-cover campaign-hero-img"
          fetchPriority="high"
        />
      </section>

      {/* Section 2: Campaign Title + Project Details */}
      <section
        ref={(el) => addRef(el, 0)}
        className="campaign-section px-4 md:px-8 lg:px-[18px] pt-8 pb-12 lg:pb-16"
      >
        {/* Sub-heading */}
        <p 
          className="text-[16px] lg:text-[20.072px] font-bold uppercase tracking-wide mb-6 lg:mb-8"
        >
          INTU 25&apos; CAMPAIGN
        </p>

        {/* Split Layout: Title (left) + Details (right) */}
        <div className="flex flex-col lg:flex-row lg:gap-16">
          {/* Left Column - Big Title */}
          <div className="lg:w-[55%] mb-10 lg:mb-0">
            <h1 
              className="text-[60px] md:text-[90px] lg:text-[113.752px] font-bold leading-[0.95] tracking-tight"
            >
              <span className="block">&ldquo;the choir</span>
              <span className="block">without voice&rdquo;</span>
            </h1>
          </div>

          {/* Right Column - Project Details */}
          <div className="lg:w-[45%] lg:pt-4">
            <h3 className="text-[22px] lg:text-[25px] font-bold mb-6">
              Project Details
            </h3>

            {/* Detail Rows with animated underlines */}
            <div className="space-y-0">
              <div className="detail-row flex justify-between items-center py-4 border-b border-[#d9d9d9]">
                <span className="text-[#737172] text-[18px] lg:text-[25px]">Campaign</span>
                <span className="text-[#737172] text-[18px] lg:text-[25px]">&ldquo;the choir without voice&rdquo;</span>
              </div>
              <div className="detail-row flex justify-between items-center py-4 border-b border-[#d9d9d9]">
                <span className="text-[#737172] text-[18px] lg:text-[25px]">Year</span>
                <span className="text-[#737172] text-[18px] lg:text-[25px]">2025</span>
              </div>
            </div>

            {/* Description Text */}
            <div className="mt-10 lg:mt-12">
              <p className="text-[16px] lg:text-[20px] leading-[1.7] text-black">
                How is purity measured, and by whose standards?
                <br />
                In a wedding where guests gather to celebrate the bride and groom,
                <br />
                what shadows do they hide beneath their own polished vows?
              </p>
              <p className="text-[16px] lg:text-[20px] leading-[1.7] text-black mt-6">
                As the camera pulls away from the bride in black, the celebration fractures—
                <br />
                each guest lost in jealousies and unspoken desires,
                <br />
                a silent chorus humming beneath the surface.
              </p>
              <p className="text-[16px] lg:text-[20px] leading-[1.7] text-black mt-6">
                She stands at the center, seen yet profoundly isolated.
                <br />
                Here, beauty is not purity, and purity is not light—it is the courage to be witnessed in all one&apos;s contradictions.
                <br />
                This is a story of what weddings don&apos;t reveal,
                <br />
                and the harmony found in the truths no one dares to sing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Product Showcase - 3 Columns */}
      <section
        ref={(el) => addRef(el, 1)}
        className="campaign-section"
      >
        {/* Product Name + Collection Header */}
        <div className="flex items-baseline gap-6 px-4 md:px-8 lg:px-[18px] mb-2">
          <h2 className="text-[20px] lg:text-[25px] font-bold uppercase">
            THE BACK-BITE JEANS
          </h2>
          <span className="text-[16px] lg:text-[20px] text-black">
            Collection 01
          </span>
        </div>
        <p className="text-[16px] lg:text-[20px] text-black px-4 md:px-8 lg:px-[18px] mb-6">
          Color: Washed Blue
        </p>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black">
          {/* Cell 1 - Product Image */}
          <div className="product-cell border-b md:border-b-0 md:border-r border-black relative aspect-[640/932] overflow-hidden">
            <Image
              src={campaignImages.product1}
              alt="The Back-Bite Jeans - Front View"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Cell 2 - Product Image */}
          <div className="product-cell border-b md:border-b-0 md:border-r border-black relative aspect-[640/932] overflow-hidden">
            <Image
              src={campaignImages.product2}
              alt="The Back-Bite Jeans - Detail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Cell 3 - Text Description */}
          <div className="product-cell bg-white flex items-end p-8 lg:p-10 min-h-[400px] md:min-h-0 md:aspect-[640/932]">
            <p className="text-[16px] lg:text-[20px] leading-[1.7] text-black">
              A truth understood without being spoken.
              <br />
              The twins move like mirrors - two bodies, one mind - seeing what others ignore, sensing what others hide.
              <br />
              Bound by threads both visible and unseen, they keep the wedding&apos;s secrets unspoken - because they have long whispered them to each other.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Full-Width Lifestyle Banner with Logo */}
      <section
        ref={(el) => addRef(el, 2)}
        className="campaign-section lifestyle-banner w-full overflow-hidden relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaignImages.lifestyle}
          alt="Campaign Lifestyle Shot"
          className="w-full h-auto object-cover"
        />
        {/* Logo Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={campaignImages.logoWhite}
            alt="INTU Logo"
            className="w-[280px] md:w-[400px] lg:w-[694px] h-auto object-contain"
          />
        </div>
      </section>

      {/* Section 5: Image Grid - 3 columns x 2 rows */}
      <section
        ref={(el) => addRef(el, 3)}
        className="campaign-section px-[15px] py-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[18px]">
          {[
            { src: campaignImages.grid1, alt: 'Campaign Shot 1' },
            { src: campaignImages.grid3, alt: 'Campaign Shot 2' },
            { src: campaignImages.grid5, alt: 'Campaign Shot 3' },
            { src: campaignImages.grid2, alt: 'Campaign Shot 4' },
            { src: campaignImages.grid4, alt: 'Campaign Shot 5' },
            { src: campaignImages.grid6, alt: 'Campaign Shot 6' },
          ].map((img, index) => (
            <div
              key={index}
              className="grid-cell relative aspect-square"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Campaign;