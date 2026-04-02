'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductService } from '@/lib/api';
import { getMainThumbnailUrl } from '@/lib/image-utils';
import type { Product } from '@/types';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchPopoverProps {
  onClose: () => void;
}

const SearchPopover = ({ onClose }: SearchPopoverProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Debounce search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await ProductService.getAll({ search: searchTerm.trim(), pageSize: 4 });
        setResults(data.slice(0, 4)); // Ensure only top 4 results
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  return (
    <div className="absolute top-full right-0 mt-4 w-[320px] md:w-[380px] bg-white text-black shadow-xl border border-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Triangle pointer */}
      <div className="absolute -top-2 right-1 w-4 h-4 bg-white rotate-45 border-l border-t border-zinc-100 transform" />
      
      <div className="relative z-10 p-5">
        <form onSubmit={handleSubmit} className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-b border-zinc-200 pb-2 pl-8 pr-8 text-xs focus:outline-none focus:border-black transition-colors"
            autoFocus
          />
          <Search size={14} className="absolute left-0 top-1 text-zinc-400" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-0 top-1 text-zinc-400 hover:text-black transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </form>

        <div className="min-h-[100px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Loader2 size={16} className="animate-spin text-zinc-400" />
            </div>
          ) : searchTerm && results.length === 0 ? (
            <div className="text-center py-6 text-[10px] text-zinc-500 uppercase tracking-widest">
              Không tìm thấy sản phẩm
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Kết quả tìm kiếm
              </h3>
              <div className="space-y-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex gap-4 group items-center"
                  >
                    <div className="w-12 h-16 relative bg-[#f5f5f5] flex-shrink-0">
                      <Image
                        src={getMainThumbnailUrl(product.images)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-medium group-hover:underline line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1">
                        {new Intl.NumberFormat('vi-VN').format(product.basePrice)} VND
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="w-full block text-center text-[10px] font-bold uppercase tracking-widest py-3 mt-4 border border-black hover:bg-black hover:text-white transition-colors"
              >
                XEM TẤT CẢ KẾT QUẢ
              </button>
            </div>
          ) : (
            <div className="text-center py-6 text-[10px] text-zinc-400 uppercase tracking-widest">
              Nhập từ khóa để tìm kiếm
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopover;
