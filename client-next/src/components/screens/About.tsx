import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const InfinitySymbol = () => (
  <div className="w-48 h-24 md:w-64 md:h-32 mb-8">
    <img 
      src="/assets/logo-symbol.png" 
      alt="Infinity Symbol" 
      className="w-full h-full object-contain"
    />
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center pt-32 pb-20 px-4 md:px-8 text-center">
        
        {/* Infinity Logo */}
        <div className="mb-12">
            <InfinitySymbol />
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-light mb-12 tracking-wide">&quot;About Us&quot;</h1>

        {/* First Text Block */}
        <div className="max-w-2xl space-y-6 text-[11px] md:text-[13px] leading-relaxed tracking-wide font-light text-zinc-800">
          <p>We were born from pure dreams, where freedom has no boundaries.</p>
          <p>Where young souls are both fragile and eager to break the mold.</p>
          <p>For us, fashion is not to hide, but to reveal.</p>
          <p>Not to force yourself to stand out, but to be yourself - naturally different.</p>
          <p>Each design is a play between light and rebellion:</p>
          <p>Pure, yet bold cuts.<br/>
          Clear details, yet not naive.<br/>
          A blend of the sweetness of an angel and the strength of a rebel.</p>
          <p>We believe that the most beautiful rebellion is not screaming, but when you dare to quietly shine in your own way.</p>
          <p>When you wear it, it is not just clothes but wings to fly, and a declaration to be different.</p>
        </div>

        {/* Mission Button */}
        <div className="my-16">
          <span className="bg-black text-white px-6 py-2 text-[10px] tracking-[0.2em] font-medium uppercase">
            OUR MISSION
          </span>
        </div>

        {/* Second Text Block */}
        <div className="max-w-3xl space-y-8 text-[11px] md:text-[13px] leading-relaxed tracking-wide font-light text-zinc-800">
          <p>To be an Asian fashion brand with a modern rebellious spirit, where boldness and practicality intersect.</p>
          <p>To affirm the lifestyle of a distinct generation.</p>
          <p className="max-w-2xl mx-auto">Product design balances between practicality (can be worn every day) and statement elements (make a difference when appearing).</p>
          <p>Empowering Vietnamese and Asian youth with confidence through fashion.</p>
          <p>turning clothes into a language to tell personal stories.</p>
          <p>Exploiting local cultural values and identities and then reproducing them in international languages, to bring Vietnamese brand images into the global flow.</p>
          <p>Committing to sustainability in materials and production, aiming for a long-term business model.</p>
        </div>

        {/* Values Block */}
        <div className="mt-16 space-y-4 text-[11px] md:text-[13px] leading-relaxed tracking-wide font-light text-zinc-800">
            <p><span className="font-medium">Edgy:</span> There is always a rebellious twist in every design.</p>
            <p><span className="font-medium">Intuitive:</span> Design based on intuition, personal inspiration but connected to the wearer&apos;s emotions.</p>
            <p><span className="font-medium">Sustainable:</span> Not just a product, but a long-term lifestyle.</p>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default About;
