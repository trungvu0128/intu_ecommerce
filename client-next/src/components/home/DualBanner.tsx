import Banner from "./Banner";

interface DualBannerProps {
  leftImage: string;
  leftTitle: string;
  leftLink?: string;
  rightImage: string;
  rightTitle: string;
  rightLink?: string;
  priority?: boolean;
}

const DualBanner = ({ leftImage, leftTitle, leftLink, rightImage, rightTitle, rightLink, priority = false }: DualBannerProps) => {
  return (
    <div className="grid grid-cols-2">
      <Banner 
        image={leftImage} 
        title={leftTitle} 
        link={leftLink}
        aspectRatio="aspect-[3/4]" 
        priority={priority}
      />
      <Banner 
        image={rightImage} 
        title={rightTitle} 
        link={rightLink}
        aspectRatio="aspect-[3/4]" 
        priority={priority}
      />
    </div>
  );
};

export default DualBanner;
