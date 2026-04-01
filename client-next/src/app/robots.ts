import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/checkout', 
        '/payment-success', 
        '/payment-failed',
        '/account',
        '/orders',
        '/addresses'
      ],
    },
    // Replace with actual production URL
    sitemap: 'https://intuoo.com/sitemap.xml',
  };
}
