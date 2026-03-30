'use client';

import MobileLayout from '@/components/mobile/MobileLayout';
import MobileFooter from '@/components/mobile/MobileFooter';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';

export default function MobileContact() {
  return (
    <MobileLayout>
      <div style={{
        padding: '60px 24px 80px',
        backgroundColor: '#fff',
        color: '#000'
      }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: 16
        }}>
          CONTACT US
        </h1>
        
        <p style={{
          fontSize: 12,
          color: '#666',
          letterSpacing: '0.05em',
          lineHeight: 1.6,
          marginBottom: 48,
          fontWeight: 300
        }}>
          WE&apos;RE ALWAYS LOOKING FORWARD <br />
          TO RECEIVING YOUR FEEDBACK.
        </p>

        <div style={{ display: 'grid', gap: 40 }}>
          {/* Email section */}
          <div>
            <h3 style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
              EMAIL ENQUIRIES
            </h3>
            <a href="mailto:intuoo@gmail.com" style={{ fontSize: 14, color: '#000', textDecoration: 'none', letterSpacing: '0.02em', borderBottom: '1px solid #000', paddingBottom: 2 }}>
              intuoo@gmail.com
            </a>
          </div>

          {/* Social section */}
          <div>
            <h3 style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
              INSTAGRAM
            </h3>
            <a href="#" style={{ fontSize: 14, color: '#000', textDecoration: 'none', letterSpacing: '0.02em', borderBottom: '1px solid #000', paddingBottom: 2 }}>
              @INTU.OFFICIAL
            </a>
          </div>

          {/* Phone section */}
          <div>
            <h3 style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
              PHONE
            </h3>
            <a href="tel:093120222" style={{ fontSize: 14, color: '#000', textDecoration: 'none', letterSpacing: '0.02em' }}>
              093 120 222
            </a>
          </div>

          {/* Working hours */}
          <div>
            <h3 style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
              CUSTOMER CARE
            </h3>
            <p style={{ fontSize: 13, color: '#000', margin: 0, fontWeight: 300, letterSpacing: '0.02em' }}>
              MONDAY — FRIDAY <br />
              09:00 — 18:00 (GMT+7)
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
