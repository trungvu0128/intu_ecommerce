import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { AuthService } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await AuthService.login({ email, password });
      
      // Check if user has Admin role
      if (!res.roles?.includes('Admin')) {
        setError('Access denied. Admin role required.');
        setLoading(false);
        return;
      }

      setUser(
        {
          id: '', // will be populated later
          email: res.userEmail,
          fullName: res.fullName,
          roles: res.roles,
        },
        res.accessToken
      );
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo__icon">L</div>
            <div>
              <div className="login-logo__text">Lotus CMS</div>
              <div className="login-logo__sub">Admin Panel</div>
            </div>
          </div>
          <h1 className="login-title">Sign in to your account</h1>
          <p className="login-subtitle">Enter your admin credentials to continue</p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn btn--primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: 15 }}>
            <LogIn size={18} />
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
