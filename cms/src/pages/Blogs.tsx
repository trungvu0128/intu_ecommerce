import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminService } from '@/lib/adminApi';
import type { BlogPost } from '@/types/admin';

const statusTabs = [
  { label: 'All', value: undefined },
  { label: 'Published', value: true },
  { label: 'Drafts', value: false },
];

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<boolean | undefined>(undefined);

  const load = (isPublished?: boolean) => {
    setLoading(true);
    AdminService.getBlogPosts(isPublished)
      .then(setPosts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(activeTab); }, [activeTab]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await AdminService.deleteBlogPost(id);
    load(activeTab);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog Posts</h1>
          <p className="admin-page-sub">Create and manage blog content</p>
        </div>
        <Link to="/blogs/new" className="btn btn--primary">
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        {statusTabs.map(tab => (
          <button
            key={String(tab.value)}
            className={`admin-tab ${activeTab === tab.value ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-center"><div className="admin-spinner" /></div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="admin-empty">
                      <FileText size={40} />
                      <p className="admin-empty__title">No blog posts yet</p>
                    </div>
                  </td></tr>
                )}
                {posts.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.thumbnailUrl ? (
                        <img src={p.thumbnailUrl} alt={p.title} className="img-preview" />
                      ) : (
                        <div className="img-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={18} style={{ color: 'var(--admin-text-muted)' }} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }} className="truncate">{p.title}</div>
                      {p.excerpt && <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }} className="truncate">{p.excerpt}</div>}
                    </td>
                    <td>
                      {p.categoryName ? <span className="badge badge--blue">{p.categoryName}</span> : '—'}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>{p.authorName ?? '—'}</td>
                    <td>
                      <span className={`badge badge--${p.isPublished ? 'green' : 'yellow'}`}>
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>
                      {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <div className="action-row">
                        <Link to={`/blogs/${p.id}`} className="btn btn--ghost btn--icon btn--sm" title="Edit">
                          <Pencil size={14} />
                        </Link>
                        <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
