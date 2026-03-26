import { useEffect, useState, useCallback } from 'react';
import { Warehouse, Search, AlertTriangle, Save, Package, RefreshCw, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';
import type { InventoryItem, InventoryTransactionRecord, PaginatedTransactions } from '@/types/admin';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

function stockBadge(qty: number) {
  if (qty === 0) return <span className="badge badge--red">Out of Stock</span>;
  if (qty <= 10) return <span className="badge badge--yellow">Low Stock</span>;
  return <span className="badge badge--green">In Stock</span>;
}

function typeBadge(type: string) {
  if (type === 'GoodReceipt') return <span className="badge badge--green">Receipt</span>;
  if (type === 'GoodIssue') return <span className="badge badge--red">Issue</span>;
  return <span className="badge badge--blue">Adjustment</span>;
}

type Tab = 'stock' | 'history';

export default function InventoryPage() {
  const [tab, setTab] = useState<Tab>('stock');

  // ─── Stock Tab State ────────────────────────────────────────────────────────
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [changes, setChanges] = useState<Record<string, number>>({});

  // ─── History Tab State ──────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<InventoryTransactionRecord[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txPage, setTxPage] = useState(1);
  const [txTotal, setTxTotal] = useState(0);
  const [txTypeFilter, setTxTypeFilter] = useState('');
  const txPageSize = 20;

  const loadStock = useCallback(() => {
    setLoading(true);
    AdminService.getInventory({
      search: search || undefined,
      lowStockThreshold: lowStockOnly ? 10 : undefined,
    })
      .then(setItems)
      .finally(() => setLoading(false));
  }, [search, lowStockOnly]);

  const loadHistory = useCallback(() => {
    setTxLoading(true);
    AdminService.getTransactions({
      type: txTypeFilter || undefined,
      page: txPage,
      pageSize: txPageSize,
    })
      .then((result: PaginatedTransactions | undefined) => {
        if (result) {
          setTransactions(result.data);
          setTxTotal(result.total);
        }
      })
      .finally(() => setTxLoading(false));
  }, [txTypeFilter, txPage]);

  useEffect(() => { loadStock(); }, [loadStock]);
  useEffect(() => { if (tab === 'history') loadHistory(); }, [tab, loadHistory]);

  const handleQtyChange = (variantId: string, value: string) => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 0) return;
    setChanges(prev => ({ ...prev, [variantId]: qty }));
  };

  const handleSave = async () => {
    const entries = Object.entries(changes);
    if (entries.length === 0) return;
    setSaving(true);
    try {
      await AdminService.bulkUpdateStock({
        items: entries.map(([variantId, quantity]) => ({ variantId, quantity })),
      });
      setChanges({});
      loadStock();
    } catch (err) {
      console.error('Failed to update stock:', err);
      alert('Failed to update stock. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const changedCount = Object.keys(changes).length;
  const totalItems = items.length;
  const outOfStock = items.filter(i => i.stockQuantity === 0).length;
  const lowStock = items.filter(i => { const qty = i.stockQuantity; return qty > 0 && qty <= 10; }).length;
  const totalUnits = items.reduce((sum, i) => sum + i.stockQuantity, 0);
  const txTotalPages = Math.ceil(txTotal / txPageSize);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inventory</h1>
          <p className="admin-page-sub">Manage stock levels for all product variants</p>
        </div>
        <div className="action-row">
          {tab === 'stock' && (
            <>
              <button className="btn btn--ghost" onClick={loadStock} disabled={loading}>
                <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
              </button>
              {changedCount > 0 && (
                <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                  <Save size={16} /> Save {changedCount} Change{changedCount > 1 ? 's' : ''}
                </button>
              )}
            </>
          )}
          {tab === 'history' && (
            <button className="btn btn--ghost" onClick={loadHistory} disabled={txLoading}>
              <RefreshCw size={16} className={txLoading ? 'spin' : ''} /> Refresh
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '2px solid var(--admin-border)' }}>
        <button
          onClick={() => setTab('stock')}
          style={{
            padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: tab === 'stock' ? 700 : 400,
            borderBottom: tab === 'stock' ? '2px solid var(--admin-accent)' : '2px solid transparent',
            color: tab === 'stock' ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
            fontSize: 14, marginBottom: -2,
          }}
        >
          <Package size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Stock Levels
        </button>
        <button
          onClick={() => setTab('history')}
          style={{
            padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: tab === 'history' ? 700 : 400,
            borderBottom: tab === 'history' ? '2px solid var(--admin-accent)' : '2px solid transparent',
            color: tab === 'history' ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
            fontSize: 14, marginBottom: -2,
          }}
        >
          <History size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Transaction History
        </button>
      </div>

      {/* ─── Stock Tab ───────────────────────────────────────────────────────── */}
      {tab === 'stock' && (
        <>
          {/* Stats */}
          <div className="admin-stats-grid">
            <div className="stat-card" style={{ '--stat-color': 'var(--admin-accent)' } as any}>
              <div className="stat-card__icon"><Package size={20} /></div>
              <div className="stat-card__body">
                <div className="stat-card__title">Total Variants</div>
                <div className="stat-card__value">{totalItems}</div>
              </div>
            </div>
            <div className="stat-card" style={{ '--stat-color': 'var(--admin-success)' } as any}>
              <div className="stat-card__icon"><Warehouse size={20} /></div>
              <div className="stat-card__body">
                <div className="stat-card__title">Total Units</div>
                <div className="stat-card__value">{totalUnits.toLocaleString()}</div>
              </div>
            </div>
            <div className="stat-card" style={{ '--stat-color': 'var(--admin-warning)' } as any}>
              <div className="stat-card__icon"><AlertTriangle size={20} /></div>
              <div className="stat-card__body">
                <div className="stat-card__title">Low Stock</div>
                <div className="stat-card__value">{lowStock}</div>
              </div>
            </div>
            <div className="stat-card" style={{ '--stat-color': 'var(--admin-danger)' } as any}>
              <div className="stat-card__icon"><AlertTriangle size={20} /></div>
              <div className="stat-card__body">
                <div className="stat-card__title">Out of Stock</div>
                <div className="stat-card__value">{outOfStock}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="admin-search">
              <Search size={16} className="admin-search__icon" />
              <input
                className="form-control"
                style={{ paddingLeft: 36, width: 280 }}
                placeholder="Search by name, SKU, color, size…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <label className="form-check">
              <input type="checkbox" checked={lowStockOnly} onChange={e => setLowStockOnly(e.target.checked)} />
              Low stock only (≤ 10)
            </label>
          </div>

          {/* Table */}
          <div className="admin-card">
            {loading ? (
              <div className="admin-loading-center"><div className="admin-spinner" /></div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr><td colSpan={8}>
                        <div className="admin-empty">
                          <Warehouse size={40} />
                          <p className="admin-empty__title">No inventory items found</p>
                        </div>
                      </td></tr>
                    )}
                    {items.map(item => {
                      const currentQty = changes[item.variantId] ?? item.stockQuantity;
                      const isChanged = item.variantId in changes;
                      return (
                        <tr key={item.variantId} style={item.stockQuantity === 0 ? { background: 'rgba(239, 68, 68, 0.04)' } : undefined}>
                          <td>
                            {item.productImage ? (
                              <img src={item.productImage} alt={item.productName} className="img-preview" />
                            ) : (
                              <div className="img-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={18} style={{ color: 'var(--admin-text-muted)' }} />
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{item.productName}</div>
                            {!item.isActive && <span className="badge badge--gray" style={{ marginTop: 2 }}>Inactive</span>}
                          </td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--admin-text-muted)' }}>{item.sku}</span>
                          </td>
                          <td>{item.color || '—'}</td>
                          <td>{item.size || '—'}</td>
                          <td style={{ fontWeight: 700 }}>{formatCurrency(item.price)}</td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              className="form-control"
                              style={{
                                width: 90, padding: '6px 10px', fontSize: 14, fontWeight: 700, textAlign: 'center',
                                borderColor: isChanged ? 'var(--admin-accent)' : undefined,
                                boxShadow: isChanged ? '0 0 0 2px var(--admin-accent-glow)' : undefined,
                              }}
                              value={currentQty}
                              onChange={e => handleQtyChange(item.variantId, e.target.value)}
                            />
                          </td>
                          <td>{stockBadge(currentQty)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── History Tab ─────────────────────────────────────────────────────── */}
      {tab === 'history' && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
            <select className="form-control" style={{ width: 200 }} value={txTypeFilter} onChange={e => { setTxTypeFilter(e.target.value); setTxPage(1); }}>
              <option value="">All Types</option>
              <option value="GoodReceipt">Good Receipt</option>
              <option value="GoodIssue">Good Issue</option>
              <option value="Adjustment">Adjustment</option>
            </select>
            <span style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>{txTotal} total transaction{txTotal !== 1 ? 's' : ''}</span>
          </div>

          <div className="admin-card">
            {txLoading ? (
              <div className="admin-loading-center"><div className="admin-spinner" /></div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>Reason</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 && (
                      <tr><td colSpan={7}>
                        <div className="admin-empty">
                          <History size={40} />
                          <p className="admin-empty__title">No transactions found</p>
                        </div>
                      </td></tr>
                    )}
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td style={{ fontSize: 12, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(tx.createdAt).toLocaleString('vi-VN')}
                        </td>
                        <td style={{ fontWeight: 600 }}>{tx.productName}</td>
                        <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{tx.sku}</span></td>
                        <td>{typeBadge(tx.transactionType)}</td>
                        <td style={{
                          fontWeight: 700,
                          color: tx.quantityChanged > 0 ? 'var(--admin-success)' : 'var(--admin-danger)',
                        }}>
                          {tx.quantityChanged > 0 ? '+' : ''}{tx.quantityChanged}
                        </td>
                        <td>{tx.reasonName || '—'}</td>
                        <td style={{ color: 'var(--admin-text-muted)', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tx.note || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {txTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                <button className="btn btn--ghost btn--sm" disabled={txPage <= 1} onClick={() => setTxPage(p => p - 1)}>
                  <ChevronLeft size={14} /> Prev
                </button>
                <span style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>Page {txPage} of {txTotalPages}</span>
                <button className="btn btn--ghost btn--sm" disabled={txPage >= txTotalPages} onClick={() => setTxPage(p => p + 1)}>
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
