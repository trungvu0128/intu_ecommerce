'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, ChevronRight, Mail, Phone, Calendar, Shield } from 'lucide-react';
import MobileLayout from '@/components/mobile/MobileLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService } from '@/lib/api';

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
