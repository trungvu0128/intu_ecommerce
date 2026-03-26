'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Apple } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

import { AuthService } from '@/lib/api';

const Register = () => {
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
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20 px-4 mt-20">
        <div className="w-full max-w-sm space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-100 text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm border border-green-100 text-center animate-in fade-in zoom-in-95">
              {success}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#f2f2f2] hover:bg-[#e5e5e5] transition-colors py-2.5 rounded-md text-sm font-semibold disabled:opacity-50 text-black"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Tiếp tục với Google
              </button>

              <button disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white hover:bg-black transition-colors py-2.5 rounded-md text-sm font-semibold disabled:opacity-50">
                <Apple size={18} fill="white" />
                Tiếp tục với Apple
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[11px] font-medium text-gray-500">
                  <span className="bg-white px-4">Hoặc</span>
                </div>
              </div>

              <form onSubmit={proceedToStep2} className="space-y-4">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50 placeholder:text-gray-400"
                />
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#808080] text-white font-semibold py-2.5 rounded-md hover:bg-[#666666] transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  Tiếp tục
                </button>
              </form>

              <div className="text-center pt-2">
                <Link href="/" className="text-[11px] text-[#999999] hover:text-black hover:underline underline-offset-4 transition-all inline-block border-b border-[#999999] hover:border-black pb-[1px] leading-none">
                  Quay lại và tiếp tục mua hàng
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Hoàn tất đăng ký</h2>
                <p className="text-sm text-gray-500 mt-1">Đang đăng ký cho: {formData.email}</p>
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
                className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
              />
              
              <input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Số điện thoại (Tuỳ chọn)"
                autoComplete="tel"
                disabled={isLoading}
                className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
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
                className="w-full border border-gray-400 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-50"
              />
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="w-1/3 bg-gray-100 text-black font-semibold py-2.5 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                >
                  Quay lại
                </button>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-2/3 bg-black text-white font-semibold py-2.5 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Hoàn tất Đăng ký'
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
