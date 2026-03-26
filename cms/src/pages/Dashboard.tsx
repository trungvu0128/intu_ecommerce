import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { AdminService } from '@/lib/adminApi';
import type { AdminDashboard, RecentOrder } from '@/types/admin';

const statusColors: Record<string, string> = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipped: 'purple',
  Delivered: 'green',
  Cancelled: 'red',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

export default function DashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminService.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-center">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Welcome back — here&apos;s what&apos;s happening</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Products"
          value={data?.totalProducts ?? 0}
          icon={<Package size={22} />}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={data?.totalOrders ?? 0}
          icon={<ShoppingCart size={22} />}
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data?.totalRevenue ?? 0)}
          icon={<DollarSign size={22} />}
          color="green"
        />
        <StatCard
          title="Total Users"
          value={data?.totalUsers ?? 0}
          icon={<Users size={22} />}
          color="orange"
        />
        <StatCard
          title="Orders Today"
          value={data?.ordersToday ?? 0}
          icon={<Clock size={22} />}
          color="blue"
          subtitle="today"
        />
        <StatCard
          title="Revenue Today"
          value={formatCurrency(data?.revenueToday ?? 0)}
          icon={<TrendingUp size={22} />}
          color="green"
          subtitle="today"
        />
        <StatCard
          title="Pending Orders"
          value={data?.pendingOrders ?? 0}
          icon={<Clock size={22} />}
          color="red"
          subtitle="awaiting action"
        />
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Recent Orders</h2>
        </div>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.length ? (
                data.recentOrders.map((o: RecentOrder) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: '#818cf8' }}>
                      {o.orderNumber}
                    </td>
                    <td>{o.customerName ?? 'Guest'}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(o.totalAmount)}</td>
                    <td>
                      <span className={`badge badge--${statusColors[o.status] ?? 'gray'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="admin-empty">
                    <p>No orders yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
