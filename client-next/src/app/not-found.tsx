import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found. Browse our collection or return to the homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-[120px] md:text-[200px] font-bold leading-none tracking-tighter text-zinc-100 select-none">
        404
      </h1>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest mb-4">
          Page Not Found
        </h2>
        <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/category/shop-all"
            className="px-8 py-3 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors"
          >
            Shop All
          </Link>
        </div>
      </div>
    </div>
  );
}
