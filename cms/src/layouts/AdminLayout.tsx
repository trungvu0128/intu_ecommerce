import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/Sidebar';
import ToastContainer from '@/components/ToastContainer';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout() {
  const { user } = useAuthStore();

  if (!user || !user.roles?.includes('Admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <ToastContainer />
      <div className="admin-shell">
        <AdminSidebar />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
