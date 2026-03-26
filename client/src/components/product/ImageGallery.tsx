import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full bg-zinc-100 flex items-center justify-center p-8 md:p-20">
      {/* Main Image */}
      <div className="relative w-full max-w-2xl aspect-[3/4] overflow-hidden">
        <img
          src={images[selectedImageIndex]}
          alt="Product detail"
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Thumbnails and Navigation - Positioned at bottom right of the container */}
      <div className="absolute bottom-4 right-4 md:bottom-12 md:right-12 flex items-center gap-4">
        <div className="flex gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "w-12 h-12 md:w-16 md:h-16 border bg-white overflow-hidden transition-all duration-300",
                selectedImageIndex === index ? "border-black scale-105" : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
            </button>
          ))}
        </div>

        {/* Prev/Next Buttons */}
        <div className="flex gap-1 ml-2">
          <button 
            onClick={prevImage}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={nextImage}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
