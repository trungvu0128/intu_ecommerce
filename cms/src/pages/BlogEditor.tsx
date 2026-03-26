import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';
import type { CreateBlogPostRequest, BlogCategory } from '@/types/admin';

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const defaultForm: CreateBlogPostRequest = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  thumbnailUrl: '',
  categoryId: undefined,
  isPublished: false,
};

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateBlogPostRequest>(defaultForm);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    AdminService.getBlogCategories().then(setCategories).catch(console.error);
    if (!isNew && id) {
      setLoading(true);
      AdminService.getBlogPost(id).then(post => {
        setForm({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt ?? '',
          thumbnailUrl: post.thumbnailUrl ?? '',
          categoryId: post.categoryId ?? undefined,
          isPublished: post.isPublished,
        });
      }).finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await AdminService.createBlogPost(form);
      } else {
        await AdminService.updateBlogPost(id!, form);
      }
      navigate('/blogs');
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-center"><div className="admin-spinner" /></div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/blogs" className="btn btn--ghost btn--icon">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="admin-page-title">{isNew ? 'New Blog Post' : 'Edit Post'}</h1>
          </div>
        </div>
        <div className="action-row">
          <label className="form-check" style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
            />
            Publish
          </label>
          <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save Post'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-card" style={{ padding: 20 }}>
            <div className="admin-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={e => {
                    const title = e.target.value;
                    setForm(f => ({ ...f, title, slug: isNew ? toSlug(title) : f.slug }));
                  }}
                  placeholder="Post title"
                  style={{ fontSize: 18, fontWeight: 700 }}
                />
              </div>
              <div className="form-group">
                <label>Slug</label>
                <input
                  className="form-control"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  placeholder="url-slug"
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
              </div>
              <div className="form-group">
                <label>Excerpt</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.excerpt ?? ''}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Short post summary"
                />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  className="form-control"
                  rows={18}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your content here (Markdown or HTML)…"
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="admin-card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 14, color: 'var(--admin-text)' }}>Meta</div>
            <div className="admin-form">
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={form.categoryId ?? ''}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value || undefined }))}
                >
                  <option value="">— Uncategorized —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Thumbnail URL</label>
                <input
                  className="form-control"
                  value={form.thumbnailUrl ?? ''}
                  onChange={e => setForm(f => ({ ...f, thumbnailUrl: e.target.value }))}
                  placeholder="https://..."
                />
                {form.thumbnailUrl && (
                  <img
                    src={form.thumbnailUrl}
                    alt="preview"
                    style={{ marginTop: 8, width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
