import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminService } from '@/lib/adminApi';
import type { Product } from '@/types';
import type { AdminCategory } from '@/types/admin';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const load = () => {
    setLoading(true);
    AdminService.getProducts({
      search: search || undefined,
      categoryId: categoryFilter || undefined,
    })
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    AdminService.getAdminCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(load, [search, categoryFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await AdminService.deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">{products.length} products</p>
        </div>
        <Link to="/products/new" className="btn btn--primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="admin-search">
          <Search size={16} className="admin-search__icon" />
          <input
            className="form-control"
            style={{ paddingLeft: 36, width: 260 }}
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ width: 200 }}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
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
                  <th>Name</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Variants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="admin-empty">
                      <Package size={40} />
                      <p className="admin-empty__title">No products found</p>
                    </div>
                  </td></tr>
                )}
                {products.map((p: any) => {
                  const mainImage = p.images?.find((i: any) => i.isMain) ?? p.images?.[0];
                  return (
                    <tr key={p.id}>
                      <td>
                        {mainImage?.url ? (
                          <img src={mainImage.url} alt={p.name} className="img-preview" />
                        ) : (
                          <div className="img-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={18} style={{ color: 'var(--admin-text-muted)' }} />
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>{p.slug}</div>
                      </td>
                      <td>{p.category?.name ?? '—'}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(p.basePrice)}</td>
                      <td>{p.variants?.length ?? 0} variants</td>
                      <td>
                        <span className={`badge badge--${p.isActive !== false ? 'green' : 'gray'}`}>
                          {p.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                        {p.isFeatured && <span className="badge badge--yellow" style={{ marginLeft: 4 }}>Featured</span>}
                      </td>
                      <td>
                        <div className="action-row">
                          <Link to={`/products/${p.id}`} className="btn btn--ghost btn--icon btn--sm">
                            <Pencil size={14} />
                          </Link>
                          <button className="btn btn--danger btn--icon btn--sm" onClick={() => handleDelete(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
