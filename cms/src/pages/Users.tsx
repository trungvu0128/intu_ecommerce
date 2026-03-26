import { useEffect, useState } from 'react';
import { Users, Search, Shield, ShieldOff, UserPlus, X, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';
import type { AdminUser, CreateUserRequest } from '@/types/admin';

const ROLES = ['Admin', 'Customer'];

const emptyForm: CreateUserRequest = {
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
  role: 'Admin',
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Create modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateUserRequest>({ ...emptyForm });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const load = () => {
    setLoading(true);
    AdminService.getUsers({ search: search || undefined, role: 'Admin', page, pageSize })
      .then(res => {
        setUsers(res?.data ?? []);
        setTotal(res?.total ?? 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [page, search]);

  const handleRoleChange = async (id: string, role: string) => {
    await AdminService.updateUserRole(id, role);
    load();
  };

  const handleToggleActive = async (id: string) => {
    await AdminService.toggleUserActive(id);
    load();
  };

  const openModal = () => {
    setForm({ ...emptyForm });
    setFormError('');
    setFormSuccess('');
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError('');
    setFormSuccess('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Client-side validation
    if (!form.email.trim()) return setFormError('Email is required.');
    if (!form.fullName.trim()) return setFormError('Full name is required.');
    if (!form.password || form.password.length < 8) return setFormError('Password must be at least 8 characters.');

    setCreating(true);
    try {
      await AdminService.createUser({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber?.trim() || undefined,
        role: form.role,
      });
      setFormSuccess('Account created successfully!');
      setForm({ ...emptyForm });
      load();
      // Auto-close after 1.5s
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.join('; ') || 'Failed to create account.';
      setFormError(msg);
    } finally {
      setCreating(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Accounts</h1>
          <p className="admin-page-sub">{total} registered admins / staff</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="admin-search">
            <Search size={16} className="admin-search__icon" />
            <input
              className="form-control admin-search input"
              style={{ paddingLeft: 36 }}
              placeholder="Search by name or email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className="btn btn--primary" onClick={openModal} style={{ whiteSpace: 'nowrap' }}>
            <UserPlus size={16} />
            Create Account
          </button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-center"><div className="admin-spinner" /></div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr><td colSpan={7}>
                      <div className="admin-empty">
                        <Users size={40} />
                        <p className="admin-empty__title">No users found</p>
                      </div>
                    </td></tr>
                  )}
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0,
                          }}>
                            {(u.fullName ?? u.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.fullName ?? '—'}</div>
                            <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>{u.phoneNumber ?? '—'}</td>
                      <td>
                        <select
                          className="form-control"
                          style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                          value={u.roles[0] ?? 'Customer'}
                          onChange={e => handleRoleChange(u.id, e.target.value)}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td>
                        <span className={`badge badge--${u.emailConfirmed ? 'green' : 'yellow'}`}>
                          {u.emailConfirmed ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge--${u.isActive ? 'green' : 'red'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <button
                          className={`btn ${u.isActive ? 'btn--danger' : 'btn--success'} btn--sm`}
                          onClick={() => handleToggleActive(u.id)}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {u.isActive ? <ShieldOff size={14} /> : <Shield size={14} />}
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="admin-pagination">
                <span>Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}</span>
                <div className="admin-pagination__controls">
                  <button className="admin-pagination__btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                  <button className="admin-pagination__btn" style={{ minWidth: 80, fontSize: 12 }} disabled>&nbsp;{page} / {totalPages}&nbsp;</button>
                  <button className="admin-pagination__btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Create Account Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h2 className="modal-title">
                <UserPlus size={20} />
                Create New Account
              </h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', margin: '0 0 16px 0',
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 8, color: '#ef4444', fontSize: 13,
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', margin: '0 0 16px 0',
                background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 8, color: '#22c55e', fontSize: 13,
              }}>
                <CheckCircle size={16} style={{ flexShrink: 0 }} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="admin-form">
              <div className="form-group">
                <label>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  className="form-control"
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="John Doe"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  className="form-control"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password <span style={{ color: '#ef4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-control"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 chars, uppercase, digit, special"
                    required
                    minLength={8}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--admin-text-muted)', padding: 4,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small style={{ color: 'var(--admin-text-muted)', fontSize: 11, marginTop: 4, display: 'block' }}>
                  Requires: 8+ chars, uppercase, lowercase, digit, special character
                </small>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className="form-control"
                  type="tel"
                  value={form.phoneNumber || ''}
                  onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                  placeholder="+84 123 456 789"
                />
              </div>

              <div className="form-group">
                <label>Role <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  className="form-control"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn--outline" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={creating}
                  style={{ minWidth: 140 }}
                >
                  <UserPlus size={16} />
                  {creating ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
