import Category from '@/components/screens/Category';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const categoryName = slug.map(s => decodeURIComponent(s)).join(' ');
  return {
    title: `INTU∞ | ${categoryName.toUpperCase()}`,
    description: `Shop the ${categoryName} collection.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <Category slug={slug} />;
}
