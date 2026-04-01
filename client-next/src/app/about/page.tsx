import type { Metadata } from 'next';
import About from '@/components/screens/About';
import { AboutPageSwitch } from '@/components/mobile/AboutPageSwitch';

export const metadata: Metadata = {
  title: 'About Us – Our Story & Mission',
  description: 'Learn about INTU∞ – a premium Vietnamese streetwear brand born from rebellion and modern street culture. Discover our story, values, and creative vision.',
  openGraph: {
    title: 'About INTU∞ – Our Story & Mission',
    description: 'Discover the story behind INTU∞ – Vietnam\'s premium streetwear brand crafting bold, modern rebel fashion.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <AboutPageSwitch>
      <About />
    </AboutPageSwitch>
  );
}
