'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import logoBlack from '@/assets/LOGO_black.png';

const LINKS = [
  { label: 'SHOP', href: '/shop' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
  { label: 'RETURN POLICY', href: '#' },
  { label: 'PRIVACY POLICY', href: '#' },
  { label: 'TERMS OF SERVICE', href: '#' },
];

export default function MobileFooter() {
  return (
    <footer style={{
      backgroundColor: '#fff',
      borderTop: '1px solid #eaeaea',
      padding: '48px 24px 40px',
      color: '#000',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'flex-start' }}>
        <Link href="/">
          <Image src={logoBlack} alt="INTU∞" style={{ height: 18, width: 'auto' }} />
        </Link>
      </div>

      {/* Nav Links — left-aligned, spaced */}
      <nav style={{ marginBottom: 36 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          {LINKS.map(link => (
            <li key={link.label}>
              <Link
                href={link.href}
                style={{
                  fontSize: 10,
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#000',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#eaeaea', margin: '0 0 28px' }} />

      {/* Contact + Social */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <a href="tel:093120222"
            style={{ fontSize: 10, letterSpacing: '0.15em', color: '#555', textDecoration: 'none', textTransform: 'uppercase' }}>
            093 120 222
          </a>
          <a href="mailto:intuoo@gmail.com"
            style={{ fontSize: 10, letterSpacing: '0.1em', color: '#555', textDecoration: 'none', textTransform: 'uppercase' }}>
            intuoo@gmail.com
          </a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="#" aria-label="Instagram"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000', textDecoration: 'none',
            }}>
            <Instagram size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Ministry badge */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 28 }}>
        <a href="http://online.gov.vn/Home/WebDetails/112662" target="_blank" rel="noopener noreferrer">
          <img
            src="https://dangkywebvoibocongthuong.com/wp-content/uploads/2021/11/logo-da-thong-bao-bo-cong-thuong.png"
            alt="Đã thông báo Bộ Công Thương"
            style={{ height: 40, width: 'auto', objectFit: 'contain' }}
          />
        </a>
      </div>

      {/* Copyright */}
      <p style={{ textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', color: '#999', margin: 0, textTransform: 'uppercase' }}>
        © 2025 INTU∞. All rights reserved.
      </p>
    </footer>
  );
}
