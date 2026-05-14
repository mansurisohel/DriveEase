import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faLock, faPencil,
  faCheck, faXmark, faArrowLeft, faShieldHalved,
  faCircleCheck, faSpinner, faRightFromBracket, faCamera,
  faClipboardList, faCar, faChevronRight, faEye, faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/* ── Official Google G ── */
function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink:0}}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Official Facebook F ── */
function FacebookIcon({ size = 18, white = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink:0}}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill={white ? 'white' : '#1877F2'}/>
    </svg>
  );
}

export default function ManageAccount() {
  const { user, updateUserProfile, changeUserPassword, linkSocialAccount, unlinkSocialAccount, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [editMode, setEditMode]           = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [editErrors, setEditErrors]       = useState({});
  const [form, setForm] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  /* ── Password change state ── */
  const [pwdModal,  setPwdModal]  = useState(false);
  const [curPwd,    setCurPwd]    = useState('');
  const [newPwd,    setNewPwd]    = useState('');
  const [conPwd,    setConPwd]    = useState('');
  const [showCur,   setShowCur]   = useState(false);
  const [showNew,   setShowNew]   = useState(false);
  const [showCon,   setShowCon]   = useState(false);
  const [pwdErrors, setPwdErrors] = useState({});

  const handlePasswordChange = () => {
    const e = {};
    if (!curPwd) e.cur = 'Current password is required.';
    if (newPwd.length < 6) e.new = 'New password must be at least 6 characters.';
    if (newPwd !== conPwd) e.con = 'Passwords do not match.';
    if (Object.keys(e).length) { setPwdErrors(e); return; }
    const ok = changeUserPassword(curPwd, newPwd);
    if (ok) {
      setPwdModal(false);
      setCurPwd(''); setNewPwd(''); setConPwd('');
      setPwdErrors({});
    }
  };

  /* ── Profile image upload ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateUserProfile({ avatar: ev.target.result });
      toast.success('Profile photo updated!');
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected if needed
    e.target.value = '';
  };

  const linkedAccounts   = user?.linkedAccounts || [];
  const isGoogleLinked   = linkedAccounts.includes('google');
  const isFacebookLinked = linkedAccounts.includes('facebook');

  const saveProfile = () => {
    const errs = {};
    if (!form.name.trim())  errs.name = 'Full name is required.';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (form.phone && !/^\+?[\d\s\-(). ]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.';
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;
    updateUserProfile({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
    toast.success('Profile updated successfully!');
    setEditMode(false);
    setEditErrors({});
  };

  const handleSocialToggle = async (provider) => {
    const linked = provider === 'google' ? isGoogleLinked : isFacebookLinked;
    setSocialLoading(provider);
    await new Promise(r => setTimeout(r, 800));
    if (linked) unlinkSocialAccount(provider);
    else        linkSocialAccount(provider);
    setSocialLoading(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="card p-10 text-center max-w-sm w-full">
          <FontAwesomeIcon icon={faShieldHalved} className="text-gray-300 text-4xl mb-4" />
          <h2 className="font-display font-bold text-xl text-gray-900 mb-2">Not Signed In</h2>
          <p className="text-gray-400 text-sm mb-6">Please log in to manage your account.</p>
          <Link to="/login" className="btn-primary w-full">Go to Login</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'profile',    icon: faUser,          label: 'Personal Info' },
    { id: 'connected',  icon: faShieldHalved,  label: 'Connected Accounts' },
    { id: 'security',   icon: faLock,          label: 'Password & Security' },
    { id: 'bookings',   icon: faClipboardList, label: 'My Bookings', href: '/my-bookings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 page-enter">

      {/* ── Hero banner ── */}
      <div className="hero-bg pt-[72px] pb-0 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white/90
            text-sm font-medium mb-6 transition-colors group">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          {/* Profile header row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 pb-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0 self-start sm:self-auto">
              {user.avatar
                ? <img src={user.avatar} alt={user.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl" />
                : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-indigo-600
                    flex items-center justify-center ring-4 ring-white/20 shadow-xl">
                    <span className="text-white font-black text-2xl">{user.name?.[0]}</span>
                  </div>
              }
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Change profile photo"
                className="absolute -bottom-2 -right-2 w-7 h-7 bg-white hover:bg-primary-50 text-primary-600
                  rounded-full flex items-center justify-center shadow-lg border border-gray-100 transition-colors"
              >
                <FontAwesomeIcon icon={faCamera} className="text-[10px]" />
              </button>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Name + badges */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-black text-white text-2xl sm:text-3xl leading-tight truncate">{user.name}</h1>
              <p className="text-white/50 text-sm mt-0.5 truncate">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-400/15 border border-emerald-400/25 text-emerald-300 px-2.5 py-1 rounded-full">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" /> Verified Account
                </span>
                {user.socialProvider && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white/10 border border-white/15 text-white/70 px-2.5 py-1 rounded-full">
                    {user.socialProvider === 'google'
                      ? <GoogleIcon size={11} />
                      : <FacebookIcon size={11} white />
                    }
                    {user.socialProvider === 'google' ? 'Google' : 'Facebook'} Account
                  </span>
                )}
              </div>
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="self-start sm:self-auto flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-semibold text-white/60 hover:text-white border border-white/15 hover:border-white/30
                hover:bg-white/10 transition-all">
              <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
              Logout
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {navItems.filter(n => !n.href).map(n => (
              <button
                key={n.id}
                onClick={() => setActiveSection(n.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeSection === n.id
                    ? 'border-white text-white'
                    : 'border-transparent text-white/45 hover:text-white/70 hover:border-white/30'
                }`}
              >
                <FontAwesomeIcon icon={n.icon} className="text-xs" />
                <span className="text-xs sm:text-sm">{n.label}</span>
              </button>
            ))}
            <Link to="/my-bookings"
              className="flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-semibold whitespace-nowrap
                border-b-2 border-transparent text-white/45 hover:text-white/70 hover:border-white/30 transition-all">
              <FontAwesomeIcon icon={faClipboardList} className="text-xs" />
              <span className="text-xs sm:text-sm">My Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">

        {/* ══ PERSONAL INFO ══ */}
        {activeSection === 'profile' && (
          <div className="grid lg:grid-cols-[1fr_300px] gap-6 animate-fade-in">
            <div className="card p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-gray-900">Personal Information</h2>
                  <p className="text-gray-400 text-sm mt-0.5">Your name, email address, and contact number</p>
                </div>
                {!editMode && (
                  <button onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700
                      bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl transition-all border border-primary-100">
                    <FontAwesomeIcon icon={faPencil} className="text-xs" /> Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                        <input type="text" value={form.name}
                          onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setEditErrors(er => ({ ...er, name: '' })); }}
                          className={`form-input pl-11 ${editErrors.name ? 'form-input-error' : ''}`} placeholder="Your full name" />
                      </div>
                      {editErrors.name && <p className="form-error"><FontAwesomeIcon icon={faCircleCheck} className="text-xs" /> {editErrors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                        <input type="email" value={form.email}
                          onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setEditErrors(er => ({ ...er, email: '' })); }}
                          className={`form-input pl-11 ${editErrors.email ? 'form-input-error' : ''}`} placeholder="you@example.com" />
                      </div>
                      {editErrors.email && <p className="form-error"><FontAwesomeIcon icon={faCircleCheck} className="text-xs" /> {editErrors.email}</p>}
                    </div>
                    <div className="form-group sm:col-span-2">
                      <label className="form-label">Phone Number</label>
                      <div className="relative">
                        <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                        <input type="tel" value={form.phone}
                          onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setEditErrors(er => ({ ...er, phone: '' })); }}
                          className={`form-input pl-11 ${editErrors.phone ? 'form-input-error' : ''}`} placeholder="+91 98765 43210" />
                      </div>
                      {editErrors.phone && <p className="form-error"><FontAwesomeIcon icon={faCircleCheck} className="text-xs" /> {editErrors.phone}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={saveProfile} className="btn-primary px-6 py-2.5 text-sm">
                      <FontAwesomeIcon icon={faCheck} /> Save Changes
                    </button>
                    <button onClick={() => setEditMode(false)} className="btn-secondary px-6 py-2.5 text-sm">
                      <FontAwesomeIcon icon={faXmark} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {[
                    { icon: faUser,     label: 'Full Name',    value: user.name  || '—' },
                    { icon: faEnvelope, label: 'Email Address', value: user.email || '—' },
                    { icon: faPhone,    label: 'Phone Number', value: user.phone || 'Not added yet' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-4 py-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        <FontAwesomeIcon icon={row.icon} className="text-gray-400 text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{row.label}</p>
                        <p className="text-gray-900 font-semibold text-sm mt-0.5 truncate">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">

              {/* ── Profile Photo Upload Card ── */}
              <div className="card p-5">
                <h3 className="font-display font-bold text-gray-900 text-base mb-1">Profile Photo</h3>
                <p className="text-gray-400 text-xs mb-4">Upload a photo to personalise your account.</p>
                <div className="flex items-center gap-4 mb-4">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name}
                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-primary-100 flex-shrink-0" />
                    : <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-400 to-indigo-600
                        flex items-center justify-center flex-shrink-0 ring-2 ring-primary-100">
                        <span className="text-white font-black text-xl">{user.name?.[0]}</span>
                      </div>
                  }
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 mb-0.5 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400">JPG, PNG, GIF or WebP · Max 5 MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                    border-2 border-dashed border-primary-200 hover:border-primary-400
                    bg-primary-50/50 hover:bg-primary-50 text-primary-600 hover:text-primary-700
                    text-sm font-semibold transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faCamera} className="text-sm" />
                  {user.avatar ? 'Change Photo' : 'Upload Photo'}
                </button>
                {user.avatar && (
                  <button
                    type="button"
                    onClick={() => { updateUserProfile({ avatar: null }); toast.success('Profile photo removed.'); }}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-xl
                      border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400
                      hover:text-red-500 text-xs font-semibold transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                    Remove Photo
                  </button>
                )}
              </div>

              {/* Quick actions */}
              <div className="card p-5">
                <h3 className="font-display font-bold text-gray-900 text-base mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/my-bookings"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-gray-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FontAwesomeIcon icon={faClipboardList} className="text-blue-500 text-xs" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">My Bookings</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 text-xs group-hover:text-gray-500 transition-colors" />
                  </Link>
                  <Link to="/cars"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-gray-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCar} className="text-emerald-500 text-xs" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Browse Cars</span>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 text-xs group-hover:text-gray-500 transition-colors" />
                  </Link>
                </div>
              </div>

              {/* Account status */}
              <div className="card p-5">
                <h3 className="font-display font-bold text-gray-900 text-base mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Email verified</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" /> Yes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Account type</span>
                    <span className="text-sm font-semibold text-gray-900">Customer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Social login</span>
                    <span className="text-sm font-semibold text-gray-900">{linkedAccounts.length > 0 || user.socialProvider ? 'Linked' : 'None'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ CONNECTED ACCOUNTS ══ */}
        {activeSection === 'connected' && (
          <div className="max-w-2xl animate-fade-in">
            <div className="card p-7">
              <h2 className="font-display font-bold text-xl text-gray-900 mb-1">Connected Accounts</h2>
              <p className="text-gray-400 text-sm mb-7">Link your social accounts for one-click sign-in. DriveEase never posts on your behalf.</p>

              <div className="space-y-4">

                {/* Google row */}
                <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Google coloured container */}
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0">
                      <GoogleIcon size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Google</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {isGoogleLinked
                          ? <span className="flex items-center gap-1 text-emerald-600"><FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" /> Connected</span>
                          : 'Not connected'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSocialToggle('google')}
                    disabled={socialLoading === 'google'}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 ${
                      isGoogleLinked
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        : 'bg-white border border-gray-200 hover:border-[#4285F4] hover:bg-blue-50 hover:text-blue-600 text-gray-700'
                    }`}
                  >
                    {socialLoading === 'google'
                      ? <FontAwesomeIcon icon={faSpinner} spin />
                      : isGoogleLinked
                        ? <><FontAwesomeIcon icon={faXmark} /> Disconnect</>
                        : <><FontAwesomeIcon icon={faCheck} /> Connect</>
                    }
                  </button>
                </div>

                {/* Facebook row */}
                <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#1877F2' }}>
                      <FacebookIcon size={24} white />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Facebook</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {isFacebookLinked
                          ? <span className="flex items-center gap-1 text-emerald-600"><FontAwesomeIcon icon={faCircleCheck} className="text-[10px]" /> Connected</span>
                          : 'Not connected'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSocialToggle('facebook')}
                    disabled={socialLoading === 'facebook'}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 ${
                      isFacebookLinked
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        : 'bg-white border border-gray-200 hover:border-[#1877F2] hover:bg-blue-50 hover:text-blue-700 text-gray-700'
                    }`}
                  >
                    {socialLoading === 'facebook'
                      ? <FontAwesomeIcon icon={faSpinner} spin />
                      : isFacebookLinked
                        ? <><FontAwesomeIcon icon={faXmark} /> Disconnect</>
                        : <><FontAwesomeIcon icon={faCheck} /> Connect</>
                    }
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-6 leading-relaxed bg-slate-50 rounded-xl p-4 border border-gray-100">
                🔒 Connecting an account lets you sign in with one tap. We only access your basic profile info (name, email, photo). DriveEase never posts, shares, or sells your data.
              </p>
            </div>
          </div>
        )}

        {/* ══ SECURITY ══ */}
        {activeSection === 'security' && (
          <div className="max-w-2xl animate-fade-in">
            <div className="card p-7">
              <h2 className="font-display font-bold text-xl text-gray-900 mb-1">Password & Security</h2>
              <p className="text-gray-400 text-sm mb-7">Manage your password and account security settings</p>

              <div className="space-y-4">
                {/* Password */}
                <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Password</p>
                      <p className="text-xs text-gray-400 mt-0.5">Last changed: recently</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setPwdModal(true); setCurPwd(''); setNewPwd(''); setConPwd(''); setPwdErrors({}); }}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-gray-100
                      text-gray-700 hover:bg-gray-200 border border-gray-200 transition-all"
                  >
                    Change Password
                  </button>
                </div>

                {/* Two-factor */}
                <div className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faShieldHalved} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success('2FA setup coming soon!')}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl
                      bg-primary-600 text-white hover:bg-primary-700 transition-all"
                  >
                    Enable
                  </button>
                </div>

                {/* Danger zone */}
                <div className="mt-8 p-5 rounded-2xl border border-red-100 bg-red-50/40">
                  <h3 className="font-semibold text-red-700 mb-1 text-sm">Danger Zone</h3>
                  <p className="text-xs text-red-500 mb-4">These actions are irreversible. Please be certain.</p>
                  <button
                    onClick={() => toast.error('Account deletion — please contact support.')}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl
                      border border-red-200 text-red-600 hover:bg-red-100 transition-all"
                  >
                    <FontAwesomeIcon icon={faXmark} /> Delete My Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Password Change Modal ── */}
      {pwdModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faLock} className="text-primary-600 text-sm" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-gray-900">Change Password</h2>
                  <p className="text-xs text-gray-400">Update your account password</p>
                </div>
              </div>
              <button onClick={() => setPwdModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Current password */}
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="relative">
                  <input type={showCur ? 'text' : 'password'} value={curPwd}
                    onChange={e => { setCurPwd(e.target.value); setPwdErrors(p => ({ ...p, cur: '' })); }}
                    className={`form-input pr-10 ${pwdErrors.cur ? 'form-input-error' : ''}`}
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowCur(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={showCur ? faEyeSlash : faEye} className="text-sm" />
                  </button>
                </div>
                {pwdErrors.cur && <p className="form-error">{pwdErrors.cur}</p>}
              </div>
              {/* New password */}
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPwd}
                    onChange={e => { setNewPwd(e.target.value); setPwdErrors(p => ({ ...p, new: '' })); }}
                    className={`form-input pr-10 ${pwdErrors.new ? 'form-input-error' : ''}`}
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} className="text-sm" />
                  </button>
                </div>
                {pwdErrors.new && <p className="form-error">{pwdErrors.new}</p>}
              </div>
              {/* Confirm password */}
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="relative">
                  <input type={showCon ? 'text' : 'password'} value={conPwd}
                    onChange={e => { setConPwd(e.target.value); setPwdErrors(p => ({ ...p, con: '' })); }}
                    className={`form-input pr-10 ${pwdErrors.con ? 'form-input-error' : ''}`}
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowCon(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={showCon ? faEyeSlash : faEye} className="text-sm" />
                  </button>
                </div>
                {pwdErrors.con && <p className="form-error">{pwdErrors.con}</p>}
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setPwdModal(false)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={handlePasswordChange} className="flex-1 btn-primary">
                <FontAwesomeIcon icon={faCheck} /> Save Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
