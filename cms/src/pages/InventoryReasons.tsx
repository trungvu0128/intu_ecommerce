import { useEffect, useState, useCallback } from 'react';
import { ClipboardList, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';
import type { InventoryReason, CreateInventoryReasonRequest } from '@/types/admin';

const emptyForm: CreateInventoryReasonRequest = { name: '', description: '', type: 'Both', isActive: true };

export default function InventoryReasonsPage() {
  const [reasons, setReasons] = useState<InventoryReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateInventoryReasonRequest>({ ...emptyForm });

  const load = useCallback(() => {
    setLoading(true);
    AdminService.getInventoryReasons()
      .then(setReasons)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (r: InventoryReason) => {
    setEditId(r.id);
    setForm({ name: r.name, description: r.description ?? '', type: r.type, isActive: r.isActive });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        await AdminService.updateInventoryReason(editId, form);
      } else {
        await AdminService.createInventoryReason(form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to save reason');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reason?')) return;
    try {
      await AdminService.deleteInventoryReason(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to delete reason');
    }
  };

  const typeBadge = (type: string) => {
    if (type === 'Receipt') return <span className="badge badge--green">Receipt</span>;
    if (type === 'Issue') return <span className="badge badge--red">Issue</span>;
    return <span className="badge badge--blue">Both</span>;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory Reasons</h1>
          <p className="admin-page-sub">Manage reasons for stock receipts and issues</p>
        </div>
        <div className="action-row">
          <button className="btn btn--ghost" onClick={load} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
          </button>
          <button className="btn btn--primary" onClick={openCreate}>
            <Plus size={16} /> Add Reason
          </button>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-center"><div className="admin-spinner" /></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reasons.length === 0 && (
                  <tr><td colSpan={5}>
                    <div className="admin-empty">
                      <ClipboardList size={40} />
                      <p className="admin-empty__title">No reasons found</p>
                      <p>Create your first inventory reason to get started</p>
                    </div>
                  </td></tr>
                )}
                {reasons.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.name}</td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{r.description || '—'}</td>
                    <td>{typeBadge(r.type)}</td>
                    <td>
                      {r.isActive
                        ? <span className="badge badge--green">Active</span>
                        : <span className="badge badge--gray">Inactive</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn--ghost btn--sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
                        <button className="btn btn--ghost btn--sm" style={{ color: 'var(--admin-danger)' }} onClick={() => handleDelete(r.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2 className="admin-modal__title">{editId ? 'Edit Reason' : 'Add Reason'}</h2>

            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Purchase Order" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-control" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
                <option value="Both">Both (Receipt & Issue)</option>
                <option value="Receipt">Receipt only</option>
                <option value="Issue">Issue only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                Active
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSave} disabled={saving || !form.name.trim()}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
