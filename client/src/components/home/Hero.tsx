import testBg from '../../assets/test-bg.mp4';

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-900 text-white">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source src={testBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure text readability if needed, though design asks for high contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Center Content: VIDEO Text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h1 className="text-6xl md:text-9xl font-bold italic tracking-tighter opacity-80 mix-blend-overlay">
          VIDEO
        </h1>
      </div>

      {/* Bottom Content: Tagline */}
      <div className="absolute bottom-8 left-0 w-full z-10 flex justify-center">
        <p className="text-[10px] md:text-xs tracking-[0.2em] font-light uppercase">
          SEEK THE KNOT
        </p>
      </div>
    </div>
  );
};

export default Hero;
