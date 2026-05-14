import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faXmark, faChevronDown, faGauge,
  faClipboardList, faRightFromBracket, faAngleRight, faUserGear
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { menuLinks } from '../assets/assets';
import Logo from './Logo';

export default function Navbar() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOverDark,   setIsOverDark]   = useState(true);
  const navRef      = useRef(null);
  const dropdownRef = useRef(null);
  const { user, isLoggedIn, isOwner, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  /* ── Luminance-based chameleon ── */
  const detectBackground = useCallback(() => {
    const NAVBAR_H = 74;
    const cx = window.innerWidth / 2;
    const pts = [[cx * 0.4, NAVBAR_H + 8], [cx, NAVBAR_H + 8], [cx * 1.6, NAVBAR_H + 8]];
    for (const [x, y] of pts) {
      for (const el of document.elementsFromPoint(x, y)) {
        if (navRef.current?.contains(el)) continue;
        const bg = window.getComputedStyle(el).backgroundColor;
        const m  = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
        if (!m) continue;
        const [, r, g, b, a = '1'] = m;
        if (parseFloat(a) < 0.05) continue;
        const lum = (0.299 * +r + 0.587 * +g + 0.114 * +b) / 255;
        setIsOverDark(lum < 0.45);
        return;
      }
    }
    setIsOverDark(true);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', detectBackground, { passive: true });
    window.addEventListener('resize', detectBackground, { passive: true });
    const t = setTimeout(detectBackground, 80);
    return () => { window.removeEventListener('scroll', detectBackground); window.removeEventListener('resize', detectBackground); clearTimeout(t); };
  }, [detectBackground]);

  useEffect(() => {
    const t = setTimeout(detectBackground, 80);
    setMenuOpen(false); setDropdownOpen(false);
    return () => clearTimeout(t);
  }, [location.pathname, detectBackground]);

  useEffect(() => {
    const fn = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = () => {
    logout();           // AuthContext already fires the toast
    setDropdownOpen(false);
    navigate('/');
  };

  /* ── Style tokens ── */
  const navBg     = isOverDark ? 'rgba(10,22,40,0.55)'      : 'rgba(255,255,255,0.97)';
  const navBorder = isOverDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)';
  const navShadow = isOverDark ? '0 2px 20px rgba(0,0,0,0.25)'     : '0 2px 20px rgba(0,0,0,0.08)';
  const linkBase   = isOverDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50';
  const linkActive = isOverDark ? 'bg-white/15 text-white' : 'bg-primary-50 text-primary-700 font-bold';
  const iconColor  = isOverDark ? 'text-white' : 'text-gray-700';
  const loginBtn   = isOverDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50';
  const userBorder = isOverDark ? 'border-white/20 hover:border-white/40 hover:bg-white/10' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50';
  const nameClr    = isOverDark ? 'text-white' : 'text-gray-800';
  const chevClr    = isOverDark ? 'text-white/50' : 'text-gray-400';

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50"
        style={{ background: navBg, borderBottom: navBorder, boxShadow: navShadow,
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          transition: 'background 0.35s ease, box-shadow 0.35s ease' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">

            {/* Logo */}
            <Link to="/" aria-label="DriveEase Home" className="flex-shrink-0">
              <Logo size="md" variant={isOverDark ? 'light' : 'dark'} />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {menuLinks.map((link) => (
                <NavLink key={link.path} to={link.path} end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive ? linkActive : linkBase}`}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Auth area */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200 ${userBorder}`}>
                    {user?.avatar
                      ? <img src={user.avatar} alt={user?.name} className="w-7 h-7 rounded-lg object-cover"/>
                      : <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{user?.name?.[0]}</span>
                        </div>}
                    <span className={`text-sm font-semibold ${nameClr}`}>{user?.name?.split(' ')[0]}</span>
                    <FontAwesomeIcon icon={faChevronDown}
                      className={`text-xs transition-all duration-200 ${chevClr} ${dropdownOpen ? 'rotate-180' : ''}`}/>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fade-in z-50">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <div className="flex items-center gap-2.5">
                          {user?.avatar
                            ? <img src={user.avatar} alt="" className="w-9 h-9 rounded-xl object-cover"/>
                            : <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                                <span className="text-white font-bold">{user?.name?.[0]}</span>
                              </div>}
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      {isOwner ? (
                        <Link to="/owner" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors mx-1 rounded-xl">
                          <FontAwesomeIcon icon={faGauge} className="w-4 text-gray-400"/>Dashboard
                        </Link>
                      ) : (<>
                        <Link to="/my-bookings" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors mx-1 rounded-xl">
                          <FontAwesomeIcon icon={faClipboardList} className="w-4 text-gray-400"/>My Bookings
                        </Link>
                        <Link to="/manage-account" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors mx-1 rounded-xl">
                          <FontAwesomeIcon icon={faUserGear} className="w-4 text-gray-400"/>Manage Account
                        </Link>
                      </>)}
                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mx-1 rounded-xl">
                          <FontAwesomeIcon icon={faRightFromBracket} className="w-4"/>Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${loginBtn}`}>Log In</Link>
                  <Link to="/register" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background:'linear-gradient(135deg,#2563eb,#4f46e5)' }}>
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/10 transition-colors ${iconColor}`}
              onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="text-lg"/>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMenuOpen(false)}/>}

      {/* Mobile drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-72 z-50 lg:hidden shadow-2xl transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background:'linear-gradient(160deg,#0a1628 0%,#0f2046 100%)' }}>
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Logo size="md" variant="light" />
          </Link>
          <button onClick={() => setMenuOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faXmark}/>
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {menuLinks.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              onClick={() => setMenuOpen(false)}>
              {({ isActive }) => (<><span>{link.label}</span>{isActive && <FontAwesomeIcon icon={faAngleRight} className="text-white/40 text-xs"/>}</>)}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/8" style={{background:'rgba(0,0,0,0.2)'}}>
          {isLoggedIn ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
                {user?.avatar
                  ? <img src={user.avatar} alt="" className="w-9 h-9 rounded-xl object-cover"/>
                  : <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                      <span className="text-white font-bold">{user?.name?.[0]}</span>
                    </div>}
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{user?.name}</p>
                  <p className="text-xs text-white/40 truncate">{user?.role}</p>
                </div>
              </div>
              {isOwner ? (
                <Link to="/owner" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faGauge} className="text-white/40 w-4"/>Owner Dashboard
                </Link>
              ) : (<>
                <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faClipboardList} className="text-white/40 w-4"/>My Bookings
                </Link>
                <Link to="/manage-account" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <FontAwesomeIcon icon={faUserGear} className="text-white/40 w-4"/>Manage Account
                </Link>
              </>)}
              <button onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                <FontAwesomeIcon icon={faRightFromBracket} className="w-4"/>Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-colors">
                Log In
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white"
                style={{background:'linear-gradient(135deg,#2563eb,#4f46e5)'}}>
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
