import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faEnvelope, faLock, faEye, faEyeSlash,
  faSpinner, faCircleExclamation, faShieldHalved, faCheck,
  faRoad, faGasPump, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const perks = [
  { icon: faCar,     text: 'Access 35+ premium vehicles across India' },
  { icon: faRoad,    text: 'Instant booking with real-time availability' },
  { icon: faGasPump, text: 'Transparent pricing — no hidden fees' },
  { icon: faStar,    text: 'Exclusive deals & loyalty rewards' },
];

export default function Login() {
  const { login, socialLogin, isLoggedIn, isOwner, isLoading } = useAuth();
  const navigate = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from || '/';
  const [showPwd, setShowPwd]             = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [socialError, setSocialError]     = useState(null);

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  useEffect(() => {
    // Only redirect non-owner users — owners must use /owner-login
    if (isLoggedIn && !isOwner) navigate(from, { replace: true });
  }, [isLoggedIn, isOwner]);

  const onSubmit = async (data) => {
    setSocialError(null);
    try {
      const role = await login(data.email, data.password, 'user');
      if (role === 'owner') {
        // Owner tried to log in through user portal — redirect them
        navigate('/owner', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      setError('root', { message: 'Invalid credentials. Please check your email and password.' });
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider); setSocialError(null);
    try { await socialLogin(provider); navigate(from, { replace: true }); }
    catch (err) { setSocialError(err?.message || `${provider} sign-in failed. Try again.`); }
    finally { setSocialLoading(null); }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ══ LEFT — visual panel ══ */}
      <div className="hidden lg:flex w-[45%] flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#0a1628 0%,#0f2046 40%,#1a3a7a 70%,#2563eb 100%)' }}>

        {/* background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#3b82f6,transparent)' }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#f97316,transparent)' }} />
          {/* dot grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Logo size="lg" variant="light" />

          {/* Hero text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-semibold tracking-wide">Available 24×7 Across India</span>
            </div>
            <h2 className="font-display font-black text-white text-4xl xl:text-5xl leading-[1.1] mb-4">
              Your Drive,<br />
              <span className="text-accent-400">Your Rules.</span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-8 max-w-sm">
              Sign in to manage bookings, unlock exclusive deals, and hit the road in style.
            </p>

            {/* Perk list */}
            <ul className="space-y-3">
              {perks.map(p => (
                <li key={p.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 border border-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={p.icon} className="text-accent-300 text-xs" />
                  </div>
                  <span className="text-white/70 text-sm">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rating strip */}
          <div className="flex items-center gap-4 bg-white/8 border border-white/12 rounded-2xl px-5 py-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <div>
              <p className="text-white font-bold text-sm">4.9 / 5 Rating</p>
              <p className="text-white/45 text-xs">From 120+ happy customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT — form panel ══ */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 overflow-y-auto bg-slate-50">
        <div className="w-full max-w-[420px] animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo size="md" variant="dark" />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8"
            style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>

            <div className="mb-7">
              <h1 className="font-display font-bold text-2xl text-gray-900">Welcome back</h1>
              <p className="text-gray-400 text-sm mt-1">Sign in to your DriveEase account</p>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button type="button" onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading || isLoading}
                className="flex items-center justify-center gap-2 h-11 px-3 bg-white border border-gray-200
                  rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {socialLoading === 'google' ? <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400" /> : <GoogleIcon />}
                Google
              </button>
              <button type="button" onClick={() => handleSocialLogin('facebook')}
                disabled={!!socialLoading || isLoading}
                className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl text-sm font-semibold
                  text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#1877F2' }}>
                {socialLoading === 'facebook' ? <FontAwesomeIcon icon={faSpinner} spin /> : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{flexShrink:0}}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                Facebook
              </button>
            </div>

            {socialError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2 text-sm mb-4">
                <FontAwesomeIcon icon={faCircleExclamation} className="flex-shrink-0 mt-0.5" />
                <span>{socialError}</span>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faCircleExclamation} className="flex-shrink-0" />
                  {errors.root.message}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com"
                    className={`form-input pl-11 ${errors.email ? 'form-input-error' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                    })} />
                </div>
                {errors.email && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.email.message}</p>}
              </div>

              <div className="form-group">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label mb-0" htmlFor="login-pwd">Password</label>
                  <a href="#" className="text-xs text-primary-600 hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input id="login-pwd" type={showPwd ? 'text' : 'password'} autoComplete="current-password"
                    placeholder="Enter your password"
                    className={`form-input pl-11 pr-12 ${errors.password ? 'form-input-error' : ''}`}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-sm" />
                  </button>
                </div>
                {errors.password && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="btn-primary w-full py-3.5 font-bold text-base rounded-xl mt-2">
                {isLoading ? <><FontAwesomeIcon icon={faSpinner} spin /> Signing in…</> : 'Sign In'}
              </button>
            </form>

            {/* Owner link */}
            <Link to="/owner-login"
              className="flex items-center justify-center gap-2 w-full h-11 border border-dashed border-gray-200
                hover:border-primary-300 hover:bg-primary-50 text-gray-500 hover:text-primary-700
                font-semibold rounded-xl transition-all mt-4 text-sm">
              <FontAwesomeIcon icon={faShieldHalved} className="text-xs" />
              Owner / Fleet Manager Sign In
            </Link>

            <p className="text-center text-sm text-gray-400 mt-5">
              New to DriveEase?{' '}
              <Link to="/register" className="text-primary-600 font-bold hover:underline">Create a free account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
