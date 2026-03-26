import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://intuoo.com'), // Adjust this to the real production URL
  title: "INTU∞ | High Fashion E-commerce",
  description: "High Fashion E-commerce Store",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "INTU∞ | High Fashion E-commerce",
    description: "High Fashion E-commerce Store",
    url: 'https://intuoo.com',
    siteName: 'INTU∞',
    images: [
      {
        url: '/og-image.jpg', // Recommend adding an image later for social sharing
        width: 1200,
        height: 630,
        alt: 'INTU∞ High Fashion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "INTU∞ | High Fashion E-commerce",
    description: "Elevate your style with INTU∞.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} font-sans antialiased bg-black text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
