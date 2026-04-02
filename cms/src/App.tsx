import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdminLayout from '@/layouts/AdminLayout';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import ProductsPage from '@/pages/Products';
import ProductEditor from '@/pages/ProductEditor';
import OrdersPage from '@/pages/Orders';
import CategoriesPage from '@/pages/Categories';
import BannersPage from '@/pages/Banners';
import BlogsPage from '@/pages/Blogs';
import BlogEditor from '@/pages/BlogEditor';
import CouponsPage from '@/pages/Coupons';
import UsersPage from '@/pages/Users';
import CustomersPage from '@/pages/Customers';
import FeaturedSectionsPage from '@/pages/FeaturedSections';
import InventoryPage from '@/pages/Inventory';
import InventoryReasonsPage from '@/pages/InventoryReasons';
import GoodReceiptPage from '@/pages/GoodReceipt';
import GoodIssuePage from '@/pages/GoodIssue';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected admin routes */}
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="products/:id" element={<ProductEditor />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/reasons" element={<InventoryReasonsPage />} />
            <Route path="inventory/good-receipt" element={<GoodReceiptPage />} />
            <Route path="inventory/good-issue" element={<GoodIssuePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="banners" element={<BannersPage />} />
            <Route path="featured-sections" element={<FeaturedSectionsPage />} />
            <Route path="blogs" element={<BlogsPage />} />
            <Route path="blogs/new" element={<BlogEditor />} />
            <Route path="blogs/:id" element={<BlogEditor />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
