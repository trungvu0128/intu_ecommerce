import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import Modal from '@/components/Modal';
import { AdminService } from '@/lib/adminApi';
import ImageUploader from '@/components/ImageUploader';
import type { AdminCategory, CreateCategoryRequest } from '@/types/admin';

const defaultForm: CreateCategoryRequest = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  isActive: true,
  parentId: undefined,
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<CreateCategoryRequest>(defaultForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    AdminService.getAdminCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setModal(true);
  };

  const openEdit = (c: AdminCategory) => {
    setEditing(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      imageUrl: c.imageUrl ?? '',
      isActive: c.isActive,
      parentId: c.parentId,
    });
    setModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await AdminService.updateCategory(editing.id, form);
      } else {
        await AdminService.createCategory(form);
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
    if (!confirm('Delete this category? Products in this category may be affected.')) return;
    await AdminService.deleteCategory(id);
    load();
  };

  const rootCategories = categories.filter(c => !c.parentId);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-sub">Manage product categories and hierarchy</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          <Plus size={16} /> Add Category
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
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Parent</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr><td colSpan={6}>
                    <div className="admin-empty">
                      <Tag size={40} />
                      <p className="admin-empty__title">No categories yet</p>
                    </div>
                  </td></tr>
                )}
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {c.imageUrl && <img src={c.imageUrl} alt={c.name} className="img-preview" style={{ width: 32, height: 32 }} />}
                        <div>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          {c.description && <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }} className="truncate">{c.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--admin-text-muted)' }}>{c.slug}</td>
                    <td>{c.parentName ? <span className="badge badge--purple">{c.parentName}</span> : '—'}</td>
                    <td>{c.productCount}</td>
                    <td>
                      <span className={`badge badge--${c.isActive ? 'green' : 'gray'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
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

      <Modal title={editing ? 'Edit Category' : 'Add Category'} open={modal} onClose={() => setModal(false)}>
        <div className="admin-form">
          <div className="form-group">
            <label>Name *</label>
            <input className="form-control" value={form.name} onChange={e => {
              const name = e.target.value;
              setForm(f => ({ ...f, name, slug: editing ? f.slug : toSlug(name) }));
            }} placeholder="Category name" />
          </div>
          <div className="form-group">
            <label>Slug *</label>
            <input className="form-control" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="category-slug" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" rows={3} value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <ImageUploader 
              value={form.imageUrl ?? ''} 
              onChange={(val: string) => setForm(f => ({ ...f, imageUrl: val }))} 
              folder="categories"
            />
          </div>
          <div className="form-group">
            <label>Parent Category</label>
            <select className="form-control" value={form.parentId ?? ''} onChange={e => setForm(f => ({ ...f, parentId: e.target.value || undefined }))}>
              <option value="">— None (Root Category) —</option>
              {rootCategories.filter(c => c.id !== editing?.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <label className="form-check">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
            Active
          </label>
          <div className="action-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn--ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
