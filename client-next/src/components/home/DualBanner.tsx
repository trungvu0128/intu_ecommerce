import Banner from "./Banner";

interface DualBannerProps {
  leftImage: string;
  leftTitle: string;
  leftLink?: string;
  rightImage: string;
  rightTitle: string;
  rightLink?: string;
}

const DualBanner = ({ leftImage, leftTitle, leftLink, rightImage, rightTitle, rightLink }: DualBannerProps) => {
  return (
    <div className="grid grid-cols-2">
      <Banner 
        image={leftImage} 
        title={leftTitle} 
        link={leftLink}
        aspectRatio="aspect-[3/4]" 
      />
      <Banner 
        image={rightImage} 
        title={rightTitle} 
        link={rightLink}
        aspectRatio="aspect-[3/4]" 
      />
    </div>
  );
};

export default DualBanner;
