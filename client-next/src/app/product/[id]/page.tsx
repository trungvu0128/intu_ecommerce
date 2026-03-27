import ProductDetail from '@/components/screens/ProductDetail';
import { ProductPageSwitch } from '@/components/mobile/ProductPageSwitch';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `INTU∞ | Product ${id}`,
    description: 'View product details.',
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ProductPageSwitch id={id}>
      <ProductDetail id={id} />
    </ProductPageSwitch>
  );
}
