import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';
import ImageUploader from '@/components/ImageUploader';
import type { AdminCategory } from '@/types/admin';

interface Variant {
  id?: string;
  sku: string;
  color: string;
  size: string;
  priceAdjustment: number;
  stockQuantity: number;
}

interface ImageItem {
  id?: string;
  url: string;
  isMain: boolean;
}

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isFeatured: boolean;
  categoryId: string;
  brandId: string;
  variants: Variant[];
  images: ImageItem[];
}

const defaultForm: ProductForm = {
  name: '',
  slug: '',
  description: '',
  basePrice: 0,
  isFeatured: false,
  categoryId: '',
  brandId: '',
  variants: [{ sku: '', color: '', size: '', priceAdjustment: 0, stockQuantity: 0 }],
  images: [{ url: '', isMain: true }],
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    AdminService.getAdminCategories().then(setCategories).catch(console.error);
    if (!isNew && id) {
      setLoading(true);
      AdminService.getProductById(id)
        .then((p: any) => {
          setForm({
            name: p.name,
            slug: p.slug,
            description: p.description,
            basePrice: p.basePrice,
            isFeatured: p.isFeatured,
            categoryId: p.category?.id ?? p.categoryId ?? '',
            brandId: p.brandId ?? '',
            variants: p.variants?.length ? p.variants : defaultForm.variants,
            images: p.images?.length ? p.images : defaultForm.images,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        basePrice: form.basePrice,
        isFeatured: form.isFeatured,
        categoryId: form.categoryId,
        brandId: form.brandId,
        variants: form.variants.filter(v => v.sku),
        images: form.images.filter(i => i.url),
      };
      if (isNew) {
        await AdminService.createProduct(payload);
      } else {
        await AdminService.updateProduct(id!, payload);
      }
      navigate('/products');
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const setVariant = (idx: number, field: keyof Variant, value: string | number) => {
    setForm(f => {
      const v = [...f.variants];
      (v[idx] as any)[field] = value;
      return { ...f, variants: v };
    });
  };

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { sku: '', color: '', size: '', priceAdjustment: 0, stockQuantity: 0 }] }));
  const removeVariant = (idx: number) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));

  const setImage = (idx: number, field: keyof ImageItem, value: string | boolean) => {
    setForm(f => {
      const imgs = [...f.images];
      (imgs[idx] as any)[field] = value;
      return { ...f, images: imgs };
    });
  };

  const addImage = () => setForm(f => ({ ...f, images: [...f.images, { url: '', isMain: false }] }));
  const removeImage = (idx: number) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  if (loading) {
    return <div className="admin-loading-center"><div className="admin-spinner" /></div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/products" className="btn btn--ghost btn--icon">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="admin-page-title">{isNew ? 'New Product' : 'Edit Product'}</h1>
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving…' : 'Save Product'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Basic Info */}
          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, color: 'var(--admin-text)' }}>Basic Information</div>
            <div className="admin-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input className="form-control" value={form.name} onChange={e => {
                  const name = e.target.value;
                  setForm(f => ({ ...f, name, slug: isNew ? toSlug(name) : f.slug }));
                }} />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input className="form-control" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={{ fontFamily: 'monospace' }} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--admin-text)' }}>Variants</div>
              <button className="btn btn--ghost btn--sm" onClick={addVariant}><Plus size={14} /> Add Variant</button>
            </div>
            {form.variants.map((v, idx) => (
              <div key={idx} style={{ background: 'var(--admin-surface-2)', borderRadius: 8, padding: '14px', marginBottom: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
                  {(['sku', 'color', 'size'] as const).map(field => (
                    <div className="form-group" key={field} style={{ marginBottom: 0 }}>
                      <label style={{ textTransform: 'capitalize' }}>{field}</label>
                      <input className="form-control" value={v[field]} onChange={e => setVariant(idx, field, e.target.value)} />
                    </div>
                  ))}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Price +/-</label>
                    <input className="form-control" type="number" value={v.priceAdjustment} onChange={e => setVariant(idx, 'priceAdjustment', Number(e.target.value))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Stock</label>
                    <input className="form-control" type="number" value={v.stockQuantity} onChange={e => setVariant(idx, 'stockQuantity', Number(e.target.value))} />
                  </div>
                  <button className="btn btn--danger btn--icon btn--sm" onClick={() => removeVariant(idx)} disabled={form.variants.length === 1}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--admin-text)' }}>Images</div>
              <button className="btn btn--ghost btn--sm" onClick={addImage}><Plus size={14} /> Add Image</button>
            </div>
            {form.images.map((img, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <ImageUploader 
                  value={img.url} 
                  onChange={(url: string) => setImage(idx, 'url', url)} 
                  folder={`products/${form.slug || 'new'}`}
                  placeholder="Image URL or click Upload"
                />
                <label className="form-check" style={{ whiteSpace: 'nowrap', gap: 4 }}>
                  <input type="checkbox" checked={img.isMain} onChange={e => {
                    setForm(f => ({ ...f, images: f.images.map((im, i) => ({ ...im, isMain: i === idx ? e.target.checked : false })) }));
                  }} />
                  Main
                </label>
                <button className="btn btn--danger btn--icon btn--sm" onClick={() => removeImage(idx)} disabled={form.images.length === 1}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Pricing & Category</div>
            <div className="admin-form">
              <div className="form-group">
                <label>Base Price *</label>
                <input className="form-control" type="number" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: Number(e.target.value) }))} />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">— Select Category —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <label className="form-check">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                Featured Product
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
