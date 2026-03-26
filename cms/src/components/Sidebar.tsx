import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tags, 
  Image as ImageIcon, 
  FileText, 
  Ticket,
  LogOut,
  Archive,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Globe,
  Shield
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
  { nameKey: 'dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { nameKey: 'products', path: '/products', icon: <Package size={20} /> },
  { nameKey: 'inventory', path: '/inventory', icon: <Archive size={20} /> },
  { nameKey: 'goodReceipt', path: '/inventory/good-receipt', icon: <ArrowDownToLine size={20} /> },
  { nameKey: 'goodIssue', path: '/inventory/good-issue', icon: <ArrowUpFromLine size={20} /> },
  { nameKey: 'invReasons', path: '/inventory/reasons', icon: <Layers size={20} /> },
  { nameKey: 'orders', path: '/orders', icon: <ShoppingCart size={20} /> },
  { nameKey: 'categories', path: '/categories', icon: <Tags size={20} /> },
  { nameKey: 'banners', path: '/banners', icon: <ImageIcon size={20} /> },
  { nameKey: 'featuredSections', path: '/featured-sections', icon: <Layers size={20} /> },
  { nameKey: 'blogs', path: '/blogs', icon: <FileText size={20} /> },
  { nameKey: 'coupons', path: '/coupons', icon: <Ticket size={20} /> },
  { nameKey: 'customers', path: '/customers', icon: <Users size={20} /> },
  { nameKey: 'users', path: '/users', icon: <Shield size={20} /> },
];

export default function AdminSidebar() {
  const { logout } = useAuthStore();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLng = i18n.language.startsWith('en') ? 'vi' : 'en';
    i18n.changeLanguage(newLng);
    localStorage.setItem('lng', newLng);
  };

  return (
    <aside className="admin-sidebar" style={{
      width: '260px',
      backgroundColor: '#1a1f2c',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div className="admin-sidebar__brand" style={{
        padding: '24px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {t('sidebar.brand')}
      </div>

      <nav className="admin-nav" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `admin-nav__link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? '#fff' : '#a0aec0',
              backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'all 0.2s',
              fontWeight: isActive ? 600 : 500,
            })}
          >
            {item.icon}
            {t(`sidebar.${item.nameKey}`)}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer" style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button 
          onClick={toggleLanguage}
          className="admin-logout-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#a0aec0',
            cursor: 'pointer',
            borderRadius: '8px',
            fontWeight: 500,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Globe size={20} />
          {i18n.language.startsWith('en') ? 'Tiếng Việt' : 'English'}
        </button>

        <button 
          onClick={() => logout()}
          className="admin-logout-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#fc8181',
            cursor: 'pointer',
            borderRadius: '8px',
            fontWeight: 500,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(252, 129, 129, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} />
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}