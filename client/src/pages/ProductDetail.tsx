import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/product/ImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductCard from '@/components/home/ProductCard';
import { useParams } from 'react-router-dom';

import { MOCK_PRODUCTS } from '@/mock-data';

const ProductDetail = () => {
  const { id } = useParams();
  // Use 'id' to fetch product details in a real application
  
  // Find the product in our mock data or default to the first one for the detail view
  // In a real app, this would be an API call
  const product = MOCK_PRODUCTS.find(p => String(p.id) === id) || MOCK_PRODUCTS[0];
  
  // Mock related products (just filter out current product)
  const relatedProducts = MOCK_PRODUCTS.filter(p => String(p.id) !== id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Gallery Section */}
        <ImageGallery images={product.image2 ? [product.image, product.image2] : [product.image]} />

        {/* Product Info Section */}
        <div className="max-w-7xl mx-auto">
          <ProductInfo 
            id={String(product.id)}
            name={product.name}
            price={product.price}
            image={product.image}
            image2={product.image2}
            sizes={["S", "M", "L"]} // Mock sizes as they aren't in the base mock data
            description="Made from premium materials, this piece features a comfortable fit and timeless design. Perfect for any occasion."
            styleId={`STYLE-${product.id}`}
          />
        </div>

        {/* Related Products Section */}
        <div className="py-20 bg-white border-t border-zinc-100">
          <h2 className="text-sm md:text-base tracking-[0.2em] font-bold uppercase text-center mb-16">
            YOU MAY ALSO LIKE
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-0 gap-y-8">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                image2={product.image2}
                name={product.name}
                price={product.price}
                imageContainerClassName="bg-[#f5f5f5] aspect-[3/4]"
                textAlign="left"
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
