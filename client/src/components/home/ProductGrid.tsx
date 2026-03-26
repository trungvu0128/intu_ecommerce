import { useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  image: string;
  image2?: string;
  name: string;
  price: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const swiperWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!swiperWrapperRef.current) return;

      // Select the actual slides from swiper
      const slides = swiperWrapperRef.current.querySelectorAll('.swiper-slide');

      if (slides.length > 0) {
        gsap.fromTo(
          gsap.utils.toArray(slides),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  return (
    <section ref={sectionRef} className="relative p-5 bg-white text-black w-full overflow-hidden">
      <div className="w-full" ref={swiperWrapperRef}>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          loop={products.length > 4}
          autoplay={
            products.length > 4
              ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }
              : false
          }
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 32 }
          }}
          className="w-full"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                id={product.id}
                image={product.image}
                image2={product.image2}
                name={product.name}
                price={product.price}
                className="w-full h-full pb-6"
                imageContainerClassName="rounded-none bg-[#F9F9F9]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductGrid;
