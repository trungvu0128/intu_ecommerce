'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

// Placeholder images for campaign - replace with actual images when available
// Using existing assets as placeholders
const placeholderImages = {
  hero: '/assets/logo-symbol.png',
  product1: '/assets/logo-symbol.png',
  product2: '/assets/LOGO_black.png',
  product3: '/assets/LOGO_white.png',
};

const Campaign = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      {/* Hero Section - INTU 25' CAMPAIGN */}
      <section className="pt-32 pb-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[20.072px] font-bold uppercase tracking-wide" style={{ fontFamily: 'Archivo, sans-serif' }}>
            INTU 25' CAMPAIGN
          </h2>
        </div>
      </section>

      {/* Main Hero Image */}
      <section className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white flex items-center justify-center">
          <Image
            src={placeholderImages.hero}
            alt="Campaign Hero"
            width={400}
            height={400}
            className="object-contain opacity-30"
          />
        </div>
      </section>

      {/* Campaign Title - "the choir without voice" */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[80px] md:text-[113.752px] font-bold leading-[1]" style={{ fontFamily: 'Archivo, sans-serif' }}>
            <span className="block">"the choir</span>
            <span className="block">without voice"</span>
          </h1>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16 border-t border-[#d9d9d9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Project Details */}
            <div>
              <h3 className="text-[25px] font-bold mb-8" style={{ fontFamily: 'Archivo, sans-serif' }}>
                Project Details
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between border-b border-[#d9d9d9] pb-4">
                  <span className="text-[#737172] text-[25px]" style={{ fontFamily: 'Archivo, sans-serif' }}>Campaign</span>
                  <span className="text-[#737172] text-[25px]" style={{ fontFamily: 'Archivo, sans-serif' }}>"the choir without voice"</span>
                </div>
                <div className="flex justify-between border-b border-[#d9d9d9] pb-4">
                  <span className="text-[#737172] text-[25px]" style={{ fontFamily: 'Archivo, sans-serif' }}>Year</span>
                  <span className="text-[#737172] text-[25px]" style={{ fontFamily: 'Archivo, sans-serif' }}>2025</span>
                </div>
              </div>
            </div>

            {/* Right Column - Description */}
            <div>
              <p className="text-[20px] leading-[1.6] whitespace-pre-line" style={{ fontFamily: 'Archivo, sans-serif' }}>
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
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black">
            {/* Product 1 - Jeans */}
            <div className="border-r border-b border-black p-8 relative min-h-[500px] flex flex-col">
              <div className="flex-grow flex items-center justify-center">
                <Image
                  src={placeholderImages.product1}
                  alt="The Back-Bite Jeans"
                  width={200}
                  height={300}
                  className="object-contain"
                />
              </div>
              <div className="mt-4">
                <p className="text-[20px] font-bold" style={{ fontFamily: 'Archivo, sans-serif' }}>THE BACK-BITE JEANS</p>
                <p className="text-[20px] text-gray-600" style={{ fontFamily: 'Archivo, sans-serif' }}>Color: Washed Blue</p>
                <p className="text-[20px] text-gray-600" style={{ fontFamily: 'Archivo, sans-serif' }}>Collection 01</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="border-r border-b border-black p-8 relative min-h-[500px] flex items-center justify-center">
              <Image
                src={placeholderImages.product2}
                alt="Campaign Product 2"
                width={300}
                height={400}
                className="object-contain"
              />
            </div>

            {/* Product 3 - Text Description */}
            <div className="border-b border-black p-8 relative min-h-[500px] flex items-center">
              <p className="text-[20px] leading-[1.6]" style={{ fontFamily: 'Archivo, sans-serif' }}>
                A truth understood without being spoken.
                The twins move like mirrors - two bodies, one mind - seeing what others ignore, sensing what others hide.
                Bound by threads both visible and unseen, they keep the wedding's secrets unspoken - because they have long whispered them to each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Banner */}
      <section className="w-full h-[600px] md:h-[800px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[24px] text-gray-400 mb-8" style={{ fontFamily: 'Archivo, sans-serif' }}>Campaign Banner</p>
          <Image
            src={placeholderImages.hero}
            alt="Campaign Banner"
            width={600}
            height={400}
            className="object-contain opacity-30"
          />
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src={placeholderImages.hero}
                  alt={`Campaign Image ${item}`}
                  width={150}
                  height={150}
                  className="object-contain opacity-30"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Campaign;