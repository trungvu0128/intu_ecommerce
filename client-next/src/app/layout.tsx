import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://intuoo.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "INTU∞ | Premium Streetwear & High Fashion from Vietnam",
    template: "%s | INTU∞",
  },
  description: "INTU∞ – Premium Vietnamese streetwear brand. Explore our curated collection of jackets, bombers, denim and modern rebel fashion. Free nationwide shipping.",
  keywords: [
    "INTU", "INTUOO", "streetwear", "high fashion", "Vietnamese fashion brand",
    "premium jackets", "bomber jacket", "denim jacket", "designer streetwear",
    "Vietnam fashion", "urban fashion", "contemporary fashion", "luxury streetwear",
    "buy clothes online Vietnam", "rebel fashion", "modern street style",
  ],
  authors: [{ name: "INTU∞", url: BASE_URL }],
  creator: "INTU∞",
  publisher: "INTU∞",
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "INTU∞ | Premium Streetwear & High Fashion from Vietnam",
    description: "Discover INTU∞ – Vietnam's premium streetwear brand. Curated collections of jackets, bombers, and modern rebel fashion. Free nationwide shipping.",
    url: BASE_URL,
    siteName: 'INTU∞',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'INTU∞ – Premium Streetwear & High Fashion from Vietnam',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "INTU∞ | Premium Streetwear & High Fashion from Vietnam",
    description: "Discover INTU∞ – Vietnam's premium streetwear brand with modern rebel fashion.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE',
  },
  category: 'fashion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${archivo.variable} font-sans antialiased bg-black text-white`}>
        <JsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
