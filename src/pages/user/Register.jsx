import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faEnvelope, faLock, faEye, faEyeSlash,
  faSpinner, faUser, faPhone, faCheck, faCircleExclamation,
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

const PasswordStrength = ({ password = '' }) => {
  const checks = [
    { label: '8+ chars',   ok: password.length >= 8 },
    { label: 'Uppercase',  ok: /[A-Z]/.test(password) },
    { label: 'Number',     ok: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const bars  = ['bg-red-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500'];
  const label = ['', 'Weak', 'Fair', 'Strong'];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? bars[score] : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className={`text-xs flex items-center gap-1 ${c.ok ? 'text-emerald-600' : 'text-gray-400'}`}>
              <FontAwesomeIcon icon={faCheck} className="text-[8px]" />{c.label}
            </span>
          ))}
        </div>
        {score > 0 && <span className={`text-xs font-semibold ${score >= 2 ? 'text-emerald-600' : 'text-amber-500'}`}>{label[score]}</span>}
      </div>
    </div>
  );
};

const benefits = [
  'Free cancellation on all bookings',
  'Exclusive member-only deals & discounts',
  'Priority 24/7 customer support',
  'Loyalty rewards on every rental',
];

export default function Register() {
  const { register: authRegister, socialLogin, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [socialError, setSocialError]     = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  useEffect(() => { if (isLoggedIn) navigate('/'); }, [isLoggedIn]);

  const onSubmit = async (data) => {
    await authRegister(data);
    navigate('/');
  };

  const handleSocialSignup = async (provider) => {
    setSocialLoading(provider); setSocialError(null);
    try { await socialLogin(provider); navigate('/'); }
    catch (err) { setSocialError(err?.message || `${provider} sign-up failed.`); }
    finally { setSocialLoading(null); }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ══ LEFT — visual panel ══ */}
      <div className="hidden lg:flex w-[42%] flex-shrink-0 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg,#0a1628 0%,#0f2046 40%,#1a3a7a 70%,#2563eb 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-32 -left-32 w-[460px] h-[460px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#3b82f6,transparent)' }} />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#f97316,transparent)' }} />
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        </div>

        <div className="relative z-10">
          <Logo size="lg" variant="light" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6">
            <FontAwesomeIcon icon={faCar} className="text-accent-400 text-xs" />
            <span className="text-white/80 text-xs font-semibold">Join 120+ happy drivers</span>
          </div>
          <h2 className="font-display font-black text-white text-4xl leading-tight mb-3">
            Start Your<br /><span className="text-accent-400">Journey Today</span>
          </h2>
          <p className="text-white/55 text-sm mb-7 leading-relaxed">
            Create your free account and get access to India's best car rental experience.
          </p>
          <ul className="space-y-3">
            {benefits.map(b => (
              <li key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-emerald-400/25 rounded-full flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faCheck} className="text-emerald-400" style={{ fontSize: '8px' }} />
                </div>
                <span className="text-white/70 text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/8 border border-white/12 rounded-2xl p-5">
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <p className="text-white/70 text-sm italic leading-relaxed">"Booking was seamless, the car was spotless, and the pricing was totally transparent. Highly recommend!"</p>
          <p className="text-white/45 text-xs mt-2 font-semibold">— Priya S., Mumbai</p>
        </div>
      </div>

      {/* ══ RIGHT — form panel ══ */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto bg-slate-50">
        <div className="w-full max-w-[440px] animate-fade-in">

          <div className="lg:hidden mb-6 flex justify-center">
            <Logo size="md" variant="dark" />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8"
            style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>

            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-gray-900">Create Account</h1>
              <p className="text-gray-400 text-sm mt-1">Sign up free — takes less than 2 minutes</p>
            </div>

            {/* Social signup */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button type="button" onClick={() => handleSocialSignup('google')}
                disabled={!!socialLoading || isLoading}
                className="flex items-center justify-center gap-2 h-11 px-3 bg-white border border-gray-200
                  rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300
                  transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {socialLoading === 'google' ? <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400" /> : <GoogleIcon />}
                Google
              </button>
              <button type="button" onClick={() => handleSocialSignup('facebook')}
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

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-first">First Name</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="reg-first" type="text" placeholder="Arjun"
                      className={`form-input pl-11 ${errors.firstName ? 'form-input-error' : ''}`}
                      {...register('firstName', { required: 'Required', minLength: { value: 2, message: 'Too short' } })} />
                  </div>
                  {errors.firstName && <p className="form-error text-[10px]"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.firstName.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-last">Last Name</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="reg-last" type="text" placeholder="Sharma"
                      className={`form-input pl-11 ${errors.lastName ? 'form-input-error' : ''}`}
                      {...register('lastName', { required: 'Required' })} />
                  </div>
                  {errors.lastName && <p className="form-error text-[10px]"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.lastName.message}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input id="reg-email" type="email" autoComplete="email" placeholder="arjun@example.com"
                    className={`form-input pl-11 ${errors.email ? 'form-input-error' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                    })} />
                </div>
                {errors.email && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.email.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
                <div className="relative">
                  <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input id="reg-phone" type="tel" placeholder="+91 98765 43210"
                    className="form-input pl-11"
                    {...register('phone', { pattern: { value: /^[\d\s\+\-\(\)]{10,15}$/, message: 'Invalid phone number' } })} />
                </div>
                {errors.phone && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.phone.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-pwd">Password</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input id="reg-pwd" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={`form-input pl-11 pr-12 ${errors.password ? 'form-input-error' : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Min 8 characters' },
                    })} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-sm" />
                  </button>
                </div>
                <PasswordStrength password={password} />
                {errors.password && <p className="form-error mt-1"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.password.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                  <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Re-enter password"
                    className={`form-input pl-11 pr-12 ${errors.confirmPassword ? 'form-input-error' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: v => v === password || 'Passwords do not match',
                    })} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} className="text-sm" />
                  </button>
                </div>
                {errors.confirmPassword && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="btn-primary w-full py-3.5 font-bold text-base rounded-xl mt-2">
                {isLoading ? <><FontAwesomeIcon icon={faSpinner} spin /> Creating account…</> : 'Create My Account'}
              </button>

              <p className="text-center text-xs text-gray-400 leading-relaxed">
                By signing up you agree to our{' '}
                <a href="#" className="text-primary-600 hover:underline font-medium">Terms of Service</a> and{' '}
                <a href="#" className="text-primary-600 hover:underline font-medium">Privacy Policy</a>.
              </p>
            </form>

            <p className="text-center text-sm text-gray-400 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
