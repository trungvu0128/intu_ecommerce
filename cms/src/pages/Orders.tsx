import { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '@/components/Modal';
import { AdminService } from '@/lib/adminApi';
import type { Order } from '@/types';

// Must match backend OrderStatus enum exactly
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipping', 'Delivered', 'Cancelled'] as const;
type OrderStatusValue = (typeof ORDER_STATUSES)[number];

const statusColors: Record<string, string> = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipping: 'purple',
  Delivered: 'green',
  Cancelled: 'red',
};

const statusLabels: Record<string, string> = {
  Pending: 'Pending',
  Processing: 'Processing',
  Shipping: 'Shipping',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string | undefined>(undefined);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const load = (status?: string) => {
    setLoading(true);
    AdminService.getAdminOrders(status)
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(activeStatus); }, [activeStatus]);

  const handleStatusChange = async (id: string, newStatus: string, currentStatus: string) => {
    if (newStatus === currentStatus) return;

    setUpdatingId(id);
    try {
      await AdminService.updateOrderStatus(id, newStatus);
      load(activeStatus);
    } catch (e: any) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const openEditModal = (o: any) => {
    let addr: any = {};
    try {
      if (typeof o.shippingAddress === 'string') addr = JSON.parse(o.shippingAddress);
      else if (o.shippingAddress) addr = o.shippingAddress;
    } catch(e) {}
    
    setEditForm({
      status: o.status,
      paymentStatus: o.paymentStatus || 'Pending',
      recipientName: addr.RecipientName || addr.fullName || '',
      phoneNumber: addr.PhoneNumber || addr.phoneNumber || '',
      email: addr.Email || addr.email || '',
      street: addr.Street || addr.street || '',
      city: addr.City || addr.city || '',
      state: addr.State || addr.district || '',
      zipCode: addr.ZipCode || addr.ward || '',
    });
    setEditingOrder(o);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    setUpdatingId(editingOrder.id);
    try {
      const addressJson = JSON.stringify({
        RecipientName: editForm.recipientName,
        PhoneNumber: editForm.phoneNumber,
        Email: editForm.email,
        Street: editForm.street,
        City: editForm.city,
        State: editForm.state,
        ZipCode: editForm.zipCode,
        Country: "VN"
      });
      await AdminService.updateOrderInfo(editingOrder.id, {
        status: editForm.status,
        paymentStatus: editForm.paymentStatus,
        shippingAddress: addressJson
      });
      setEditingOrder(null);
      load(activeStatus);
    } catch (e: any) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this order? Stock will be restored.')) return;
    setUpdatingId(id);
    try {
      await AdminService.cancelOrder(id);
      load(activeStatus);
    } catch (e: any) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {/* Toast notification handled globally */}


      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-sub">Manage and track customer orders</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="admin-tabs" style={{ marginBottom: 20 }}>
        <button
          className={`admin-tab ${activeStatus === undefined ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveStatus(undefined)}
        >
          All
        </button>
        {ORDER_STATUSES.map(s => (
          <button
            key={s}
            className={`admin-tab ${activeStatus === s ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveStatus(s)}
          >
            {statusLabels[s]}
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
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={7}>
                    <div className="admin-empty">
                      <ShoppingCart size={40} />
                      <p className="admin-empty__title">No orders found</p>
                    </div>
                  </td></tr>
                )}
                {orders.map((o: any) => {
                  const isUpdating = updatingId === o.id;
                  const isCancelled = o.status === 'Cancelled';
                  const isDelivered = o.status === 'Delivered';

                  return (
                    <tr key={o.id} style={{ opacity: isUpdating ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#818cf8' }}>
                        {o.orderNumber}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>
                        {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>{o.items?.length ?? 0}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(o.totalAmount)}</td>
                      <td>
                        <span className={`badge badge--${statusColors[o.status] ?? 'gray'}`}>
                          {statusLabels[o.status] ?? o.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ width: 'auto', padding: '5px 10px', fontSize: 13 }}
                          value={o.status}
                          disabled={isUpdating || isCancelled}
                          onChange={e => handleStatusChange(o.id, e.target.value, o.status)}
                        >
                          {ORDER_STATUSES.map(s => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            className="btn btn--primary btn--sm"
                            style={{ fontSize: 12, padding: '4px 12px' }}
                            onClick={() => openEditModal(o)}
                          >
                            Edit
                          </button>
                          {!isCancelled && !isDelivered && (
                            <button
                              className="btn btn--danger btn--sm"
                              style={{ fontSize: 12, padding: '4px 12px' }}
                              disabled={isUpdating}
                              onClick={() => handleCancel(o.id)}
                            >
                              Cancel
                            </button>
                          )}
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

      <Modal
        title={`Update Order: ${editingOrder?.orderNumber}`}
        open={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        size="lg"
      >
        <div className="admin-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Order Status</label>
              <select 
                className="form-control" 
                value={editForm.status} 
                onChange={e => setEditForm({ ...editForm, status: e.target.value })}
              >
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Status</label>
              <select 
                className="form-control" 
                value={editForm.paymentStatus} 
                onChange={e => setEditForm({ ...editForm, paymentStatus: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px', marginTop: '10px', marginBottom: '15px' }}>
            Shipping Information
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Recipient Name</label>
              <input className="form-control" value={editForm.recipientName} onChange={e => setEditForm({ ...editForm, recipientName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" value={editForm.phoneNumber} onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input className="form-control" value={editForm.street} onChange={e => setEditForm({ ...editForm, street: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-control" value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">State/District</label>
              <input className="form-control" value={editForm.state} onChange={e => setEditForm({ ...editForm, state: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Zip/Ward</label>
              <input className="form-control" value={editForm.zipCode} onChange={e => setEditForm({ ...editForm, zipCode: e.target.value })} />
            </div>
          </div>

          <div style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px', marginTop: '10px', marginBottom: '15px' }}>
            Order Items
          </div>
          <div style={{ background: 'var(--admin-surface-2)', borderRadius: '8px', padding: '10px', border: '1px solid var(--admin-border)' }}>
            {editingOrder?.items?.length > 0 ? (
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--admin-text-muted)', borderBottom: '1px solid var(--admin-border)' }}>
                    <th style={{ paddingBottom: '8px', fontWeight: 600 }}>Product</th>
                    <th style={{ paddingBottom: '8px', fontWeight: 600 }}>Qty</th>
                    <th style={{ paddingBottom: '8px', fontWeight: 600, textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {editingOrder?.items?.map((item: any, i: number) => (
                    <tr key={item.id ?? i} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      <td style={{ padding: '8px 0' }}>
                        <div style={{ fontWeight: 500 }}>{item.productName}</div>
                        <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>SKU: {item.sku || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '8px 0' }}>{item.quantity} × {formatCurrency(item.price || 0)}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.total || 0)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} style={{ paddingTop: '10px', textAlign: 'right', fontWeight: 600 }}>Grand Total:</td>
                    <td style={{ paddingTop: '10px', textAlign: 'right', fontWeight: 700, color: 'var(--admin-accent)' }}>{formatCurrency(editingOrder?.totalAmount || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--admin-text-muted)' }}>No items found in this order.</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button className="btn btn--outline" onClick={() => setEditingOrder(null)}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSaveEdit} disabled={!!updatingId}>
              {updatingId === editingOrder?.id ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
