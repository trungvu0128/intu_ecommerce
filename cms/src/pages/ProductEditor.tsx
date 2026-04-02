import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Upload, Image as ImageIcon, GripVertical, X } from 'lucide-react';
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
  file?: File;
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

// Recursively resolve a url value that may be a string, a UrlDto, or a doubly-nested object
function resolveUrl(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    // Try originalUrl first, then thumbnailUrl, then url
    const candidate = val.originalUrl ?? val.thumbnailUrl ?? val.url ?? '';
    return resolveUrl(candidate); // recurse in case it's still nested
  }
  return String(val);
}

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
  const [uploadedImageUrls, setUploadedImageUrls] = useState<Map<string, string>>(new Map());

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
            images: p.images?.length ? p.images.map((img: any) => ({
              id: img.id,
              url: resolveUrl(img.url) || resolveUrl(img.thumbnailUrl),
              isMain: img.isMain
            })) : defaultForm.images,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const imagesWithFiles = form.images.filter(img => img.file);

      // Build image payload for existing (non-file) images
      let processedImages = form.images.filter(img => !img.file).map(img => {
        const flatUrl = resolveUrl(img.url);
        return {
          url: {
            originalUrl: flatUrl,
            thumbnailUrl: flatUrl
          },
          isMain: img.isMain
        };
      });

      if (imagesWithFiles.length > 0) {
        const uploadPromises = imagesWithFiles.map(async (img) => {
          if (img.file) {
            const fileKey = `${img.file.name}-${img.file.size}-${img.file.lastModified}`;

            if (uploadedImageUrls.has(fileKey)) {
              const cachedUrl = uploadedImageUrls.get(fileKey)!;
              return {
                url: {
                  originalUrl: cachedUrl,
                  thumbnailUrl: cachedUrl
                },
                isMain: img.isMain
              };
            }

            // uploadImage returns { originalUrl, thumbnailUrl }
            const result = await AdminService.uploadImage(img.file, 'products');
            const uploadedUrl = result.originalUrl;
            const uploadedThumb = result.thumbnailUrl || uploadedUrl;
            setUploadedImageUrls(prev => new Map(prev).set(fileKey, uploadedUrl));

            return {
              url: {
                originalUrl: uploadedUrl,
                thumbnailUrl: uploadedThumb
              },
              isMain: img.isMain
            };
          }
          return null;
        });

        const uploadedImages = await Promise.all(uploadPromises);
        const validUploadedImages = uploadedImages.filter(img => img !== null);
        processedImages = [...processedImages, ...validUploadedImages];
      }

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        basePrice: form.basePrice,
        isFeatured: form.isFeatured,
        categoryId: form.categoryId,
        brandId: form.brandId,
        variants: form.variants.filter(v => v.sku),
        images: processedImages,
      };

      if (isNew) {
        await AdminService.createProduct(payload);
      } else {
        await AdminService.updateProduct(id!, payload);
      }

      setUploadedImageUrls(new Map());
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

  const handleMultipleImageUpload = (files: FileList) => {
    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      isMain: false,
      file: file
    }));
    setForm(f => ({ ...f, images: [...f.images, ...newImages] }));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setForm(f => {
      const newImages = [...f.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return { ...f, images: newImages };
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

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
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn--ghost btn--sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={14} /> Upload Multiple
                </button>
                <button className="btn btn--ghost btn--sm" onClick={addImage}><Plus size={14} /> Add URL</button>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleMultipleImageUpload(e.target.files);
                }
              }}
            />

            {form.images.length === 0 ? (
              <div
                style={{
                  border: '2px dashed #e5e7eb',
                  borderRadius: '8px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'rgba(249, 250, 251, 0.5)',
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.5)';
                }}
              >
                <Upload size={48} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                <div style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                  Click to upload images
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  JPG, PNG, GIF, WebP supported
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {form.images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      border: img.isMain ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 10,
                        display: 'flex',
                        gap: 4,
                      }}
                    >
                      <button
                        className="btn btn--ghost btn--icon btn--sm"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px' }}
                        onClick={() => moveImage(idx, Math.max(0, idx - 1))}
                        disabled={idx === 0}
                      >
                        <GripVertical size={14} />
                      </button>
                      <button
                        className="btn btn--ghost btn--icon btn--sm"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '4px' }}
                        onClick={() => moveImage(idx, Math.min(form.images.length - 1, idx + 1))}
                        disabled={idx === form.images.length - 1}
                      >
                        <GripVertical size={14} />
                      </button>
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 10,
                      }}
                    >
                      <button
                        className="btn btn--danger btn--icon btn--sm"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          borderRadius: '4px',
                          padding: '6px',
                          minWidth: '32px',
                          minHeight: '32px'
                        }}
                        onClick={() => removeImage(idx)}
                        disabled={form.images.length === 1}
                        title="Remove image"
                      >
                        <Trash2 size={14} style={{ color: 'white' }} />
                      </button>
                    </div>

                    {img.url ? (
                      <img
                        src={img.url}
                        alt={`Product image ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          backgroundColor: '#f3f4f6',
                        }}
                      >
                        <ImageIcon size={32} style={{ color: '#9ca3af' }} />
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>No image</div>
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => removeImage(idx)}
                          style={{ marginTop: '8px' }}
                        >
                          <Trash2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Remove
                        </button>
                      </div>
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderTop: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label className="form-check" style={{ margin: 0, gap: 4, fontSize: '12px' }}>
                          <input
                            type="checkbox"
                            checked={img.isMain}
                            onChange={e => {
                              setForm(f => ({ ...f, images: f.images.map((im, i) => ({ ...im, isMain: i === idx ? e.target.checked : false })) }));
                            }}
                          />
                          Main
                        </label>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>#{idx + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
