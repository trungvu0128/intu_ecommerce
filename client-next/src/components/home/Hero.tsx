'use client';

import { useEffect, useRef, useState } from 'react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Defer video loading until after first paint
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoLoaded && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoLoaded]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-900 text-white">
      {/* Background Video — deferred loading */}
      <div className="absolute inset-0 z-0">
        {videoLoaded && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover opacity-80"
          >
            <source src="/assets/test-bg.mp4" type="video/mp4" />
            <track kind="captions" />
          </video>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Bottom Content: Tagline */}
      <div className="absolute bottom-8 left-0 w-full z-10 flex flex-col items-center justify-center gap-1">
        <span className="text-[8px] md:text-[10px] tracking-[0.2em] font-light lowercase opacity-90">
          shop now
        </span>
        <p className="text-[10px] md:text-xs tracking-[0.2em] font-light uppercase">
          SS01 | THE KNOT
        </p>
      </div>
    </div>
  );
};

export default Hero;
