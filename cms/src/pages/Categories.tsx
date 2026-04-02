import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Tag, X, Package, Eye, ArrowLeft } from 'lucide-react';
import Modal from '@/components/Modal';
import { AdminService } from '@/lib/adminApi';
import ImageUploader from '@/components/ImageUploader';
import type { AdminCategory, CreateCategoryRequest, CategoryProduct } from '@/types/admin';
import type { Product } from '@/types';
import { Search } from 'lucide-react';

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

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<CreateCategoryRequest>(defaultForm);
  const [saving, setSaving] = useState(false);

  // Detail panel state
  const [detailCategory, setDetailCategory] = useState<AdminCategory | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Manage Products Modal
  const [productModal, setProductModal] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [savingProducts, setSavingProducts] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (productModal) {
        setSearchLoading(true);
        // Load some initial products or search results
        AdminService.getProducts({ search: productSearch, pageSize: 50 })
          .then(setSearchResults)
          .finally(() => setSearchLoading(false));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [productSearch, productModal]);

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

  const openEdit = (c: AdminCategory, e: React.MouseEvent) => {
    e.stopPropagation();
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
      // Refresh detail if the edited category is currently viewed
      if (editing && detailCategory?.id === editing.id) {
        loadCategoryDetail(editing.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this category? Products in this category may be affected.')) return;
    await AdminService.deleteCategory(id);
    if (detailCategory?.id === id) setDetailCategory(null);
    load();
  };

  const loadCategoryDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await AdminService.getCategoryById(id);
      setDetailCategory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  const openProductModal = () => {
    if (!detailCategory) return;
    setSelectedProductIds(detailCategory.products?.map(p => p.id) || []);
    setProductSearch('');
    setProductModal(true);
  };

  const saveProducts = async () => {
    if (!detailCategory) return;
    setSavingProducts(true);
    try {
      await AdminService.updateCategoryProducts(detailCategory.id, selectedProductIds);
      setProductModal(false);
      loadCategoryDetail(detailCategory.id);
      load(); // Refresh list to update count
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProducts(false);
    }
  };

  const handleRowClick = (c: AdminCategory) => {
    if (detailCategory?.id === c.id) {
      setDetailCategory(null);
    } else {
      loadCategoryDetail(c.id);
    }
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

      <div style={{ display: 'grid', gridTemplateColumns: detailCategory ? '1fr 420px' : '1fr', gap: 20, alignItems: 'start', transition: 'all 0.3s' }}>
        {/* Categories Table */}
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
                    <tr
                      key={c.id}
                      onClick={() => handleRowClick(c)}
                      style={{
                        cursor: 'pointer',
                        background: detailCategory?.id === c.id ? 'var(--admin-hover)' : undefined,
                        transition: 'background 0.15s',
                      }}
                    >
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
                      <td>
                        <span style={{ fontWeight: 500, color: c.productCount > 0 ? 'var(--admin-primary)' : 'var(--admin-text-muted)' }}>
                          {c.productCount}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge--${c.isActive ? 'green' : 'gray'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-row">
                          <button className="btn btn--ghost btn--icon btn--sm" onClick={(e) => openEdit(c, e)}><Pencil size={14} /></button>
                          <button className="btn btn--danger btn--icon btn--sm" onClick={(e) => handleDelete(c.id, e)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {detailCategory && (
          <div className="admin-card" style={{ padding: 0, position: 'sticky', top: 20 }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderBottom: '1px solid var(--admin-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {detailCategory.imageUrl && (
                  <img src={detailCategory.imageUrl} alt={detailCategory.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                )}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--admin-text)' }}>{detailCategory.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>{detailCategory.slug}</div>
                </div>
              </div>
              <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setDetailCategory(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Category Info */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className={`badge badge--${detailCategory.isActive ? 'green' : 'gray'}`}>
                {detailCategory.isActive ? 'Active' : 'Inactive'}
              </span>
              {detailCategory.parentName && (
                <span className="badge badge--purple">Parent: {detailCategory.parentName}</span>
              )}
              <span className="badge badge--blue" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                {detailCategory.productCount} product{detailCategory.productCount !== 1 ? 's' : ''}
              </span>
            </div>

            {detailCategory.description && (
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--admin-border)', fontSize: 13, color: 'var(--admin-text-muted)', lineHeight: 1.5 }}>
                {detailCategory.description}
              </div>
            )}

            {/* Products List */}
            <div style={{ padding: '12px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--admin-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={14} />
                Products in this category
              </div>
              <button className="btn btn--sm btn--ghost" onClick={openProductModal}>
                <Plus size={14} /> Manage Products
              </button>
            </div>

            {detailLoading ? (
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <div className="admin-spinner" />
              </div>
            ) : (
              <div style={{ maxHeight: 440, overflowY: 'auto' }}>
                {(!detailCategory.products || detailCategory.products.length === 0) ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                    <Package size={32} style={{ color: 'var(--admin-text-muted)', marginBottom: 8 }} />
                    <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>No products in this category</div>
                  </div>
                ) : (
                  <div style={{ padding: '0 12px 12px' }}>
                    {detailCategory.products.map((p: CategoryProduct) => (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/products/${p.id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 12px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                          marginBottom: 2,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Product Image */}
                        <div style={{
                          width: 44, height: 44, borderRadius: 8, overflow: 'hidden',
                          background: 'var(--admin-surface-2)', flexShrink: 0, border: '1px solid var(--admin-border)',
                        }}>
                          {p.mainImageUrl ? (
                            <img src={p.mainImageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Package size={18} style={{ color: 'var(--admin-text-muted)' }} />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--admin-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                            {formatPrice(p.basePrice)}
                          </div>
                        </div>

                        {/* Status */}
                        <span className={`badge badge--${p.isActive ? 'green' : 'gray'}`} style={{ fontSize: 11, flexShrink: 0 }}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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

      {/* Manage Products Modal */}
      <Modal title={`Manage Products in ${detailCategory?.name}`} open={productModal} onClose={() => setProductModal(false)} size="lg">
        <div className="admin-form">
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div className="admin-search" style={{ width: '100%' }}>
              <Search size={16} className="admin-search__icon" />
              <input
                className="form-control"
                style={{ paddingLeft: 38, width: '100%' }}
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products..."
              />
            </div>
          </div>

          <div style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-sm)' }}>
            {searchLoading ? (
              <div style={{ padding: 30, textAlign: 'center' }}><div className="admin-spinner" /></div>
            ) : searchResults.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: 13 }}>No products found</div>
            ) : (
              <div>
                {searchResults.map(p => {
                  const isSelected = selectedProductIds.includes(p.id);
                  const imgUrl = p.images?.find((i: any) => i.isMain)?.url || p.images?.[0]?.url;
                  return (
                    <label
                      key={p.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                        borderBottom: '1px solid var(--admin-border)', cursor: 'pointer',
                        background: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        transition: 'background 0.1s'
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ width: 16, height: 16 }}
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(prev => [...prev, p.id]);
                          } else {
                            setSelectedProductIds(prev => prev.filter(id => id !== p.id));
                          }
                        }}
                      />
                      <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--admin-surface-2)', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                        {imgUrl && <img src={imgUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--admin-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>{formatPrice(p.basePrice)}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--admin-text-muted)' }}>
            Selected: <span style={{ fontWeight: 600, color: 'var(--admin-text)' }}>{selectedProductIds.length}</span> products
          </div>

          <div className="action-row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn--ghost" onClick={() => setProductModal(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={saveProducts} disabled={savingProducts}>
              {savingProducts ? 'Saving…' : 'Save Products'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
