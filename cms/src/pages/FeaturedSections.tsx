import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, LayoutGrid, Star, GripVertical, X, Search, Layers, FolderOpen } from 'lucide-react';
import Modal from '@/components/Modal';
import { AdminService } from '@/lib/adminApi';
import ImageUploader from '@/components/ImageUploader';
import type { FeaturedSection, CreateFeaturedSectionRequest, CreateFeaturedSectionItemRequest, AdminCategory } from '@/types/admin';
import type { Product, ProductImage } from '@/types';

const GRID_OPTIONS = [
  { value: 1, label: '1 Column', desc: 'Full width' },
  { value: 2, label: '2 Columns', desc: 'Side by side' },
  { value: 4, label: '4 Columns', desc: 'Grid 4' },
];

const TYPE_OPTIONS: { value: 'Manual' | 'Category'; label: string; desc: string; icon: typeof Layers }[] = [
  { value: 'Manual', label: 'Manual', desc: 'Pick products individually', icon: Layers },
  { value: 'Category', label: 'Category', desc: 'Auto-fill from a category', icon: FolderOpen },
];

const defaultForm: CreateFeaturedSectionRequest = {
  title: '',
  subtitle: '',
  type: 'Manual',
  categoryId: undefined,
  gridColumns: 2,
  displayOrder: 0,
  isActive: true,
  items: [],
};

export default function FeaturedSectionsPage() {
  const [sections, setSections] = useState<FeaturedSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<FeaturedSection | null>(null);
  const [form, setForm] = useState<CreateFeaturedSectionRequest>(defaultForm);
  const [saving, setSaving] = useState(false);

  // Product search
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Categories
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const load = () => {
    setLoading(true);
    AdminService.getFeaturedSections()
      .then(setSections)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Load categories when modal opens
  useEffect(() => {
    if (modal) {
      setCategoriesLoading(true);
      AdminService.getAdminCategories()
        .then(setCategories)
        .finally(() => setCategoriesLoading(false));
    }
  }, [modal]);

  // Search products
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (productSearch.trim()) {
        setSearchLoading(true);
        AdminService.getProducts({ search: productSearch, pageSize: 10 })
          .then(setProducts)
          .finally(() => setSearchLoading(false));
      } else {
        setProducts([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [productSearch]);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setProductSearch('');
    setProducts([]);
    setModal(true);
  };

  const openEdit = async (s: FeaturedSection) => {
    setEditing(s);
    const initialItems = s.type === 'Manual' ? s.items.map(i => ({
      productId: i.productId,
      overlayText: i.overlayText ?? '',
      linkUrl: i.linkUrl ?? '',
      imageUrl: i.imageUrl ?? '',
      displayOrder: i.displayOrder,
      // Keep for display
      _productName: i.productName,
      _productImage: i.productImage,
      _productPrice: i.productPrice,
      _productImages: [] as ProductImage[],
    } as any)) : [];

    setForm({
      title: s.title,
      subtitle: s.subtitle ?? '',
      type: s.type || 'Manual',
      categoryId: s.categoryId,
      gridColumns: s.gridColumns,
      displayOrder: s.displayOrder,
      isActive: s.isActive,
      items: initialItems,
    });
    setProductSearch('');
    setProducts([]);
    setModal(true);

    // Fetch product images for each item in parallel
    if (s.type === 'Manual' && s.items.length > 0) {
      const productDetails = await Promise.allSettled(
        s.items.map(i => AdminService.getProductById(i.productId))
      );

      setForm(f => ({
        ...f,
        items: f.items.map((item: any, idx: number) => {
          const result = productDetails[idx];
          if (result.status === 'fulfilled' && result.value) {
            const product = result.value;
            return {
              ...item,
              _productImages: product.images || [],
              // If no imageUrl was set, default to main image
              _productImage: item._productImage || product.images?.find((img: ProductImage) => img.isMain)?.url || product.images?.[0]?.url || '',
            };
          }
          return item;
        }),
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await AdminService.updateFeaturedSection(editing.id, form);
      } else {
        await AdminService.createFeaturedSection(form);
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
    if (!confirm('Delete this featured section?')) return;
    await AdminService.deleteFeaturedSection(id);
    load();
  };

  const addProduct = (product: Product) => {
    // Don't add duplicates
    if (form.items.some(i => i.productId === product.id)) return;

    const mainImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '';

    const newItem: CreateFeaturedSectionItemRequest & { _productName?: string; _productImage?: string; _productPrice?: number; _productImages?: ProductImage[] } = {
      productId: product.id,
      overlayText: '',
      linkUrl: `/product/${product.slug || product.id}`,
      imageUrl: mainImage,
      displayOrder: form.items.length,
      _productName: product.name,
      _productImage: mainImage,
      _productPrice: product.basePrice,
      _productImages: product.images || [],
    };

    setForm(f => ({ ...f, items: [...f.items, newItem] }));
    setProductSearch('');
    setProducts([]);
  };

  const removeItem = (index: number) => {
    setForm(f => ({
      ...f,
      items: f.items.filter((_, i) => i !== index).map((item, i) => ({ ...item, displayOrder: i })),
    }));
  };

  const updateItem = (index: number, key: string, value: string) => {
    setForm(f => ({
      ...f,
      items: f.items.map((item, i) => i === index ? { ...item, [key]: value } : item),
    }));
  };

  const gridLabel = (cols: number) => GRID_OPTIONS.find(g => g.value === cols)?.label ?? `${cols} cols`;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Featured Sections</h1>
          <p className="admin-page-sub">Manage featured product sections with configurable grid layouts</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          <Plus size={16} /> Add Section
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
                  <th>Title</th>
                  <th>Type</th>
                  <th>Layout</th>
                  <th>Items</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="admin-empty">
                        <Star size={40} />
                        <p className="admin-empty__title">No featured sections yet</p>
                      </div>
                    </td>
                  </tr>
                )}
                {sections.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.title}</div>
                      {s.subtitle && <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{s.subtitle}</div>}
                    </td>
                    <td>
                      <span className={`badge badge--${s.type === 'Category' ? 'blue' : 'yellow'}`}>
                        {s.type === 'Category' ? (
                          <><FolderOpen size={11} style={{ marginRight: 4 }} />{s.categoryName || 'Category'}</>
                        ) : (
                          <><Layers size={11} style={{ marginRight: 4 }} />Manual</>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge--purple" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <LayoutGrid size={12} /> {gridLabel(s.gridColumns)}
                      </span>
                    </td>
                    <td>{s.items.length} products</td>
                    <td>{s.displayOrder}</td>
                    <td>
                      <span className={`badge badge--${s.isActive ? 'green' : 'gray'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-row">
                        <button className="btn btn--ghost btn--icon btn--sm" onClick={() => openEdit(s)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(s.id)} title="Delete">
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
        title={editing ? 'Edit Featured Section' : 'Add Featured Section'}
        open={modal}
        onClose={() => setModal(false)}
        size="xl"
      >
        <div className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                className="form-control"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. New Arrivals"
              />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <input
                className="form-control"
                value={form.subtitle ?? ''}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                placeholder="Optional subtitle"
              />
            </div>
          </div>

          {/* Section Type Selection */}
          <div className="form-group">
            <label>Section Type</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              {TYPE_OPTIONS.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: opt.value, items: opt.value === 'Category' ? [] : f.items }))}
                    style={{
                      flex: 1,
                      padding: '16px 12px',
                      borderRadius: 'var(--admin-radius-sm)',
                      border: `2px solid ${form.type === opt.value ? 'var(--admin-accent)' : 'var(--admin-border)'}`,
                      background: form.type === opt.value ? 'rgba(99, 102, 241, 0.1)' : 'var(--admin-surface-2)',
                      cursor: 'pointer',
                      color: form.type === opt.value ? 'var(--admin-accent-light)' : 'var(--admin-text)',
                      transition: 'all 0.15s',
                      textAlign: 'center',
                    }}
                  >
                    <Icon size={24} style={{ marginBottom: 8, opacity: form.type === opt.value ? 1 : 0.5 }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selector (only for Category type) */}
          {form.type === 'Category' && (
            <div className="form-group">
              <label>Category *</label>
              {categoriesLoading ? (
                <div style={{ padding: 12, color: 'var(--admin-text-muted)', fontSize: 13 }}>Loading categories...</div>
              ) : (
                <select
                  className="form-control"
                  value={form.categoryId ?? ''}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value || undefined }))}
                >
                  <option value="">Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.productCount} products)
                    </option>
                  ))}
                </select>
              )}
              {form.categoryId && (
                <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)', fontSize: 12, color: 'var(--admin-text-muted)' }}>
                  Products from this category will be automatically included in this section.
                </div>
              )}
            </div>
          )}

          {/* Grid Layout Selection */}
          {form.type === 'Manual' && (
            <div className="form-group">
              <label>Grid Columns</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                {GRID_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, gridColumns: opt.value }))}
                    style={{
                      flex: 1,
                      padding: '16px 12px',
                      borderRadius: 'var(--admin-radius-sm)',
                      border: `2px solid ${form.gridColumns === opt.value ? 'var(--admin-accent)' : 'var(--admin-border)'}`,
                      background: form.gridColumns === opt.value ? 'rgba(99, 102, 241, 0.1)' : 'var(--admin-surface-2)',
                      cursor: 'pointer',
                      color: form.gridColumns === opt.value ? 'var(--admin-accent-light)' : 'var(--admin-text)',
                      transition: 'all 0.15s',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Display Order</label>
              <input
                className="form-control"
                type="number"
                value={form.displayOrder}
                onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))}
              />
            </div>
            <label className="form-check" style={{ alignSelf: 'end', paddingBottom: 10 }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              />
              Active
            </label>
          </div>

          {/* Product Items (only for Manual type) */}
          {form.type === 'Manual' && (
            <div className="form-group">
              <label>Products</label>

              {/* Product search */}
              <div style={{ position: 'relative', marginBottom: 8 }}>
                <div className="admin-search" style={{ width: '100%' }}>
                  <Search size={16} className="admin-search__icon" />
                  <input
                    className="form-control"
                    style={{ paddingLeft: 38, width: '100%' }}
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search products to add..."
                  />
                </div>

                {/* Search results dropdown */}
                {(products.length > 0 || searchLoading) && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--admin-radius-sm)',
                    maxHeight: 240,
                    overflowY: 'auto',
                    zIndex: 10,
                    marginTop: 4,
                    boxShadow: 'var(--admin-shadow)',
                  }}>
                    {searchLoading ? (
                      <div style={{ padding: 16, textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                        Searching...
                      </div>
                    ) : (
                      products.map(p => {
                        const isAdded = form.items.some(i => i.productId === p.id);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            disabled={isAdded}
                            onClick={() => addProduct(p)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              width: '100%',
                              padding: '10px 14px',
                              background: 'none',
                              border: 'none',
                              borderBottom: '1px solid var(--admin-border)',
                              cursor: isAdded ? 'default' : 'pointer',
                              opacity: isAdded ? 0.4 : 1,
                              color: 'var(--admin-text)',
                              transition: 'background 0.1s',
                            }}
                            onMouseOver={e => { if (!isAdded) (e.currentTarget.style.background = 'var(--admin-surface-2)'); }}
                            onMouseOut={e => { e.currentTarget.style.background = 'none'; }}
                          >
                            <img
                              src={p.images?.find(img => img.isMain)?.url || p.images?.[0]?.url || ''}
                              alt={p.name}
                              style={{
                                width: 36, height: 36, objectFit: 'cover',
                                borderRadius: 6, border: '1px solid var(--admin-border)',
                                background: 'var(--admin-surface-2)',
                              }}
                              onError={e => { (e.currentTarget.style.display = 'none'); }}
                            />
                            <div style={{ flex: 1, textAlign: 'left' }}>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>
                                {new Intl.NumberFormat('vi-VN').format(p.basePrice)} VND
                              </div>
                            </div>
                            {isAdded && <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Added</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Selected items */}
              {form.items.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  border: '2px dashed var(--admin-border)',
                  borderRadius: 'var(--admin-radius-sm)',
                  color: 'var(--admin-text-muted)',
                  fontSize: 13,
                }}>
                  No products added. Search above to add products.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.items.map((item: any, index: number) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--admin-surface-2)', border: '1px solid var(--admin-border)', borderRadius: 'var(--admin-radius-sm)' }}>
                      <GripVertical size={16} style={{ color: 'var(--admin-text-muted)', flexShrink: 0 }} />
                      
                      {/* Current selected image */}
                      <img
                        src={item.imageUrl || item._productImage || ''}
                        alt={item._productName}
                        style={{
                          width: 48, height: 48, objectFit: 'cover',
                          borderRadius: 6, border: '2px solid var(--admin-accent)',
                          background: 'var(--admin-surface-3)',
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ flex: 1, minWidth: 100 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item._productName ?? 'Product'}
                        </div>
                        
                        {/* Image selection thumbnails */}
                        {(item._productImages?.length > 0) && (
                          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            {item._productImages.map((img: ProductImage, imgIdx: number) => {
                              const imgUrl = img.url || img.thumbnailUrl || '';
                              const isSelected = item.imageUrl === imgUrl;
                              return (
                                <button
                                  key={imgIdx}
                                  type="button"
                                  onClick={() => updateItem(index, 'imageUrl', imgUrl)}
                                  title={img.isMain ? 'Main image' : `Image ${imgIdx + 1}`}
                                  style={{
                                    width: 32, height: 32, padding: 0,
                                    border: isSelected ? '2px solid var(--admin-accent)' : '1px solid var(--admin-border)',
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    background: 'var(--admin-surface-3)',
                                    opacity: isSelected ? 1 : 0.6,
                                    transition: 'all 0.15s',
                                    flexShrink: 0,
                                    position: 'relative',
                                  }}
                                  onMouseOver={e => { e.currentTarget.style.opacity = '1'; }}
                                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.opacity = '0.6'; }}
                                >
                                  <img src={img.thumbnailUrl || imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                              );
                            })}
                            
                            {/* Upload custom image button */}
                            <div style={{ position: 'relative' }}>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id={`upload-featured-${index}`}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const result = await AdminService.uploadImage(file, 'featured');
                                    const url = typeof result === 'string' ? result : result.originalUrl;
                                    updateItem(index, 'imageUrl', url);
                                  } catch (err) {
                                    console.error('Upload failed:', err);
                                  }
                                  e.target.value = '';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById(`upload-featured-${index}`)?.click()}
                                title="Upload custom image"
                                style={{
                                  width: 32, height: 32, padding: 0,
                                  border: '1px dashed var(--admin-border)',
                                  borderRadius: 4,
                                  background: 'var(--admin-surface-2)',
                                  cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: 'var(--admin-text-muted)',
                                  fontSize: 16,
                                  transition: 'all 0.15s',
                                }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--admin-accent)'; e.currentTarget.style.color = 'var(--admin-accent)'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.color = 'var(--admin-text-muted)'; }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        className="form-control"
                        style={{ width: 140, padding: '6px 10px', fontSize: 12 }}
                        placeholder="Overlay text"
                        value={item.overlayText ?? ''}
                        onChange={e => updateItem(index, 'overlayText', e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn btn--danger btn--icon btn--sm"
                        onClick={() => removeItem(index)}
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="action-row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn btn--ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Section'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
