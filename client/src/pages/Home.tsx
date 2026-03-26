import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import ProductGrid from '@/components/home/ProductGrid';
import Banner from '@/components/home/Banner';
import DualBanner from '@/components/home/DualBanner';
import Footer from '@/components/layout/Footer';

import { MOCK_PRODUCTS } from '@/mock-data';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <Hero />

        {/* First Product Row */}
        <ProductGrid products={MOCK_PRODUCTS} />

        {/* Wide Banner */}
        <Banner
          image="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&h=600&auto=format&fit=crop"
          title="THE SKY TANKTOP"
          aspectRatio="aspect-[21/9]"
          link="/category/sky-tanktop"
        />

        {/* Dual Banner */}
        <DualBanner
          leftImage="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&h=1200&auto=format&fit=crop"
          leftTitle="THE SKY TANKTOP"
          leftLink="/category/left-collection"
          rightImage="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=800&h=1200&auto=format&fit=crop"
          rightTitle="THE SKY TANKTOP"
          rightLink="/category/right-collection"
        />

        {/* Second Product Row */}
        <ProductGrid products={MOCK_PRODUCTS} />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
