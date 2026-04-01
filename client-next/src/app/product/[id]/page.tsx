import ProductDetail from '@/components/screens/ProductDetail';
import { ProductPageSwitch } from '@/components/mobile/ProductPageSwitch';
import { ProductService } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
  try {
    const product = isUuid
      ? await ProductService.getById(id)
      : await ProductService.getBySlug(id);
    if (!product) return { title: 'Product Not Found | INTU∞' };
    
    const imageUrl = product.images?.[0]?.url || '/og-image.jpg';
    
    return {
      title: `${product.name} | INTU∞`,
      description: product.description?.substring(0, 160) || 'View product details.',
      openGraph: {
        title: `${product.name} | INTU∞`,
        description: product.description?.substring(0, 160) || 'View product details.',
        images: [imageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | INTU∞`,
        description: product.description?.substring(0, 160),
        images: [imageUrl],
      }
    };
  } catch (error) {
    return {
      title: `INTU∞ | Product ${id}`,
      description: 'View product details.',
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
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.map(img => img.url) || [],
        description: product.description,
        sku: product.id,
        offers: {
          '@type': 'Offer',
          price: product.basePrice,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
          url: `https://intuoo.com/product/${product.id}`,
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
      
      {/* Inject Structured Data JSON-LD for Search Engines */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
}
