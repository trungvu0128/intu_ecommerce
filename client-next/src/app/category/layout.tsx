import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All – Browse Our Collection',
  description: 'Browse the full INTU∞ collection. Shop premium jackets, bombers, denim, and modern streetwear. Filter by category, style, and price. Free nationwide shipping.',
  openGraph: {
    title: 'Shop All – INTU∞ Collection',
    description: 'Browse and shop the full INTU∞ premium streetwear collection.',
    type: 'website',
  },
  alternates: {
    canonical: '/category/shop-all',
  },
};

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
