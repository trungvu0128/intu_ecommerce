import { cn } from "@/lib/utils";
import Link from "next/link";

interface BannerProps {
  image: string;
  title: string;
  className?: string;
  aspectRatio?: string;
  link?: string;
}

const Banner = ({ image, title, className, aspectRatio = "aspect-[16/9]", link }: BannerProps) => {
  const content = (
    <>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      <div className="absolute bottom-12 left-0 w-full text-center text-white flex flex-col items-center">
        <span className="text-[8px] md:text-[10px] tracking-[0.2em] font-light uppercase opacity-90 mb-1">
          Shop now
        </span>
        <h2 className="text-[10px] md:text-[12px] tracking-[0.3em] font-medium uppercase">
          {title}
        </h2>
      </div>
    </>
  );

  const containerClasses = cn("relative w-full overflow-hidden group cursor-pointer block", aspectRatio, className);

  if (link) {
    return (
      <Link href={link} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div className={containerClasses}>
      {content}
    </div>
  );
};

export default Banner;
