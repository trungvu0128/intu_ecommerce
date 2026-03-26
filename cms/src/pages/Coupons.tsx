import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';
import Modal from '@/components/Modal';
import { AdminService } from '@/lib/adminApi';
import type { AdminCoupon, CreateCouponRequest } from '@/types/admin';

const defaultForm: CreateCouponRequest = {
  code: '',
  discountType: 'Percentage',
  discountValue: 10,
  minOrderAmount: undefined,
  maxDiscountAmount: undefined,
  startDate: undefined,
  endDate: undefined,
  usageLimit: undefined,
  isActive: true,
};

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState<CreateCouponRequest>(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    AdminService.getCoupons()
      .then(setCoupons)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModal(true);
  };

  const openEdit = (c: AdminCoupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount,
      maxDiscountAmount: c.maxDiscountAmount,
      startDate: c.startDate ? c.startDate.split('T')[0] : undefined,
      endDate: c.endDate ? c.endDate.split('T')[0] : undefined,
      usageLimit: c.usageLimit,
      isActive: c.isActive,
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await AdminService.updateCoupon(editing.id, form);
      } else {
        await AdminService.createCoupon(form);
      }
      setModal(false);
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await AdminService.deleteCoupon(id);
    load();
  };

  const handleToggle = async (id: string) => {
    await AdminService.toggleCoupon(id);
    load();
  };

  const num = (v: string) => v === '' ? undefined : Number(v);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Coupons</h1>
          <p className="admin-page-sub">Create and manage discount codes</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-center"><div className="admin-spinner" /></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Discount</th>
                  <th>Validity</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="admin-empty">
                      <Ticket size={40} />
                      <p className="admin-empty__title">No coupons yet</p>
                    </div>
                  </td></tr>
                )}
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: '#818cf8' }}>
                      {c.code}
                    </td>
                    <td>
                      <span className={`badge badge--${c.discountType === 'Percentage' ? 'purple' : 'blue'}`}>
                        {c.discountType === 'Percentage' ? '%' : 'Fixed'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {c.discountType === 'Percentage' ? `${c.discountValue}%` : `${c.discountValue.toLocaleString()}₫`}
                      {c.maxDiscountAmount && <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>max {c.maxDiscountAmount.toLocaleString()}₫</div>}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <div>{formatDate(c.startDate)} → {formatDate(c.endDate)}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {c.usedCount} / {c.usageLimit ?? '∞'}
                    </td>
                    <td>
                      <button
                        className={`badge badge--${c.isActive ? 'green' : 'gray'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={() => handleToggle(c.id)}
                        title="Toggle"
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-row">
                        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                        <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal title={editing ? 'Edit Coupon' : 'Create Coupon'} open={modal} onClose={() => setModal(false)} size="lg">
        <div className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Code *</label>
              <input className="form-control" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER20" />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select className="form-control" value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}>
                <option value="Percentage">Percentage (%)</option>
                <option value="FixedAmount">Fixed Amount</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Discount Value *</label>
              <input className="form-control" type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))} />
            </div>
            <div className="form-group">
              <label>Max Discount Amount</label>
              <input className="form-control" type="number" value={form.maxDiscountAmount ?? ''} onChange={e => setForm(f => ({ ...f, maxDiscountAmount: num(e.target.value) }))} placeholder="Optional cap" />
            </div>
          </div>
          <div className="form-group">
            <label>Minimum Order Amount</label>
            <input className="form-control" type="number" value={form.minOrderAmount ?? ''} onChange={e => setForm(f => ({ ...f, minOrderAmount: num(e.target.value) }))} placeholder="0 for no minimum" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input className="form-control" type="date" value={form.startDate ?? ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value || undefined }))} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input className="form-control" type="date" value={form.endDate ?? ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value || undefined }))} />
            </div>
          </div>
          <div className="form-group">
            <label>Usage Limit</label>
            <input className="form-control" type="number" value={form.usageLimit ?? ''} onChange={e => setForm(f => ({ ...f, usageLimit: num(e.target.value) }))} placeholder="Leave blank for unlimited" />
          </div>
          <label className="form-check">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
            Active
          </label>
          <div className="action-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn--ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Coupon'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
