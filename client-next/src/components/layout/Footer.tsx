import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import logoBlack from '@/assets/LOGO_black.png';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="hidden md:block bg-white text-black pt-16 pb-12 px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-24">
        {/* About Us */}
        <div className="flex flex-col space-y-6">
          <div className="border-b border-black pb-1 self-start min-w-[100px]">
            <h4 className="text-[12px] md:text-[13px] tracking-[0.1em] font-bold uppercase">ABOUT US</h4>
          </div>
          <div className="flex flex-col space-y-5">
            <Link href="/" className="w-24 block">
              <Image src={logoBlack} alt="INTU00" className="w-full h-auto object-contain" />
            </Link>
            
            {/* Vietnamese Ministry of Industry and Trade Badge */}
            <a href="http://online.gov.vn/Home/WebDetails/112662" target="_blank" rel="noopener noreferrer" className="w-32 block">
              <img 
                src="https://dangkywebvoibocongthuong.com/wp-content/uploads/2021/11/logo-da-thong-bao-bo-cong-thuong.png" 
                alt="Registered with Vietnam Ministry of Industry and Trade" 
                className="w-full h-auto"
                loading="lazy"
              />
            </a>

            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Questions */}
        <div className="flex flex-col space-y-6">
          <div className="border-b border-black pb-1 self-start min-w-[150px]">
            <h4 className="text-[12px] md:text-[13px] tracking-[0.1em] font-bold uppercase">LEGAL & QUESTIONS</h4>
          </div>
          <ul className="space-y-3 text-[11px] md:text-[12px] tracking-[0.1em] uppercase font-normal">
            <li>
              <a href="#" className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <span className="text-black/60">-</span> SEARCH
              </a>
            </li>
            <li>
              <Link href="/about" className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <span className="text-black/60">-</span> ABOUT US
              </Link>
            </li>
            <li>
              <a href="#" className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <span className="text-black/60">-</span> RETURN POLICY
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <span className="text-black/60">-</span> PRIVACY POLICY
              </a>
            </li>
            <li>
              <a href="#" className="hover:opacity-60 transition-opacity flex items-center gap-2">
                <span className="text-black/60">-</span> TERMS OF SERVICE
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col space-y-6">
          <div className="border-b border-black pb-1 self-start min-w-[120px]">
            <h4 className="text-[12px] md:text-[13px] tracking-[0.1em] font-bold uppercase">CONTACT US</h4>
          </div>
          <div className="space-y-3 text-[11px] md:text-[12px] tracking-[0.1em] uppercase font-normal">
            <p className="flex items-center gap-2">
              <span className="text-black/60">-</span> PHONE: 093120222
            </p>
            <p className="flex items-center gap-2">
              <span className="text-black/60">-</span> MAIL: intuoo@gmail.com
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-6 border-t border-black/10">
        <p className="text-center text-[12px] md:text-[13px] tracking-[0.1em] text-black font-normal">
          © 2025 INTU00. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
