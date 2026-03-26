'use client';

import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 relative">
        <h1 className="text-[120px] md:text-[200px] font-bold leading-none tracking-tighter text-zinc-100 select-none">
          500
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-4 pt-20">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">
            We apologize for the inconvenience. An unexpected error occurred on our server.
          </p>
          <button
            onClick={reset}
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
