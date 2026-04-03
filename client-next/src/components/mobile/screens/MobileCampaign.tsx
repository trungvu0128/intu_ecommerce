'use client';

import Image from 'next/image';
import MobileLayout from '@/components/mobile/MobileLayout';

// Placeholder images for campaign - replace with actual images when available
const placeholderImages = {
  hero: '/assets/logo-symbol.png',
  product1: '/assets/logo-symbol.png',
  product2: '/assets/LOGO_black.png',
  product3: '/assets/LOGO_white.png',
};

const MobileCampaign = () => {
  return (
    <MobileLayout showFooter={true}>
      <div className="bg-white text-black font-sans pb-12">
        {/* Hero Section - INTU 25' CAMPAIGN */}
        <section className="pt-24 pb-6 px-4">
          <h2 className="text-[16px] font-bold uppercase tracking-wide" style={{ fontFamily: 'Archivo, sans-serif' }}>
            INTU 25' CAMPAIGN
          </h2>
        </section>

        {/* Main Hero Image */}
        <section className="relative w-full h-[40vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white flex items-center justify-center">
            <Image
              src={placeholderImages.hero}
              alt="Campaign Hero"
              width={200}
              height={200}
              className="object-contain opacity-30"
            />
          </div>
        </section>

        {/* Campaign Title - "the choir without voice" */}
        <section className="py-12 px-4">
          <h1 className="text-[50px] font-bold leading-[1]" style={{ fontFamily: 'Archivo, sans-serif' }}>
            <span className="block">"the choir</span>
            <span className="block">without voice"</span>
          </h1>
        </section>

        {/* Project Details Section */}
        <section className="py-8 px-4 border-t border-[#d9d9d9]">
          <h3 className="text-[20px] font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>
            Project Details
          </h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between border-b border-[#d9d9d9] pb-3">
              <span className="text-[#737172] text-[16px]" style={{ fontFamily: 'Archivo, sans-serif' }}>Campaign</span>
              <span className="text-[#737172] text-[16px] text-right" style={{ fontFamily: 'Archivo, sans-serif' }}>"the choir without voice"</span>
            </div>
            <div className="flex justify-between border-b border-[#d9d9d9] pb-3">
              <span className="text-[#737172] text-[16px]" style={{ fontFamily: 'Archivo, sans-serif' }}>Year</span>
              <span className="text-[#737172] text-[16px]" style={{ fontFamily: 'Archivo, sans-serif' }}>2025</span>
            </div>
          </div>

          <p className="text-[16px] leading-[1.6] whitespace-pre-line" style={{ fontFamily: 'Archivo, sans-serif' }}>
            How is purity measured, and by whose standards?
            In a wedding where guests gather to celebrate the bride and groom,
            what shadows do they hide beneath their own polished vows?

            As the camera pulls away from the bride in black, the celebration fractures—
            each guest lost in jealousies and unspoken desires,
            a silent chorus humming beneath the surface.

            She stands at the center, seen yet profoundly isolated.
            Here, beauty is not purity, and purity is not light—it is the courage to be witnessed in all one's contradictions.
            This is a story of what weddings don't reveal,
            and the harmony found in the truths no one dares to sing.
          </p>
        </section>

        {/* Product Showcase Section */}
        <section className="py-8 px-4">
          <div className="flex flex-col border border-black">
            {/* Product 1 - Jeans */}
            <div className="border-b border-black p-6 relative min-h-[300px] flex flex-col">
              <div className="flex-grow flex items-center justify-center mb-6">
                <Image
                  src={placeholderImages.product1}
                  alt="The Back-Bite Jeans"
                  width={150}
                  height={250}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-[16px] font-bold" style={{ fontFamily: 'Archivo, sans-serif' }}>THE BACK-BITE JEANS</p>
                <p className="text-[16px] text-gray-600" style={{ fontFamily: 'Archivo, sans-serif' }}>Color: Washed Blue</p>
                <p className="text-[16px] text-gray-600" style={{ fontFamily: 'Archivo, sans-serif' }}>Collection 01</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="border-b border-black p-8 relative min-h-[300px] flex items-center justify-center">
              <Image
                src={placeholderImages.product2}
                alt="Campaign Product 2"
                width={200}
                height={300}
                className="object-contain"
              />
            </div>

            {/* Product 3 - Text Description */}
            <div className="p-6 relative min-h-[250px] flex items-center">
              <p className="text-[16px] leading-[1.6]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                A truth understood without being spoken.
                The twins move like mirrors - two bodies, one mind - seeing what others ignore, sensing what others hide.
                Bound by threads both visible and unseen, they keep the wedding's secrets unspoken - because they have long whispered them to each other.
              </p>
            </div>
          </div>
        </section>

        {/* Full Width Banner */}
        <section className="w-full h-[400px] bg-gray-100 flex items-center justify-center my-8">
          <div className="text-center px-4">
            <p className="text-[18px] text-gray-400 mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>Campaign Banner</p>
            <Image
              src={placeholderImages.hero}
              alt="Campaign Banner"
              width={300}
              height={200}
              className="object-contain opacity-30 mx-auto"
            />
          </div>
        </section>

        {/* Image Grid Section */}
        <section className="py-8 px-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src={placeholderImages.hero}
                  alt={`Campaign Image ${item}`}
                  width={100}
                  height={100}
                  className="object-contain opacity-30"
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
