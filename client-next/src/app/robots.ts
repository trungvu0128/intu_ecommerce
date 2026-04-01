import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://intuoo.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/checkout',
          '/payment-success',
          '/payment-failed',
          '/account',
          '/orders',
          '/addresses',
          '/recover',
          '/cart',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/checkout',
          '/payment-success',
          '/payment-failed',
          '/account',
          '/orders',
          '/addresses',
          '/recover',
          '/cart',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
