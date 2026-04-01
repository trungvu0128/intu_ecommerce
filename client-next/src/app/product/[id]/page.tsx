import type { Metadata } from 'next';
import ProductDetail from '@/components/screens/ProductDetail';
import { ProductPageSwitch } from '@/components/mobile/ProductPageSwitch';
import { ProductService } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  try {
    const product = isUuid
      ? await ProductService.getById(id)
      : await ProductService.getBySlug(id);
    if (!product) return { title: 'Product Not Found | INTU∞' };
    
    const imageUrl = product.images?.[0]?.url || '/og-image.jpg';
    const description = product.description?.substring(0, 160) || `Shop ${product.name} – premium streetwear from INTU∞. Free nationwide shipping.`;
    const price = product.basePrice;
    
    return {
      title: product.name,
      description,
      openGraph: {
        title: `${product.name} | INTU∞`,
        description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | INTU∞`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/product/${product.slug || id}`,
      },
    };
  } catch {
    return {
      title: `Product | INTU∞`,
      description: 'Explore premium streetwear products from INTU∞.',
    };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  let jsonLd = null;
  try {
    const product = isUuid
      ? await ProductService.getById(id)
      : await ProductService.getBySlug(id);
    if (product) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://intuoo.com';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.map((img: any) => img.url) || [],
        description: product.description,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'INTU∞',
        },
        offers: {
          '@type': 'Offer',
          price: product.basePrice,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/product/${product.slug || product.id}`,
          seller: {
            '@type': 'Organization',
            name: 'INTU∞',
          },
        },
      };
    }
  } catch (error) {
    console.error('Failed to generate JSON-LD:', error);
  }

  return (
    <>
      <ProductPageSwitch id={id}>
        <ProductDetail id={id} />
      </ProductPageSwitch>
      
      {/* Product Structured Data for Rich Search Results */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
