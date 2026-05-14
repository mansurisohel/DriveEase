import { useState } from 'react';
import StatCounter from '../../components/StatCounter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield, faPlus, faXmark, faCheck, faPen, faTrash,
  faEnvelope, faUser, faShieldHalved, faBan, faCircleCheck,
  faKey, faEllipsisVertical, faUserPlus, faEye, faEyeSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ALL_PERMISSIONS = [
  { id: 'manage_bookings', label: 'Manage Bookings', color: 'bg-amber-100 text-amber-700' },
  { id: 'manage_cars',     label: 'Manage Cars',     color: 'bg-blue-100 text-blue-700'   },
  { id: 'view_reports',    label: 'View Reports',    color: 'bg-violet-100 text-violet-700'},
  { id: 'manage_users',    label: 'Manage Users',    color: 'bg-emerald-100 text-emerald-700'},
];

const EMPTY_FORM = { name: '', email: '', permissions: ['manage_bookings'], password: 'admin123' };

function PermTag({ id }) {
  const p = ALL_PERMISSIONS.find(x => x.id === id);
  return p ? <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${p.color}`}>{p.label}</span> : null;
}

/* ── Standalone password input row — defined OUTSIDE any component so React never remounts it ── */
function PwdRow({ label, value, show, onToggle, onChange, error, readOnly }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`form-input pr-10 ${error ? 'form-input-error' : ''} ${readOnly ? 'bg-gray-50 text-gray-500' : ''}`}
          placeholder="••••••••"
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <FontAwesomeIcon icon={show ? faEyeSlash : faEye} className="text-sm" />
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

/* ── Password change modal ── */
function PasswordModal({ admin, onClose }) {
  const { changeAdminPassword } = useAuth();
  const [current,    setCurrent]    = useState(admin.password);
  const [next,       setNext]       = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [showCur,    setShowCur]    = useState(false);
  const [showNxt,    setShowNxt]    = useState(false);
  const [showCon,    setShowCon]    = useState(false);
  const [ownerReset, setOwnerReset] = useState(false);
  const [errors,     setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!ownerReset && !current) e.current = 'Current password required.';
    if (next.length < 6) e.next = 'New password must be at least 6 characters.';
    if (next !== confirm) e.confirm = 'Passwords do not match.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const sentPassword = ownerReset ? '__owner_reset__' : current;
    const ok = changeAdminPassword(admin.id, sentPassword, next);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faLock} className="text-amber-600 text-sm" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900">Change Password</h2>
              <p className="text-xs text-gray-400">{admin.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Owner override toggle */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100 cursor-pointer select-none">
            <div>
              <p className="text-sm font-semibold text-amber-800">Owner Override Reset</p>
              <p className="text-xs text-amber-600 mt-0.5">Reset without knowing current password</p>
            </div>
            <div
              onClick={() => { setOwnerReset(v => !v); setErrors({}); }}
              className={`relative w-10 h-5 rounded-full transition-colors ${ownerReset ? 'bg-amber-500' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${ownerReset ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>

          {!ownerReset && (
            <PwdRow
              label="Current Password"
              value={current}
              show={showCur}
              onToggle={() => setShowCur(v => !v)}
              onChange={e => { setCurrent(e.target.value); setErrors(p => ({ ...p, current: '' })); }}
              error={errors.current}
            />
          )}
          <PwdRow
            label="New Password"
            value={next}
            show={showNxt}
            onToggle={() => setShowNxt(v => !v)}
            onChange={e => { setNext(e.target.value); setErrors(p => ({ ...p, next: '' })); }}
            error={errors.next}
          />
          <PwdRow
            label="Confirm New Password"
            value={confirm}
            show={showCon}
            onToggle={() => setShowCon(v => !v)}
            onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: '' })); }}
            error={errors.confirm}
          />
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSave} className="flex-1 btn-primary">
            <FontAwesomeIcon icon={faCheck} /> Save Password
          </button>
        </div>
      </div>
    </div>
  );
}


function AdminCard({ admin, onEdit, onToggle, onRemove, onChangePassword }) {
  const [menu, setMenu] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isSuspended = admin.status === 'suspended';

  return (
    <div className={`card p-5 hover:shadow-card-hover transition-all duration-300 ${isSuspended ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <img src={admin.avatar} alt={admin.name} className="w-12 h-12 rounded-xl object-cover" />
          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${isSuspended ? 'bg-gray-400' : 'bg-emerald-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <h3 className="font-display font-bold text-gray-900 truncate">{admin.name}</h3>
            <div className="relative flex-shrink-0">
              <button onClick={() => setMenu(!menu)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-sm" />
              </button>
              {menu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-20 animate-fade-in">
                  <button onClick={() => { onEdit(admin); setMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                    <FontAwesomeIcon icon={faPen} className="w-3.5 text-gray-400" /> Edit Permissions
                  </button>
                  <button onClick={() => { onChangePassword(admin); setMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors">
                    <FontAwesomeIcon icon={faLock} className="w-3.5" /> Change Password
                  </button>
                  <button onClick={() => { onToggle(admin.id); setMenu(false); }}
                    className={`flex items-center gap-2.5 w-full px-4 py-2 text-sm transition-colors ${isSuspended ? 'text-emerald-700 hover:bg-emerald-50' : 'text-amber-700 hover:bg-amber-50'}`}>
                    <FontAwesomeIcon icon={isSuspended ? faCircleCheck : faBan} className="w-3.5" />
                    {isSuspended ? 'Reactivate' : 'Suspend'}
                  </button>
                  <div className="border-t border-gray-50 my-1" />
                  <button onClick={() => { onRemove(admin.id); setMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <FontAwesomeIcon icon={faTrash} className="w-3.5" /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-400 truncate mb-2.5">{admin.email}</p>
          <div className="flex flex-wrap gap-1.5">
            {admin.permissions.map(p => <PermTag key={p} id={p} />)}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <span className="text-xs text-gray-400">Added {admin.addedAt}</span>
        <span className={`badge text-[10px] ${isSuspended ? 'bg-gray-100 text-gray-500' : 'badge-confirmed'}`}>
          <FontAwesomeIcon icon={isSuspended ? faBan : faCheck} className="text-[9px]" />
          {isSuspended ? 'Suspended' : 'Active'}
        </span>
      </div>
      {/* Password reveal row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2 min-w-0">
          <FontAwesomeIcon icon={faKey} className="text-gray-300 text-xs flex-shrink-0" />
          <span className="text-xs text-gray-400 font-mono tracking-wider truncate">
            {showPwd ? (admin.password || '—') : '••••••••'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowPwd(v => !v)}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
          title={showPwd ? 'Hide password' : 'Reveal password'}
        >
          <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-xs" />
        </button>
      </div>
      {menu && <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />}
    </div>
  );
}

function AdminModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  const toggle = (id) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.';
    if (form.permissions.length === 0) e.perms = 'Select at least one permission.';
    if (mode === 'add' && form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={mode === 'add' ? faUserPlus : faPen} className="text-violet-600 text-sm" />
            </div>
            <h2 className="font-display font-bold text-xl text-gray-900">
              {mode === 'add' ? 'Add New Admin' : 'Edit Admin'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="form-group">
            <label className="form-label"><FontAwesomeIcon icon={faUser} className="mr-1.5 text-gray-400" />Full Name</label>
            <input type="text" placeholder="Admin's full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={`form-input ${errors.name ? 'form-input-error' : ''}`} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label"><FontAwesomeIcon icon={faEnvelope} className="mr-1.5 text-gray-400" />Email Address</label>
            <input type="email" placeholder="admin@driveease.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              readOnly={mode === 'edit'} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {mode === 'add' && (
            <div className="form-group">
              <label className="form-label"><FontAwesomeIcon icon={faLock} className="mr-1.5 text-gray-400" />Initial Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`form-input pr-10 ${errors.password ? 'form-input-error' : ''}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} className="text-sm" />
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
          )}

          <div>
            <label className="form-label flex items-center gap-1.5">
              <FontAwesomeIcon icon={faKey} className="text-gray-400" />Permissions
            </label>
            <div className="grid grid-cols-2 gap-2.5 mt-2">
              {ALL_PERMISSIONS.map(p => (
                <button key={p.id} type="button" onClick={() => toggle(p.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    form.permissions.includes(p.id)
                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
                  }`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${form.permissions.includes(p.id) ? 'border-white bg-white/20' : 'border-gray-300'}`}>
                    {form.permissions.includes(p.id) && <FontAwesomeIcon icon={faCheck} className="text-white text-[8px]" />}
                  </div>
                  {p.label}
                </button>
              ))}
            </div>
            {errors.perms && <p className="form-error mt-1.5">{errors.perms}</p>}
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={handleSave} className="flex-1 btn-primary">
            <FontAwesomeIcon icon={mode === 'add' ? faUserPlus : faCheck} />
            {mode === 'add' ? 'Add Admin' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageAdmins() {
  const { admins, addAdmin, updateAdmin, removeAdmin, toggleAdminStatus } = useAuth();
  const [modal,      setModal]      = useState(null);
  const [removeConf, setRemoveConf] = useState(null);
  const [pwModal,    setPwModal]    = useState(null);
  const [search,     setSearch]     = useState('');

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form) => {
    if (modal.mode === 'add') {
      const ok = addAdmin(form);
      if (ok) setModal(null);
    } else {
      updateAdmin(modal.admin.id, { name: form.name, permissions: form.permissions });
      setModal(null);
    }
  };

  const handleRemove = (id) => { removeAdmin(id); setRemoveConf(null); };

  const activeCount    = admins.filter(a => a.status === 'active').length;
  const suspendedCount = admins.filter(a => a.status === 'suspended').length;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUserShield} className="text-violet-600 text-sm" />
            </div>
            <h1 className="font-display font-black text-2xl text-gray-900">Manage Admins</h1>
          </div>
          <p className="text-gray-500 text-sm">Add, edit, change passwords, suspend, or remove admin accounts.</p>
        </div>
        <button onClick={() => setModal({ mode: 'add' })} className="btn-primary">
          <FontAwesomeIcon icon={faPlus} /> Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Admins', value: admins.length,  color: 'text-gray-900',    accent: 'border-gray-300'    },
          { label: 'Active',       value: activeCount,     color: 'text-emerald-700', accent: 'border-emerald-400' },
          { label: 'Suspended',    value: suspendedCount,  color: 'text-amber-700',   accent: 'border-amber-400'   },
        ].map(s => (
          <div key={s.label} className={`card p-5 border-t-4 ${s.accent}`}>
            <p className={`font-display font-black text-3xl ${s.color}`}>
              <StatCounter value={s.value} duration={900} />
            </p>
            <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-6 shadow-sm">
        <FontAwesomeIcon icon={faUserShield} className="text-gray-400 text-sm flex-shrink-0" />
        <input type="text" placeholder="Search by name or email…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent" />
        {search && (
          <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUserShield} className="text-violet-400 text-2xl" />
          </div>
          <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No Admins Found</h3>
          <p className="text-gray-400 text-sm mb-6">{search ? 'Try a different search.' : 'Start by adding your first admin.'}</p>
          {!search && (
            <button onClick={() => setModal({ mode: 'add' })} className="btn-primary mx-auto">
              <FontAwesomeIcon icon={faPlus} />Add Admin
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(admin => (
            <AdminCard key={admin.id} admin={admin}
              onEdit={(a) => setModal({ mode: 'edit', admin: a })}
              onToggle={(id) => { toggleAdminStatus(id); toast.success('Admin status updated.'); }}
              onRemove={(id) => setRemoveConf(id)}
              onChangePassword={(a) => setPwModal(a)} />
          ))}
        </div>
      )}

      {/* Permissions legend */}
      <div className="mt-8 card p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} />Permission Reference
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ALL_PERMISSIONS.map(p => (
            <div key={p.id} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <span className={`badge text-[10px] ${p.color} flex-shrink-0 mt-0.5`}>{p.label}</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                {p.id === 'manage_bookings' && 'View, approve, reject, and update booking statuses.'}
                {p.id === 'manage_cars'     && 'Add, edit, enable/disable cars in the fleet.'}
                {p.id === 'view_reports'    && 'Access revenue reports and analytics dashboards.'}
                {p.id === 'manage_users'    && 'View customer accounts and manage user data.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <AdminModal
          mode={modal.mode}
          initial={modal.admin ? { name: modal.admin.name, email: modal.admin.email, permissions: [...modal.admin.permissions], password: '' } : undefined}
          onClose={() => setModal(null)}
          onSave={handleSave} />
      )}

      {pwModal && (
        <PasswordModal admin={pwModal} onClose={() => setPwModal(null)} />
      )}

      {removeConf && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 animate-fade-in text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTrash} className="text-red-500 text-xl" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Remove Admin?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The admin will lose all access immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveConf(null)} className="flex-1 btn-secondary">Cancel</button>
              <button onClick={() => handleRemove(removeConf)} className="flex-1 btn-danger">
                <FontAwesomeIcon icon={faTrash} />Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
