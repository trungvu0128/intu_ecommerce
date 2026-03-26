import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const InfinitySymbol = () => (
  <svg 
    width="120" 
    height="60" 
    viewBox="0 0 120 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-48 h-24 md:w-64 md:h-32 mb-8"
  >
    <path 
      d="M30 30C10 30 10 50 30 50C45 50 55 35 60 30C65 25 75 10 90 10C110 10 110 30 90 30C75 30 65 45 60 50C55 55 45 70 30 70C10 70 -10 50 10 30C15 15 25 10 30 10Z" 
      stroke="black" 
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="hidden" // Hiding the path for now as the custom path might be tricky to get right without preview. Using a simpler infinity path below.
    />
    <path
      d="M36.4 28.5C36.4 36.6 29.8 43.2 21.7 43.2C13.6 43.2 7 36.6 7 28.5C7 20.4 13.6 13.8 21.7 13.8C27.5 13.8 32.5 17.2 34.9 22.1L36.4 25.5L40.5 34.5C42.9 39.4 47.9 42.8 53.7 42.8C61.8 42.8 68.4 36.2 68.4 28.1C68.4 20 61.8 13.4 53.7 13.4C47.9 13.4 42.9 16.8 40.5 21.7L36.4 28.5Z"
      stroke="black"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      transform="scale(1.5)"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      display="none"
    />
    {/* A more robust hand-drawn style infinity symbol using standard SVG path for infinity */}
    <path 
      d="M28.5,30c-9.9,0-18-8.1-18-18s8.1-18,18-18c6.6,0,12.5,3.6,15.5,8.8l3,5.2l3-5.2c3-5.2,8.9-8.8,15.5-8.8c9.9,0,18,8.1,18,18s-8.1,18-18,18c-6.6,0-12.5-3.6-15.5-8.8l-3-5.2l-3,5.2C41,26.4,35.1,30,28.5,30z" 
      transform="translate(10, 20) scale(1.5)"
      stroke="black" 
      strokeWidth="4" 
      fill="none"
      strokeLinecap="round"
      display="none"
    />
    {/* Simple thick stroke infinity */}
    <path
        d="M30,30 C10,30 5,10 30,10 C45,10 55,25 60,30 C65,35 75,50 90,50 C115,50 110,30 90,30 C75,30 65,45 60,40 C55,35 45,20 30,20"
        stroke="black"
        strokeWidth="0"
        fill="none"
    />
    {/* Correct mathematical infinity symbol path */}
    <path
      d="M60 30C75 45 95 55 105 45C115 35 105 15 90 15C75 15 65 25 60 30M60 30C45 15 25 5 15 15C5 25 15 45 30 45C45 45 55 35 60 30"
      stroke="black"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
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
