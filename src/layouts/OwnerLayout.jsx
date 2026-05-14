import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faGauge, faCirclePlus, faCarSide, faCalendarCheck,
  faGlobe, faRightFromBracket, faBell, faMagnifyingGlass,
  faXmark, faUserShield, faChartLine, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useContact } from '../context/ContactContext';
import { ownerMenuLinks } from '../assets/assets';
import Logo from '../components/Logo';

const iconMap = {
  dashboard: faGauge,
  add:       faCirclePlus,
  cars:      faCarSide,
  bookings:  faCalendarCheck,
  admins:    faUserShield,
  analytics: faChartLine,
};

const itemAccent = {
  dashboard: 'owner-nav-active-violet',
  add:       'owner-nav-active-emerald',
  cars:      'owner-nav-active-blue',
  bookings:  'owner-nav-active-amber',
  admins:    'owner-nav-active-indigo',
  analytics: 'owner-nav-active-rose',
};

function useBreadcrumb() {
  const { pathname } = useLocation();
  const map = {
    '/owner':                 'Dashboard',
    '/owner/add-car':         'Add Car',
    '/owner/manage-cars':     'Manage Cars',
    '/owner/manage-bookings': 'Manage Bookings',
    '/owner/manage-admins':   'Manage Admins',
    '/owner/analytics':       'Analytics',
  };
  return map[pathname] ?? 'Owner Portal';
}

export default function OwnerLayout() {
  const { user, isOwner, logout } = useAuth();
  const { unreadCount } = useContact();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch]           = useState('');
  const navigate    = useNavigate();
  const pageTitle   = useBreadcrumb();

  if (!isOwner) return <Navigate to="/owner-login" replace />;

  const handleLogout = () => {
    logout();       // AuthContext already fires the success toast — no double toast
    navigate('/owner-login'); // redirect to owner login after logout
  };

  return (
    <div className="min-h-screen owner-layout-bg flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 flex flex-col
        w-[252px] owner-sidebar
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 owner-sidebar-border-b flex-shrink-0">
          <Link to="/" className="flex items-center flex-1 min-w-0">
            <Logo size="md" variant="light" />
          </Link>
          <button
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        </div>

        {/* Owner profile card */}
        <div className="px-4 py-3 owner-sidebar-border-b flex-shrink-0">
          <div className="owner-profile-card">
            <div className="relative flex-shrink-0">
              {user?.avatar
                ? <img src={user.avatar} alt={user?.name} className="w-10 h-10 rounded-xl object-cover" />
                : <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user?.name?.[0]}</span>
                  </div>
              }
              <span className="owner-online-dot" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
              <span className="owner-role-badge mt-1">
                <span className="owner-role-pip" />
                Fleet Owner
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="owner-nav-section-label">Management</p>

          {ownerMenuLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `owner-nav-item group ${isActive
                  ? `owner-nav-item-active ${itemAccent[link.icon] || 'owner-nav-active-blue'}`
                  : 'owner-nav-item-idle'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`owner-nav-icon ${isActive ? 'bg-white/20' : 'bg-white/8 group-hover:bg-white/15'}`}>
                    <FontAwesomeIcon
                      icon={iconMap[link.icon] || faGauge}
                      className={`text-sm ${isActive ? 'text-white' : 'text-white/55 group-hover:text-white'} transition-colors duration-200`}
                    />
                  </div>
                  <span className="flex-1 text-sm">{link.label}</span>
                  {isActive && <span className="owner-active-pip" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-5 pt-3 owner-sidebar-border-t space-y-0.5 flex-shrink-0">
          <a href="/" target="_blank" rel="noopener noreferrer" className="owner-nav-item owner-nav-item-idle group">
            <div className="owner-nav-icon bg-white/6 group-hover:bg-white/15">
              <FontAwesomeIcon icon={faGlobe} className="text-sm text-white/50 group-hover:text-white transition-colors duration-200" />
            </div>
            <span className="flex-1 text-sm">View Website</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-white/20 text-[10px] group-hover:text-white/40 transition-colors duration-200" />
          </a>

          <button onClick={handleLogout} className="owner-logout-btn group">
            <div className="owner-nav-icon bg-red-500/10 group-hover:bg-white/20">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-sm text-red-400 group-hover:text-white transition-colors duration-200" />
            </div>
            <span className="flex-1 text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="owner-topbar">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium select-none">Owner</span>
              <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 text-[10px]" />
              <span className="text-sm font-semibold text-gray-800">{pageTitle}</span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="owner-search-bar hidden md:flex">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-sm flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search anything…"
                className="bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none w-full min-w-0"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              )}
            </div>

            {/* Notification bell */}
            <button className="owner-topbar-btn relative">
              <FontAwesomeIcon icon={faBell} className="text-sm" />
              {unreadCount > 0
                ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
                : <span className="owner-notif-dot" />
              }
            </button>

            {/* User chip */}
            <div className="hidden sm:flex items-center gap-2.5 owner-user-chip">
              {user?.avatar
                ? <img src={user.avatar} alt={user?.name} className="w-8 h-8 rounded-xl object-cover flex-shrink-0" />
                : <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-700 font-bold text-xs">{user?.name?.[0]}</span>
                  </div>
              }
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-400">Fleet Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
