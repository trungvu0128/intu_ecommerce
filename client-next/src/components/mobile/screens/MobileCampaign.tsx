'use client';

import Image from 'next/image';
import MobileLayout from '@/components/mobile/MobileLayout';
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

const MobileCampaign = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mcampaign-visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
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
    <MobileLayout showFooter={true}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        
        .mcampaign-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .mcampaign-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .m-grid-cell {
          overflow: hidden;
        }

        .m-grid-cell img {
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .m-lifestyle-banner {
          position: relative;
        }

        .m-lifestyle-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.12);
          pointer-events: none;
        }
      `}</style>

      <div className="bg-white text-black pb-8" style={{ fontFamily: "'Archivo', sans-serif" }}>
        
        {/* Section 1: Hero Banner */}
        <section 
          className={`relative w-full h-[50vh] overflow-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={campaignImages.hero}
            alt="INTU Campaign - The Choir Without Voice"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </section>

        {/* Section 2: Campaign Info */}
        <section
          ref={(el) => addRef(el, 0)}
          className="mcampaign-section px-4 pt-6 pb-8"
        >
          <p className="text-[14px] font-bold uppercase tracking-wide mb-5">
            INTU 25&apos; CAMPAIGN
          </p>

          {/* Title */}
          <h1 className="text-[42px] font-bold leading-[0.95] tracking-tight mb-8">
            <span className="block">&ldquo;the choir</span>
            <span className="block">without voice&rdquo;</span>
          </h1>

          {/* Project Details */}
          <h3 className="text-[18px] font-bold mb-4">
            Project Details
          </h3>

          <div className="space-y-0 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-[#d9d9d9]">
              <span className="text-[#737172] text-[14px]">Campaign</span>
              <span className="text-[#737172] text-[14px]">&ldquo;the choir without voice&rdquo;</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#d9d9d9]">
              <span className="text-[#737172] text-[14px]">Year</span>
              <span className="text-[#737172] text-[14px]">2025</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-[14px] leading-[1.7] text-black">
              How is purity measured, and by whose standards?
              In a wedding where guests gather to celebrate the bride and groom,
              what shadows do they hide beneath their own polished vows?
            </p>
            <p className="text-[14px] leading-[1.7] text-black">
              As the camera pulls away from the bride in black, the celebration fractures—
              each guest lost in jealousies and unspoken desires,
              a silent chorus humming beneath the surface.
            </p>
            <p className="text-[14px] leading-[1.7] text-black">
              She stands at the center, seen yet profoundly isolated.
              Here, beauty is not purity, and purity is not light—it is the courage to be witnessed in all one&apos;s contradictions.
              This is a story of what weddings don&apos;t reveal,
              and the harmony found in the truths no one dares to sing.
            </p>
          </div>
        </section>

        {/* Section 3: Product Showcase */}
        <section
          ref={(el) => addRef(el, 1)}
          className="mcampaign-section"
        >
          <div className="px-4 mb-2">
            <div className="flex items-baseline gap-4">
              <h2 className="text-[16px] font-bold uppercase">THE BACK-BITE JEANS</h2>
              <span className="text-[14px] text-black">Collection 01</span>
            </div>
            <p className="text-[14px] text-black mt-1 mb-4">Color: Washed Blue</p>
          </div>

          {/* Stacked product images */}
          <div className="border-t border-black">
            <div className="relative w-full aspect-[3/4] border-b border-black overflow-hidden">
              <Image
                src={campaignImages.product1}
                alt="The Back-Bite Jeans - Front View"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="relative w-full aspect-[3/4] border-b border-black overflow-hidden">
              <Image
                src={campaignImages.product2}
                alt="The Back-Bite Jeans - Detail"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="bg-white p-6">
              <p className="text-[14px] leading-[1.7] text-black">
                A truth understood without being spoken.
                The twins move like mirrors - two bodies, one mind - seeing what others ignore, sensing what others hide.
                Bound by threads both visible and unseen, they keep the wedding&apos;s secrets unspoken - because they have long whispered them to each other.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Lifestyle Banner with Logo */}
        <section
          ref={(el) => addRef(el, 2)}
          className="mcampaign-section m-lifestyle-banner relative w-full aspect-[16/9] overflow-hidden"
        >
          <Image
            src={campaignImages.lifestyle}
            alt="Campaign Lifestyle Shot"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative w-[200px] h-[28px]">
              <Image
                src={campaignImages.logoWhite}
                alt="INTU Logo"
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
          </div>
        </section>

        {/* Section 5: Image Grid - 2 columns */}
        <section
          ref={(el) => addRef(el, 3)}
          className="mcampaign-section px-2 py-3"
        >
          <div className="grid grid-cols-2 gap-2">
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
                className="m-grid-cell relative aspect-square"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </MobileLayout>
  );
};

export default MobileCampaign;
