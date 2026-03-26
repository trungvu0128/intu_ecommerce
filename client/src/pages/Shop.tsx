import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/home/ProductCard";
import { MOCK_PRODUCTS, PRODUCT_COLORS, PRODUCT_CATEGORIES } from "@/mock-data";
import type { Product } from "@/mock-data";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "best-selling";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest to Oldest" },
  { value: "oldest", label: "Oldest to Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
];

const ITEMS_PER_PAGE = 8;

const Shop = () => {
  // Filter & sort state
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Lazy loading state
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle color filter
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
    setVisibleCount(ITEMS_PER_PAGE); // reset pagination on filter change
  };

  // Set category
  const handleCategory = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Computed: filtered + sorted products
  const filteredProducts = useMemo(() => {
    let result: Product[] = [...MOCK_PRODUCTS];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter((p) => selectedColors.includes(p.color));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-low":
        result.sort((a, b) => a.priceNum - b.priceNum);
        break;
      case "price-high":
        result.sort((a, b) => b.priceNum - a.priceNum);
        break;
      case "best-selling":
        // Simulate best selling with a deterministic shuffle
        result.sort((a, b) => (a.id * 7 + 3) % 11 - (b.id * 7 + 3) % 11);
        break;
    }

    return result;
  }, [selectedCategory, selectedColors, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Intersection observer for lazy loading
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    // Simulate a slight delay for loading feel
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 400);
  }, [hasMore, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    const current = loadMoreRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loadMore]);

  // Reset visible count when filters/sort change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [sortBy]);

  const activeFilterCount =
    selectedColors.length + (selectedCategory !== "All" ? 1 : 0);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "";

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Page header */}
        <div className="text-center py-12 md:py-16 px-6">
          <h1 className="text-[15px] md:text-[17px] tracking-[0.3em] font-bold uppercase">
            FANCY'S ESSENTIALS
          </h1>
          <p className="mt-2 text-[11px] tracking-[0.1em] text-zinc-400 uppercase">
            {filteredProducts.length} products
          </p>
        </div>

        {/* Sort & Filter toolbar */}
        <div className="sticky top-[56px] z-30 bg-white/95 backdrop-blur-sm border-y border-zinc-100">
          <div className="max-w-[1920px] mx-auto px-4 md:px-8 flex items-center justify-between h-12">
            {/* Sort (Left) */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase hover:opacity-60 transition-opacity"
              >
                <span className="text-zinc-400">Sort by</span>
                <span className="font-bold">{currentSortLabel}</span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "transition-transform duration-200",
                    isSortOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Sort dropdown */}
              {isSortOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-zinc-100 shadow-lg min-w-[220px] z-40">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[10px] tracking-[0.1em] uppercase transition-colors hover:bg-zinc-50",
                        sortBy === opt.value
                          ? "font-bold text-black"
                          : "text-zinc-500"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter button (Right) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase hover:opacity-60 transition-opacity"
            >
              <span className="font-bold">Filter</span>
              {activeFilterCount > 0 && (
                <span className="bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
              <SlidersHorizontal size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out bg-zinc-50 border-b border-zinc-100",
            isFilterOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6 md:py-8">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              {/* Category filter */}
              <div>
                <h3 className="text-[10px] tracking-[0.15em] font-bold uppercase mb-4 text-zinc-400">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategory(cat)}
                      className={cn(
                        "px-4 py-2 text-[10px] tracking-[0.1em] uppercase border transition-all duration-200",
                        selectedCategory === cat
                          ? "bg-black text-white border-black"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-black"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color filter */}
              <div>
                <h3 className="text-[10px] tracking-[0.15em] font-bold uppercase mb-4 text-zinc-400">
                  Color
                </h3>
                <div className="flex flex-wrap gap-3">
                  {PRODUCT_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={cn(
                        "group relative w-7 h-7 rounded-full border-2 transition-all duration-200",
                        selectedColors.includes(color.name)
                          ? "border-black scale-110"
                          : "border-transparent hover:border-zinc-300"
                      )}
                      title={color.name}
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColors.includes(color.name) && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke={
                              color.name === "Black" ||
                              color.name === "Navy" ||
                              color.name === "Brown" ||
                              color.name === "Green"
                                ? "white"
                                : "black"
                            }
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedColors([]);
                      setSelectedCategory("All");
                    }}
                    className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-zinc-500 hover:text-black transition-colors"
                  >
                    <X size={12} />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 md:py-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[13px] tracking-[0.1em] text-zinc-400 uppercase">
                No products match your filters
              </p>
              <button
                onClick={() => {
                  setSelectedColors([]);
                  setSelectedCategory("All");
                }}
                className="mt-4 px-6 py-2.5 bg-black text-white text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-zinc-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
                {visibleProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${(index % ITEMS_PER_PAGE) * 60}ms`,
                    }}
                  >
                    <ProductCard
                      id={product.id}
                      image={product.image}
                      image2={product.image2}
                      name={product.name}
                      price={product.price}
                      imageContainerClassName="bg-[#F5F5F5] aspect-[3/4]"
                    />
                  </div>
                ))}
              </div>

              {/* Load more trigger / spinner */}
              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex justify-center items-center py-12"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
                      <span className="text-[10px] tracking-[0.1em] text-zinc-400 uppercase">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] tracking-[0.1em] text-zinc-300 uppercase">
                      Scroll for more
                    </span>
                  )}
                </div>
              )}

              {/* Showing count */}
              {!hasMore && filteredProducts.length > 0 && (
                <div className="text-center pt-8 pb-4">
                  <span className="text-[10px] tracking-[0.1em] text-zinc-400 uppercase">
                    Showing all {filteredProducts.length} products
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
