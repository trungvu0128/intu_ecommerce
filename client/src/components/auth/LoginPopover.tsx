import { Link } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthStore } from '@/store/useAuthStore';

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
      await signInWithEmailAndPassword(auth, email, password);
      if (onClose) onClose();
    } catch (err: unknown) {
      let errorMsg = 'Có lỗi xảy ra';
      const error = err as { code?: string; message: string };
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMsg = 'Email hoặc mật khẩu không chính xác';
      } else {
        errorMsg = error.message || 'Lỗi không xác định';
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
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
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-2xl font-bold uppercase overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.email || 'User'} className="w-full h-full object-cover" />
              ) : (
                user.email?.charAt(0) || 'U'
              )}
            </div>
            <p className="text-sm text-zinc-800 mb-6 truncate w-full text-center">
              {user.email}
            </p>
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
                <Link to="/register" onClick={onClose} className="text-blue-600 hover:underline">
                  Tạo tài khoản / Google
                </Link>
              </div>
              <div className="text-[10px]">
                <span className="text-zinc-500">Quên mật khẩu? </span>
                <Link to="/recover" onClick={onClose} className="text-blue-600 hover:underline">
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
