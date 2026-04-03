

import { headers } from 'next/headers';
import Home from '@/components/screens/Home';
import MobileHome from '@/components/mobile/screens/MobileHome';

async function getFeaturedSections() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7101'}/api/FeaturedSections`, {
      next: { revalidate: 60 }
    });
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    return [];
  }
}

export default async function HomePage() {
  const sections = await getFeaturedSections();
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  if (isMobile) {
    return <MobileHome initialSections={sections} />;
  }

  return <Home initialSections={sections} />;
}
