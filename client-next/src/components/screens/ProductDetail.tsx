import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/product/ImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductCard from '@/components/home/ProductCard';

import { ProductService } from '@/lib/api';

interface ProductDetailProps {
  id: string;
}

const ProductDetail = async ({ id }: ProductDetailProps) => {
  let product;
  try {
    // Check if id is a valid UUID
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    if (isUuid) {
      product = await ProductService.getById(id);
    } else {
      product = await ProductService.getBySlug(id);
    }

    if (!product) {
      throw new Error("Product not found");
    }
  } catch (err: any) {
    console.error("Error fetching product:", err);
    return (
      <div className="min-h-screen flex flex-col bg-white text-black font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase mb-4">Product Not Found</h1>
          {process.env.NODE_ENV !== 'production' && (
            <div className="bg-red-50 p-4 rounded border border-red-200 max-w-2xl w-full overflow-auto">
              <p className="text-red-600 font-mono text-sm whitespace-pre-wrap">
                Debug Error: {err?.message || JSON.stringify(err)}
              </p>
              {err?.response && (
                <div className="mt-2">
                  <p className="font-bold text-red-700">Status: {err.response.status}</p>
                  <pre className="text-xs text-red-600 mt-1">{JSON.stringify(err.response.data, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch related products (we just take top products differing from current id)
  let relatedProducts: any[] = [];
  try {
    const relatedResponse = await ProductService.getAll({ pageSize: 5 });
    // If relatedResponse is array, use it directly. If it has items, use items.
    const productsList = Array.isArray(relatedResponse) ? relatedResponse : (relatedResponse as any).items || [];
    relatedProducts = productsList.filter((p: any) => p.id !== product?.id).slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products", error);
  }

  const mainImageURL = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || "";
  const hoverImageURL = product.images?.find(img => !img.isMain)?.url;

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Gallery Section */}
        <ImageGallery images={hoverImageURL ? [mainImageURL, hoverImageURL] : [mainImageURL]} />

        {/* Product Info Section */}
        <div className="max-w-7xl mx-auto">
          <ProductInfo 
            id={String(product.id)}
            slug={product.slug}
            name={product.name}
            price={`${new Intl.NumberFormat('vi-VN').format(product.basePrice)} VND`}
            image={mainImageURL}
            image2={hoverImageURL}
            sizes={product.variants?.map(v => v.size) || ["S", "M", "L"]} // real sizes from variant DTOs
            variants={product.variants || []}
            description={product.description || "Made from premium materials, this piece features a comfortable fit."}
            styleId={`STYLE-${product.id.substring(0,6).toUpperCase()}`}
          />
        </div>

        {/* Related Products Section */}
        <div className="py-20 bg-white border-t border-zinc-100">
          <h2 className="text-sm md:text-base tracking-[0.2em] font-bold uppercase text-center mb-16">
            YOU MAY ALSO LIKE
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-0 gap-y-8">
            {relatedProducts.map((relProduct) => {
              const relMainImageURL = relProduct.images?.find((img: { isMain: boolean; url: string }) => img.isMain)?.url || relProduct.images?.[0]?.url || "";
              const relHoverImageURL = relProduct.images?.find((img: { isMain: boolean; url: string }) => !img.isMain)?.url;
              return (
                  <ProductCard
                    key={relProduct.id}
                    id={relProduct.id}
                    slug={relProduct.slug}
                    image={relMainImageURL}
                  image2={relHoverImageURL}
                  name={relProduct.name}
                  price={`${new Intl.NumberFormat('vi-VN').format(relProduct.basePrice)} VND`}
                  imageContainerClassName="bg-[#f5f5f5] aspect-[3/4]"
                  textAlign="left"
                />
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
