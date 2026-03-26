'use client';

import Link from 'next/link';
import { useState } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/lib/api';
import Image from 'next/image';

// Add onClose prop to allow closing the popover from within
interface LoginPopoverProps {
  onClose?: () => void;
}

const LoginPopover = ({ onClose }: LoginPopoverProps) => {
  const { user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      
      const response = await AuthService.login({ email, password });
      
      useAuthStore.getState().setUser({
        id: '',                            // not returned by login — fetched lazily via /api/users/me
        email: response.userEmail,
        fullName: response.fullName,
        roles: response.roles ?? [],
      }, response.accessToken);

      if (onClose) onClose();
    } catch (err: unknown) {
      let errorMsg = 'Có lỗi xảy ra';
      const error = err as Error;
      if (error.message.includes('401') || error.message.includes('Invalid')) {
        errorMsg = 'Email hoặc mật khẩu không chính xác';
      } else {
        errorMsg = error.message || 'Lỗi kết nối máy chủ';
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    useAuthStore.getState().logout();
    if (onClose) onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      // Backend sync is handled by Providers.tsx automatically
      if (onClose) onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Có lỗi xảy ra khi đăng nhập bằng Google');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-4 w-[320px] bg-white text-black p-6 shadow-xl border border-zinc-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Triangle pointer */}
      <div className="absolute -top-2 right-1 w-4 h-4 bg-white rotate-45 border-l border-t border-zinc-100 transform" />
      
      <div className="relative z-10">
        {user ? (
          <div className="flex flex-col items-center">
            <h2 className="text-center text-sm font-bold tracking-widest uppercase mb-4">
              TÀI KHOẢN CỦA BẠN
            </h2>
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-2xl font-bold uppercase overflow-hidden relative">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.email || 'User'} fill className="object-cover" />
              ) : (
                user.email?.charAt(0) || 'U'
              )}
            </div>
            <p className="text-sm text-zinc-800 mb-6 truncate w-full text-center">
              {user.email}
            </p>
            <Link 
              href="/account" 
              onClick={onClose}
              className="w-full text-center text-[10px] font-bold uppercase tracking-widest py-3 mb-2 border border-black hover:bg-zinc-50 transition-colors"
            >
              QUẢN LÝ TÀI KHOẢN
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-zinc-800 transition-colors"
            >
              ĐĂNG XUẤT
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-center text-sm font-bold tracking-widest uppercase mb-1">
              ĐĂNG NHẬP TÀI KHOẢN
            </h2>
            <p className="text-center text-[10px] text-zinc-500 mb-6">
              Nhập email và mật khẩu của bạn:
            </p>

            {error && (
              <div className="mb-4 bg-red-50 text-red-500 p-2 rounded text-[10px] border border-red-100 text-center">
                {error}
              </div>
            )}

            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#f2f2f2] hover:bg-[#e5e5e5] transition-colors py-2.5 rounded-md text-[10px] font-semibold mb-4 disabled:opacity-50 text-black uppercase tracking-wide"
            >
              <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <div className="relative py-2 mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                <span className="bg-white px-2">Hoặc</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" htmlFor="email">
                  Email
                </label>
                <input 
                  id="email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider" htmlFor="password">
                  Mật khẩu
                </label>
                <input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full border border-zinc-300 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <p className="text-[9px] text-zinc-400 leading-tight">
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> apply.
              </p>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'ĐĂNG NHẬP'
                )}
              </button>
            </form>

            <div className="mt-4 text-center space-y-2">
              <div className="text-[10px]">
                <span className="text-zinc-500">Khách hàng mới? </span>
                <Link href="/register" onClick={onClose} className="text-blue-600 hover:underline">
                  Tạo tài khoản / Google
                </Link>
              </div>
              <div className="text-[10px]">
                <span className="text-zinc-500">Quên mật khẩu? </span>
                <Link href="/recover" onClick={onClose} className="text-blue-600 hover:underline">
                  Khôi phục mật khẩu
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopover;
