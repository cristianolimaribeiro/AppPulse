import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  Users, 
  LogOut,
  Menu,
  X,
  HeartPulse
} from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/applications', label: 'Aplicações', icon: Activity },
    { path: '/incidents', label: 'Incidentes', icon: AlertTriangle },
  ];

  if (isAdmin) {
    navItems.push({ path: '/users', label: 'Usuários', icon: Users });
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <button 
            className="mobile-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="logo" role="banner">
            <HeartPulse className="logo-icon" size={24} aria-hidden="true" />
            <span>AppPulse</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role badge badge-unknown">{user?.role}</span>
          </div>
          <button 
            className="btn-logout" 
            onClick={handleLogout} 
            title="Sair"
            aria-label="Sair do sistema"
          >
            <LogOut size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="main-wrapper">
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} role="navigation" aria-label="Menu principal">
          <nav className="nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;