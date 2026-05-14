import { createContext, useContext, useState, useEffect } from 'react';
import { dummyOwnerData } from '../assets/assets';
import toast from 'react-hot-toast';

const AuthContext = createContext();

/* ════════════════════════════════════════════════════════════════
   STORAGE HELPERS
   ════════════════════════════════════════════════════════════════ */

const load = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch { return fallback; }
};
const save   = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota */ } };
const remove = (key)      => { try { localStorage.removeItem(key); }                  catch { /* noop  */ } };

/* ════════════════════════════════════════════════════════════════
   PERSISTENCE KEYS  (v4)
   Split into role-specific session keys so that an owner login
   never overwrites a user session in localStorage, and vice-versa.
   ════════════════════════════════════════════════════════════════ */

const USERS_KEY         = 'de_users_v3';
const OWNER_KEY         = 'de_owners_v3';
const ADMINS_KEY        = 'de_admins_v3';
const USER_SESSION_KEY  = 'de_user_session_v4';   // role === 'user'  sessions only
const OWNER_SESSION_KEY = 'de_owner_session_v4';  // role === 'owner' sessions only

/* ─── Remove stale/shared keys from previous versions ─── */
[
  'driveease_users_v2', 'driveease_owners_v2', 'driveease_session_v2',
  'driveease_users',    'driveease_owners',    'driveease_session',
  'de_users_v2',        'de_owners_v2',        'de_session_v2',
  'de_session_v3',  // old single shared key, now replaced by split keys
].forEach(remove);

/* ════════════════════════════════════════════════════════════════
   SESSION INIT
   Decide which session to restore at mount time based on the URL:
   - /owner/* paths restore the owner session only
   - all other paths restore the user session only
   This stops the owner session from bleeding into the user side
   on page refresh.
   ════════════════════════════════════════════════════════════════ */

const getInitSession = () => {
  try {
    if (window.location.pathname.startsWith('/owner')) {
      const ownerSess = load(OWNER_SESSION_KEY, null);
      return ownerSess?.role === 'owner' ? ownerSess : null;
    }
    const userSess = load(USER_SESSION_KEY, null);
    // Guard: never let an owner session leak into the user-side app
    return userSess?.role === 'owner' ? null : userSess;
  } catch {
    return null;
  }
};

/* ════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════ */

const avatarUrl = (name, bg = '2563eb') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=100`;

/* ════════════════════════════════════════════════════════════════
   DEMO / SEED DATA
   ════════════════════════════════════════════════════════════════ */

const DEMO_OWNER = { ...dummyOwnerData, password: 'password123' };

const SEED_ADMINS = [
  {
    id: 'ADM001', name: 'Aarav Patel', email: 'aarav@driveease.com',
    avatar: avatarUrl('Aarav Patel', '7c3aed'),
    permissions: ['manage_bookings', 'manage_cars'], status: 'active', addedAt: '2025-01-15',
    password: 'admin123',
  },
  {
    id: 'ADM002', name: 'Meera Sharma', email: 'meera@driveease.com',
    avatar: avatarUrl('Meera Sharma', '0891b2'),
    permissions: ['view_reports', 'manage_users'], status: 'active', addedAt: '2025-03-08',
    password: 'admin123',
  },
];

/* ════════════════════════════════════════════════════════════════
   PROVIDER
   ════════════════════════════════════════════════════════════════ */

export const AuthProvider = ({ children }) => {
  const [registeredUsers,  setRegisteredUsers]  = useState(() => load(USERS_KEY, []));
  const [registeredOwners, setRegisteredOwners] = useState(() => load(OWNER_KEY, []));
  const [user,             setUser]             = useState(() => getInitSession());
  const [admins,           setAdmins]           = useState(() => load(ADMINS_KEY, SEED_ADMINS));
  const [isLoading,        setIsLoading]        = useState(false);

  /* ─── Persist base stores ─── */
  useEffect(() => save(USERS_KEY,  registeredUsers),  [registeredUsers]);
  useEffect(() => save(OWNER_KEY,  registeredOwners), [registeredOwners]);
  useEffect(() => save(ADMINS_KEY, admins),           [admins]);

  /* ─── Persist active session to the correct role-specific key ─── */
  useEffect(() => {
    if (!user) return; // null-case handled explicitly in logout()
    if (user.role === 'owner') save(OWNER_SESSION_KEY, user);
    else                       save(USER_SESSION_KEY,  user);
  }, [user]);

  /* ─── Strip password before storing in React state ─── */
  const sanitize = (u) => { const { password: _, ...rest } = u; return rest; };

  /* ════════════════════════════════════════════════════════
     AUTH ACTIONS
     ════════════════════════════════════════════════════════ */

  const login = async (email, password, role = 'user') => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);
    const normalEmail = email.trim().toLowerCase();

    if (role === 'owner') {
      const found = registeredOwners.find(
        o => o.email.toLowerCase() === normalEmail && o.password === password
      );
      if (found) {
        setUser(sanitize(found));
        toast.success(`Welcome back, ${found.name}!`);
        return 'owner';
      }
      if (normalEmail === DEMO_OWNER.email.toLowerCase() && password === DEMO_OWNER.password) {
        setUser(sanitize(DEMO_OWNER));
        toast.success(`Welcome back, ${DEMO_OWNER.name}!`);
        return 'owner';
      }
      toast.error('No owner account found with these credentials.');
      throw new Error('Invalid credentials');
    }

    const found = registeredUsers.find(
      u => u.email.toLowerCase() === normalEmail && u.password === password
    );
    if (!found) {
      toast.error('No account found. Please sign up first.');
      throw new Error('Invalid credentials');
    }
    setUser(sanitize(found));
    toast.success(`Welcome back, ${found.name}!`);
    return 'user';
  };

  const register = async (data) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setIsLoading(false);
    const normalEmail = data.email.trim().toLowerCase();
    if (registeredUsers.find(u => u.email.toLowerCase() === normalEmail)) {
      toast.error('An account with this email already exists. Please sign in.');
      throw new Error('Email already registered');
    }
    const newUser = {
      id: `USR${Date.now()}`,
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: normalEmail, password: data.password,
      phone: data.phone?.trim() || '',
      avatar: avatarUrl(`${data.firstName} ${data.lastName}`),
      role: 'user',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(sanitize(newUser));
    toast.success(`Account created! Welcome, ${newUser.name}!`);
    return 'user';
  };

  const registerOwner = async (data) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    const normalEmail = data.email.trim().toLowerCase();
    const exists =
      registeredOwners.find(o => o.email.toLowerCase() === normalEmail) ||
      normalEmail === DEMO_OWNER.email.toLowerCase();
    if (exists) {
      toast.error('An owner account with this email already exists.');
      throw new Error('Email already registered');
    }
    const newOwner = {
      id: `OWN${Date.now()}`,
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: normalEmail, password: data.password,
      phone: data.phone?.trim() || '',
      businessName: data.businessName?.trim() || '',
      avatar: avatarUrl(`${data.firstName} ${data.lastName}`, '1e40af'),
      role: 'owner',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setRegisteredOwners(prev => [...prev, newOwner]);
    setUser(sanitize(newOwner));
    toast.success(`Owner account created! Welcome, ${newOwner.name}!`);
    return 'owner';
  };

  const socialLogin = async (provider) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    if (!['google', 'facebook'].includes(provider)) {
      toast.error('Unsupported provider.');
      throw new Error('Unsupported provider');
    }
    const providerName = provider === 'google' ? 'Google' : 'Facebook';
    const email = provider === 'google'
      ? 'social.google@driveease.demo'
      : 'social.facebook@driveease.demo';
    let existing = registeredUsers.find(u => u.email === email);
    if (!existing) {
      existing = {
        id: `USR_${provider}`,
        name: provider === 'google' ? 'Google User' : 'Facebook User',
        email, password: '__social__', phone: '',
        avatar: avatarUrl(
          provider === 'google' ? 'Google User' : 'Facebook User',
          provider === 'google' ? '4285F4' : '1877F2'
        ),
        role: 'user',
        joinedDate: new Date().toISOString().split('T')[0],
        socialProvider: provider,
      };
      setRegisteredUsers(prev => [...prev, existing]);
    }
    setUser(sanitize(existing));
    toast.success(`Signed in with ${providerName}!`);
    return 'user';
  };

  /* ════════════════════════════════════════════════════════
     PROFILE MANAGEMENT
     ════════════════════════════════════════════════════════ */

  const updateUserProfile = (updates) => {
    if (!updates || typeof updates !== 'object') return;
    setUser(prev => ({ ...prev, ...updates }));
    setRegisteredUsers(prev =>
      prev.map(u => u.id === user?.id ? { ...u, ...updates } : u)
    );
  };

  const changeUserPassword = (currentPassword, newPassword) => {
    const stored = registeredUsers.find(u => u.id === user?.id);
    if (!stored) { toast.error('User not found.'); return false; }
    if (stored.password !== currentPassword) {
      toast.error('Current password is incorrect.');
      return false;
    }
    setRegisteredUsers(prev =>
      prev.map(u => u.id === user.id ? { ...u, password: newPassword } : u)
    );
    toast.success('Password changed successfully.');
    return true;
  };

  const linkSocialAccount = (provider) => {
    setUser(prev => ({
      ...prev,
      linkedAccounts: [...(prev?.linkedAccounts || []), provider],
    }));
    toast.success(`${provider === 'google' ? 'Google' : 'Facebook'} account linked!`);
  };

  const unlinkSocialAccount = (provider) => {
    setUser(prev => ({
      ...prev,
      linkedAccounts: (prev?.linkedAccounts || []).filter(p => p !== provider),
    }));
    toast.success(`${provider === 'google' ? 'Google' : 'Facebook'} account unlinked.`);
  };

  /* ════════════════════════════════════════════════════════
     ADMIN MANAGEMENT
     ════════════════════════════════════════════════════════ */

  const addAdmin = (form) => {
    if (admins.find(a => a.email.toLowerCase() === form.email.trim().toLowerCase())) {
      toast.error('An admin with this email already exists.');
      return false;
    }
    const newAdmin = {
      id: `ADM${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      avatar: avatarUrl(form.name, '7c3aed'),
      permissions: [...form.permissions],
      status: 'active',
      addedAt: new Date().toISOString().split('T')[0],
      password: form.password || 'admin123',
    };
    setAdmins(prev => [...prev, newAdmin]);
    toast.success(`Admin "${newAdmin.name}" added successfully.`);
    return true;
  };

  const updateAdmin = (id, updates) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    toast.success('Admin updated successfully.');
  };

  const changeAdminPassword = (id, currentPassword, newPassword) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) { toast.error('Admin not found.'); return false; }
    if (admin.password !== currentPassword) {
      toast.error('Current password is incorrect.');
      return false;
    }
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, password: newPassword } : a));
    toast.success('Password changed successfully.');
    return true;
  };

  /* ─── Owner can reset any admin password without knowing the current one ─── */
  const ownerResetAdminPassword = (id, newPassword) => {
    if (!admins.find(a => a.id === id)) { toast.error('Admin not found.'); return false; }
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, password: newPassword } : a));
    toast.success('Password reset by owner.');
    return true;
  };

  const removeAdmin = (id) => {
    const admin = admins.find(a => a.id === id);
    setAdmins(prev => prev.filter(a => a.id !== id));
    if (admin) toast.success(`Admin "${admin.name}" removed.`);
  };

  const toggleAdminStatus = (id) => {
    setAdmins(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' }
        : a
    ));
  };

  /* ════════════════════════════════════════════════════════
     LOGOUT
     Only clears the session key for the current role so the
     opposite role's session in localStorage is never touched.
     ════════════════════════════════════════════════════════ */

  const logout = () => {
    if (user?.role === 'owner') remove(OWNER_SESSION_KEY);
    else                        remove(USER_SESSION_KEY);
    setUser(null);
    toast.success('You have been logged out.');
  };

  /* ─── Derived helpers ─── */
  const isOwner    = user?.role === 'owner';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, isOwner, isLoading,
      login, register, registerOwner, socialLogin,
      updateUserProfile, changeUserPassword, linkSocialAccount, unlinkSocialAccount, logout,
      admins, addAdmin, updateAdmin, changeAdminPassword, ownerResetAdminPassword,
      removeAdmin, toggleAdminStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
