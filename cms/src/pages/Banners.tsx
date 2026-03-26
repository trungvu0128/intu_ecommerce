import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import Modal from '@/components/Modal';
import { AdminService } from '@/lib/adminApi';
import ImageUploader from '@/components/ImageUploader';
import type { Banner, CreateBannerRequest } from '@/types/admin';

const POSITIONS = ['MainHero', 'SecondaryHero', 'Sidebar', 'Footer', 'Popup'];

const defaultForm: CreateBannerRequest = {
  title: '',
  imageUrl: '',
  linkUrl: '',
  position: 'MainHero',
  displayOrder: 0,
  isActive: true,
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<CreateBannerRequest>(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    AdminService.getBanners()
      .then(setBanners)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModal(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      title: b.title ?? '',
      imageUrl: b.imageUrl,
      linkUrl: b.linkUrl ?? '',
      position: b.position,
      displayOrder: b.displayOrder,
      isActive: b.isActive,
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await AdminService.updateBanner(editing.id, form);
      } else {
        await AdminService.createBanner(form);
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
    if (!confirm('Delete this banner?')) return;
    await AdminService.deleteBanner(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Banners</h1>
          <p className="admin-page-sub">Manage homepage banners and promotional images</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          <Plus size={16} /> Add Banner
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Position</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-empty">
                        <ImageIcon size={40} />
                        <p className="admin-empty__title">No banners yet</p>
                      </div>
                    </td>
                  </tr>
                )}
                {banners.map(b => (
                  <tr key={b.id}>
                    <td>
                      {b.imageUrl ? (
                        <img src={b.imageUrl} alt={b.title} className="img-preview" />
                      ) : (
                        <div className="img-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={18} style={{ color: 'var(--admin-text-muted)' }} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.title ?? '—'}</div>
                      {b.linkUrl && <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }} className="truncate">{b.linkUrl}</div>}
                    </td>
                    <td><span className="badge badge--blue">{b.position}</span></td>
                    <td>{b.displayOrder}</td>
                    <td>
                      <span className={`badge badge--${b.isActive ? 'green' : 'gray'}`}>
                        {b.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-row">
                        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => openEdit(b)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(b.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
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
      <Modal
        title={editing ? 'Edit Banner' : 'Add Banner'}
        open={modal}
        onClose={() => setModal(false)}
      >
        <div className="admin-form">
          <div className="form-group">
            <label>Title</label>
            <input className="form-control" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Banner title (optional)" />
          </div>
          <div className="form-group">
            <label>Image URL *</label>
            <ImageUploader 
              value={form.imageUrl} 
              onChange={val => setForm(f => ({ ...f, imageUrl: val }))} 
              folder="banners"
              placeholder="https://... or click Upload" 
            />
            {form.imageUrl && <img src={form.imageUrl} alt="preview" style={{ marginTop: 8, height: 80, objectFit: 'cover', borderRadius: 8 }} onError={e => (e.currentTarget.style.display = 'none')} />}
          </div>
          <div className="form-group">
            <label>Link URL</label>
            <input className="form-control" value={form.linkUrl ?? ''} onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))} placeholder="/shop or https://..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Position</label>
              <select className="form-control" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Display Order</label>
              <input className="form-control" type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <label className="form-check">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
            Active
          </label>
          <div className="action-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn--ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Banner'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
