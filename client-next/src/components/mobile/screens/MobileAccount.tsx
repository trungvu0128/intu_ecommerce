'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, ChevronRight, Mail, Phone, Calendar, Shield, Apple } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/lib/api';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function MobileAccount() {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', fullName: '', password: '', confirmPassword: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) { setError('Please fill all fields'); return; }
    try {
      setIsSubmitting(true); setError('');
      const res = await AuthService.login(loginForm);
      setUser({ id: res.userEmail, email: res.userEmail, fullName: res.fullName, roles: res.roles }, res.accessToken || res.token);
      setShowLogin(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally { setIsSubmitting(false); }
  };

  const handleRegister = async () => {
    if (!registerForm.email || !registerForm.fullName || !registerForm.password) { setError('Please fill all fields'); return; }
    if (registerForm.password !== registerForm.confirmPassword) { setError('Passwords do not match'); return; }
    try {
      setIsSubmitting(true); setError('');
      const res = await AuthService.register(registerForm);
      setUser({ id: res.userEmail, email: res.userEmail, fullName: res.fullName, roles: res.roles }, res.accessToken || res.token);
      setShowLogin(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally { setIsSubmitting(false); }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsSocialLoading(true);
      await signInWithPopup(auth, googleProvider);
      // Backend sync is handled by Providers.tsx automatically
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Có lỗi xảy ra khi đăng nhập bằng Google');
      console.error(err);
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!mounted) return <MobileLayout><div /></MobileLayout>;

  // Not logged in
  if (!user) {
    return (
      <MobileLayout>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <User size={36} strokeWidth={1} color="#999" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px' }}>Welcome to INTU∞</h2>
          <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px' }}>Sign in to track orders & manage your account</p>

          {error && (
            <div style={{ padding: 12, background: '#fee2e2', borderRadius: 8, color: '#991b1b', fontSize: 14, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Social Login Buttons */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSocialLoading || isSubmitting}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '12px 0', borderRadius: 8, border: '1px solid #e5e5e5', background: '#f5f5f5',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 10, color: '#111',
              opacity: (isSocialLoading || isSubmitting) ? 0.5 : 1,
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
            disabled={isSocialLoading || isSubmitting}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '12px 0', borderRadius: 8, border: 'none', background: '#1a1a1a', color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 20,
              opacity: (isSocialLoading || isSubmitting) ? 0.5 : 1,
            }}
          >
            <Apple size={18} fill="white" />
            Tiếp tục với Apple
          </button>

          {/* Divider */}
          <div style={{ position: 'relative', padding: '8px 0', marginBottom: 16 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', borderTop: '1px solid #e5e5e5' }} />
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <span style={{ background: 'white', padding: '0 12px', fontSize: 12, color: '#999' }}>Hoặc</span>
            </div>
          </div>

          {!isRegister ? (
            <>
              <input className="mobile-input" placeholder="Email" type="email" value={loginForm.email}
                onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                style={{ marginBottom: 10 }} />
              <input className="mobile-input" placeholder="Password" type="password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                style={{ marginBottom: 16 }} />
              <button className="mobile-btn mobile-btn--primary" onClick={handleLogin} disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
              <p style={{ fontSize: 14, color: '#666', marginTop: 16 }}>
                Don't have an account?{' '}
                <button onClick={() => { setIsRegister(true); setError(''); }} style={{ background: 'none', border: 'none', color: '#111', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <input className="mobile-input" placeholder="Full Name" value={registerForm.fullName}
                onChange={e => setRegisterForm(p => ({ ...p, fullName: e.target.value }))}
                style={{ marginBottom: 10 }} />
              <input className="mobile-input" placeholder="Email" type="email" value={registerForm.email}
                onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                style={{ marginBottom: 10 }} />
              <input className="mobile-input" placeholder="Password" type="password" value={registerForm.password}
                onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                style={{ marginBottom: 10 }} />
              <input className="mobile-input" placeholder="Confirm Password" type="password" value={registerForm.confirmPassword}
                onChange={e => setRegisterForm(p => ({ ...p, confirmPassword: e.target.value }))}
                style={{ marginBottom: 16 }} />
              <button className="mobile-btn mobile-btn--primary" onClick={handleRegister} disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
              <p style={{ fontSize: 14, color: '#666', marginTop: 16 }}>
                Already have an account?{' '}
                <button onClick={() => { setIsRegister(false); setError(''); }} style={{ background: 'none', border: 'none', color: '#111', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                  Sign In
                </button>
              </p>
            </>
          )}
        </div>
      </MobileLayout>
    );
  }

  // Logged in
  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/orders' },
    { icon: MapPin, label: 'Saved Addresses', href: '/addresses' },
  ];

  return (
    <MobileLayout>
      {/* Profile Header */}
      <div style={{ padding: '24px 16px', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px',
          background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={32} strokeWidth={1} color="#999" />
          )}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{user.fullName || user.email}</h2>
        <p style={{ fontSize: 13, color: '#999', margin: '4px 0 0' }}>{user.email}</p>
      </div>

      <hr className="mobile-divider" />

      {/* Profile Info */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#999', margin: '0 0 12px' }}>
          Profile Info
        </h3>
        {[
          { icon: Mail, label: 'Email', value: user.email },
          { icon: Phone, label: 'Phone', value: user.phoneNumber || 'Not set' },
          { icon: Calendar, label: 'Date of Birth', value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : 'Not set' },
          { icon: Shield, label: 'Gender', value: user.gender || 'Not set' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <item.icon size={18} color="#999" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#999' }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <hr className="mobile-divider" />

      {/* Menu */}
      <div style={{ padding: '8px 0' }}>
        {menuItems.map(item => (
          <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', textDecoration: 'none', color: 'inherit' }}>
            <item.icon size={20} strokeWidth={1.5} />
            <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{item.label}</span>
            <ChevronRight size={18} color="#ccc" />
          </Link>
        ))}
      </div>

      <hr className="mobile-divider" />

      {/* Logout */}
      <div style={{ padding: '8px 16px 32px' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '14px 0',
            border: 'none', background: 'none', color: '#ef4444',
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <LogOut size={20} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </MobileLayout>
  );
}
