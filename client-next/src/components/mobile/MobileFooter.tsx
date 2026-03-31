'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import logoBlack from '@/assets/LOGO_black.png';

const LINKS = [
  { label: 'Shop Shop', href: '/shop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Return Policy', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export default function MobileFooter() {
  return (
    <footer style={{
      backgroundColor: '#fafafa',
      borderTop: '1px solid #f0f0f0',
      padding: '40px 20px 32px',
      color: '#000',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
          <Link href="/">
            <Image src={logoBlack} alt="INTU∞" style={{ height: 24, width: 'auto' }} />
          </Link>
        </div>

        <nav style={{ marginBottom: 32 }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '16px 24px',
            maxWidth: 320,
            margin: '0 auto'
          }}>
            {LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: '#333',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div style={{ 
          height: 1, 
          backgroundColor: '#e5e5e5', 
          margin: '0 0 28px' 
        }} />

        <div style={{ marginBottom: 28 }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 12,
            alignItems: 'center'
          }}>
            <a href="tel:093120222"
              style={{ 
                fontSize: 14, 
                fontWeight: 500,
                letterSpacing: '0.02em', 
                color: '#333', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
              <Phone size={16} strokeWidth={1.5} />
              093 120 222
            </a>
            <a href="mailto:intuoo@gmail.com"
              style={{ 
                fontSize: 14, 
                fontWeight: 500,
                letterSpacing: '0.02em', 
                color: '#333', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
              <Mail size={16} strokeWidth={1.5} />
              intuoo@gmail.com
            </a>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 12,
          marginBottom: 28
        }}>
          <a href="#" 
            aria-label="Instagram"
            style={{
              width: 44, 
              height: 44, 
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#333', 
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
            <Instagram size={20} strokeWidth={1.5} />
          </a>
          <a href="#" 
            aria-label="Facebook"
            style={{
              width: 44, 
              height: 44, 
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#333', 
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
            <Facebook size={20} strokeWidth={1.5} />
          </a>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 24 
        }}>
          <a 
            href="http://online.gov.vn/Home/WebDetails/112662" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ display: 'block' }}
          >
            <img
              src="https://dangkywebvoibocongthuong.com/wp-content/uploads/2021/11/logo-da-thong-bao-bo-cong-thuong.png"
              alt="Đã thông báo Bộ Công Thương"
              style={{ 
                height: 36, 
                width: 'auto', 
                objectFit: 'contain',
                opacity: 0.8
              }}
            />
          </a>
        </div>

        <p style={{ 
          textAlign: 'center', 
          fontSize: 11, 
          fontWeight: 400,
          letterSpacing: '0.05em', 
          color: '#999', 
          margin: 0,
          lineHeight: 1.6
        }}>
          © 2025 INTU∞. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
