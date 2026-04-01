'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Apple, ArrowLeft } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthService } from '@/lib/api';

export default function MobileRegister() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Có lỗi xảy ra khi đăng nhập bằng Google');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ họ tên và mật khẩu');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      await AuthService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
      });

      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Lỗi kết nối máy chủ');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout showFooter={false}>
      <div style={{ padding: '16px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#000', textDecoration: 'none' }}>
          <ArrowLeft size={20} strokeWidth={1.5} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>Quay lại</span>
        </Link>

        <div style={{ marginTop: 24 }}>
          {error && (
            <div style={{ padding: 12, background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: 14, marginBottom: 16 }}>
              {error}
            </div>
          )}
          
          
          {success && (
            <div style={{ padding: 12, background: '#d1fae5', borderRadius: 8, color: '#065f46', fontSize: 14, marginBottom: 16 }}>
              {success}
            </div>
          )}

          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '12px 0', borderRadius: 8, border: '1px solid #e5e5e5', background: '#f5f5f5',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#111',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Tiếp tục với Google
              </button>

              <button 
                disabled={isLoading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '12px 0', borderRadius: 8, border: 'none', background: '#1a1a1a', color: '#fff',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <svg width="18" height="22" viewBox="0 0 814 1000" fill="white">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                </svg>
                Tiếp tục với Apple
              </button>

              <div style={{ position: 'relative', padding: '8px 0' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '100%', borderTop: '1px solid #e5e5e5' }} />
                </div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <span style={{ background: 'white', padding: '0 12px', fontSize: 12, color: '#999' }}>Hoặc</span>
                </div>
              </div>

              <form onSubmit={proceedToStep2} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px',
                    fontSize: 15, outline: 'none', background: '#fff', opacity: isLoading ? 0.5 : 1,
                  }}
                />
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{
                    width: '100%', background: '#808080', color: '#fff', fontWeight: 600,
                    padding: '12px 0', borderRadius: 8, cursor: 'pointer', fontSize: 14,
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  Tiếp tục
                </button>
              </form>

              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <Link href="/" style={{ fontSize: 11, color: '#999', textDecoration: 'none' }}>
                  Quay lại và tiếp tục mua hàng
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>Hoàn tất đăng ký</h2>
                <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Đang đăng ký cho: {formData.email}</p>
              </div>

              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Họ và tên"
                autoComplete="name"
                required
                disabled={isLoading}
                style={{
                  width: '100%', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px',
                  fontSize: 15, outline: 'none', background: '#fff', opacity: isLoading ? 0.5 : 1,
                }}
              />
              
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Số điện thoại (Tuỳ chọn)"
                autoComplete="tel"
                disabled={isLoading}
                style={{
                  width: '100%', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px',
                  fontSize: 15, outline: 'none', background: '#fff', opacity: isLoading ? 0.5 : 1,
                }}
              />

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mật khẩu (ít nhất 8 ký tự)"
                autoComplete="new-password"
                required
                disabled={isLoading}
                style={{
                  width: '100%', border: '1px solid #e5e5e5', borderRadius: 8, padding: '12px 16px',
                  fontSize: 15, outline: 'none', background: '#fff', opacity: isLoading ? 0.5 : 1,
                }}
              />
              
              <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  style={{
                    flex: 1, background: '#f5f5f5', color: '#000', fontWeight: 600,
                    padding: '12px 0', borderRadius: 8, cursor: 'pointer', fontSize: 14,
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  Quay lại
                </button>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{
                    flex: 2, background: '#000', color: '#fff', fontWeight: 600,
                    padding: '12px 0', borderRadius: 8, cursor: 'pointer', fontSize: 14,
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  {isLoading ? '...' : 'Hoàn tất Đăng ký'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
