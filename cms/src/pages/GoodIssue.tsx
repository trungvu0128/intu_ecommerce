import { useEffect, useState, useCallback } from 'react';
import { PackageMinus, Search, Plus, Trash2, Send } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';
import type { InventoryItem, InventoryReason } from '@/types/admin';

interface LineItem {
  variantId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  currentStock: number;
  quantity: number;
}

export default function GoodIssuePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [reasons, setReasons] = useState<InventoryReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const [lines, setLines] = useState<LineItem[]>([]);
  const [reasonId, setReasonId] = useState<string>('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inv, rsn] = await Promise.all([
        AdminService.getInventory({ search: search || undefined }),
        AdminService.getInventoryReasons(true),
      ]);
      setInventory(inv);
      setReasons(rsn.filter(r => r.type === 'Issue' || r.type === 'Both'));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const addLine = (item: InventoryItem) => {
    if (lines.some(l => l.variantId === item.variantId)) return;
    setLines(prev => [...prev, {
      variantId: item.variantId,
      productName: item.productName,
      sku: item.sku,
      color: item.color,
      size: item.size,
      currentStock: item.stockQuantity,
      quantity: 1,
    }]);
  };

  const removeLine = (variantId: string) => {
    setLines(prev => prev.filter(l => l.variantId !== variantId));
  };

  const updateQty = (variantId: string, qty: number) => {
    if (qty < 1) return;
    const line = lines.find(l => l.variantId === variantId);
    if (line && qty > line.currentStock) {
      qty = line.currentStock; // Cap at available stock
    }
    setLines(prev => prev.map(l => l.variantId === variantId ? { ...l, quantity: qty } : l));
  };

  const handleSubmit = async () => {
    if (lines.length === 0) return;
    setSubmitting(true);
    setSuccess(false);
    setError(null);
    try {
      await AdminService.createGoodIssue({
        items: lines.map(l => ({ variantId: l.variantId, quantity: l.quantity })),
        reasonId: reasonId || undefined,
        note: note || undefined,
      });
      setLines([]);
      setNote('');
      setReasonId('');
      setSuccess(true);
      load();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? 'Failed to create good issue');
    } finally {
      setSubmitting(false);
    }
  };

  const available = inventory.filter(i => !lines.some(l => l.variantId === i.variantId) && i.stockQuantity > 0);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Good Issue</h1>
          <p className="admin-page-sub">Issue stock out of inventory — decreases stock quantities</p>
        </div>
      </div>

      {success && (
        <div className="admin-alert admin-alert--success" style={{ marginBottom: 20 }}>
          ✅ Good issue created successfully! Stock quantities have been updated.
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert--error" style={{ marginBottom: 20 }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Pick variants */}
        <div className="admin-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>Select Product Variants</h3>
          <div className="admin-search" style={{ marginBottom: 12 }}>
            <Search size={16} className="admin-search__icon" />
            <input
              className="form-control"
              style={{ paddingLeft: 36, width: '100%' }}
              placeholder="Search by name, SKU…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="admin-loading-center"><div className="admin-spinner" /></div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {available.length === 0 && <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: 20 }}>No variants with stock available</p>}
              {available.map(item => (
                <div key={item.variantId} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderBottom: '1px solid var(--admin-border)',
                  fontSize: 13,
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ color: 'var(--admin-text-muted)' }}>
                      SKU: {item.sku} · {item.color} · {item.size} · Stock: {item.stockQuantity}
                    </div>
                  </div>
                  <button className="btn btn--ghost btn--sm" onClick={() => addLine(item)}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Issue form */}
        <div className="admin-card" style={{ padding: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>
            <PackageMinus size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Issue Items ({lines.length})
          </h3>

          {lines.length === 0 ? (
            <div className="admin-empty" style={{ padding: '40px 0' }}>
              <PackageMinus size={36} />
              <p className="admin-empty__title">No items added</p>
              <p>Select variants from the left panel</p>
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              {lines.map(line => {
                const overStock = line.quantity > line.currentStock;
                return (
                  <div key={line.variantId} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 12px', borderBottom: '1px solid var(--admin-border)',
                    fontSize: 13,
                    background: overStock ? 'rgba(239,68,68,0.05)' : undefined,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{line.productName}</div>
                      <div style={{ color: 'var(--admin-text-muted)' }}>
                        {line.sku} · {line.color} · {line.size} · Available: {line.currentStock}
                      </div>
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={line.currentStock}
                      className="form-control"
                      style={{
                        width: 80, padding: '4px 8px', textAlign: 'center', fontWeight: 700,
                        borderColor: overStock ? 'var(--admin-danger)' : undefined,
                      }}
                      value={line.quantity}
                      onChange={e => updateQty(line.variantId, parseInt(e.target.value) || 1)}
                    />
                    <button className="btn btn--ghost btn--sm" style={{ color: 'var(--admin-danger)' }} onClick={() => removeLine(line.variantId)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Reason</label>
            <select className="form-control" value={reasonId} onChange={e => setReasonId(e.target.value)}>
              <option value="">— Select reason —</option>
              {reasons.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Note</label>
            <textarea className="form-control" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note…" />
          </div>

          <button className="btn btn--primary" style={{ width: '100%', marginTop: 12 }} disabled={lines.length === 0 || submitting} onClick={handleSubmit}>
            <Send size={16} /> {submitting ? 'Submitting…' : 'Create Good Issue'}
          </button>
        </div>
      </div>
    </div>
  );
}
