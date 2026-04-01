import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ContactPageSwitch } from '@/components/mobile/ContactPageSwitch';

export const metadata: Metadata = {
  title: 'Contact Us – Get in Touch',
  description: 'Have questions about your order or our collections? Contact the INTU∞ team via email or phone. We\'re here to help with sizing, shipping, and more.',
  openGraph: {
    title: 'Contact INTU∞ – Get in Touch',
    description: 'Reach out to the INTU∞ team for support, inquiries, or collaborations.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact INTU∞',
  description: 'Get in touch with the INTU∞ team for support, orders, and collaborations.',
  mainEntity: {
    '@type': 'Organization',
    name: 'INTU∞',
    email: 'intuoo@gmail.com',
    telephone: '+84-931-202-22',
  },
};

export default function ContactPage() {
  return (
    <ContactPageSwitch>
      <div className="min-h-screen bg-white text-black font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Contact Us</h1>
          <p className="text-sm text-zinc-600 mb-8">
            We&apos;d love to hear from you. Please reach out to us via email or phone.
          </p>
          <div className="space-y-2 text-sm">
            <p>Email: intuoo@gmail.com</p>
            <p>Phone: 093120222</p>
          </div>
        </main>
        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
        />
      </div>
    </ContactPageSwitch>
  );
}
