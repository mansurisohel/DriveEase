import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faLock, faEye, faEyeSlash, faSpinner,
  faUser, faPhone, faBuilding, faCircleExclamation,
  faShield, faChartLine, faListCheck, faBolt, faCheck, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

const PasswordStrength = ({ password = '' }) => {
  const checks = [
    { label: '8+ chars',  ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number',    ok: /\d/.test(password) },
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

const steps = [
  { icon: faBuilding, label: 'Register your fleet' },
  { icon: faListCheck, label: 'Add your vehicles' },
  { icon: faChartLine, label: 'Start earning' },
];

export default function OwnerRegister() {
  const { registerOwner, isLoggedIn, isOwner, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm();
  const password = watch('password', '');

  useEffect(() => { if (isLoggedIn && isOwner) navigate('/owner', { replace: true }); }, [isLoggedIn, isOwner]);

  const onSubmit = async (data) => {
    try {
      await registerOwner(data);
      navigate('/owner');
    } catch (err) {
      setError('root', { message: err.message || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ══ LEFT — form panel ══ */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto bg-slate-50">
        <div className="w-full max-w-[460px] animate-fade-in">

          <Link to="/owner-login" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700
            text-sm font-medium mb-7 transition-colors group">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            Back to Owner Login
          </Link>

          <div className="lg:hidden mb-6">
            <Logo size="md" variant="dark" />
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>

            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}>
                  <FontAwesomeIcon icon={faShield} className="text-white text-sm" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl text-gray-900">Owner Registration</h1>
                  <p className="text-gray-400 text-xs ">Set up your fleet management account</p>
                </div>
              </div>


              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                {errors.root && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faCircleExclamation} className="flex-shrink-0" />
                    {errors.root.message}
                  </div>
                )}

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="or-first">First Name</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                      <input id="or-first" type="text" placeholder="Rajesh"
                        className={`form-input pl-11 ${errors.firstName ? 'form-input-error' : ''}`}
                        {...register('firstName', { required: 'Required', minLength: { value: 2, message: 'Too short' } })} />
                    </div>
                    {errors.firstName && <p className="form-error text-[10px]"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.firstName.message}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="or-last">Last Name</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                      <input id="or-last" type="text" placeholder="Verma"
                        className={`form-input pl-11 ${errors.lastName ? 'form-input-error' : ''}`}
                        {...register('lastName', { required: 'Required' })} />
                    </div>
                    {errors.lastName && <p className="form-error text-[10px]"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="or-biz">Business / Fleet Name</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faBuilding} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="or-biz" type="text" placeholder="e.g. Verma Auto Rentals"
                      className={`form-input pl-11 ${errors.businessName ? 'form-input-error' : ''}`}
                      {...register('businessName', { required: 'Business name is required' })} />
                  </div>
                  {errors.businessName && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.businessName.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="or-email">Business Email</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="or-email" type="email" autoComplete="email" placeholder="owner@yourfleet.com"
                      className={`form-input pl-11 ${errors.email ? 'form-input-error' : ''}`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                      })} />
                  </div>
                  {errors.email && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.email.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="or-phone">Contact Number</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="or-phone" type="tel" placeholder="+91 98765 43210"
                      className="form-input pl-11"
                      {...register('phone', { pattern: { value: /^[\d\s\+\-\(\)]{10,15}$/, message: 'Invalid number' } })} />
                  </div>
                  {errors.phone && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.phone.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="or-pwd">Password</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="or-pwd" type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                      placeholder="Create a strong password"
                      className={`form-input pl-11 pr-12 ${errors.password ? 'form-input-error' : ''}`}
                      {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                      <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                  {errors.password && <p className="form-error mt-1"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.password.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="or-confirm">Confirm Password</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="or-confirm" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
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
                  className="w-full py-3.5 font-bold text-base rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}>
                  {isLoading ? <><FontAwesomeIcon icon={faSpinner} spin /> Creating account…</> : 'Create Owner Account'}
                </button>

                <p className="text-center text-xs text-gray-400 leading-relaxed">
                  By registering you agree to our{' '}
                  <a href="#" className="text-primary-600 hover:underline font-medium">Terms of Service</a> and{' '}
                  <a href="#" className="text-primary-600 hover:underline font-medium">Privacy Policy</a>.
                </p>
              </form>

              <p className="text-center text-sm text-gray-400 mt-5">
                Already have an owner account?{' '}
                <Link to="/owner-login" className="text-primary-600 font-bold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT — dark panel ══ */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#0a1628 0%,#0f2046 40%,#1e3a8a 75%,#1d4ed8 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#f97316,transparent)' }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Logo size="lg" variant="light" />

          <div>
            <h2 className="font-display font-black text-white text-4xl leading-tight mb-3">
              Grow Your<br /><span className="text-accent-400">Rental Business</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              Join hundreds of fleet owners already earning more with DriveEase.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: faChartLine, title: 'Revenue Analytics',  desc: 'Track earnings in real time.' },
                { icon: faListCheck, title: 'Fleet Management',   desc: 'Monitor all your vehicles.' },
                { icon: faShield,    title: 'Booking Control',    desc: 'Approve & manage bookings.' },
                { icon: faBolt,      title: 'Instant Alerts',     desc: 'Never miss a booking.' },
              ].map(f => (
                <div key={f.title} className="bg-white/6 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 bg-primary-500/25 rounded-lg flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={f.icon} className="text-primary-300 text-sm" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-0.5">{f.title}</p>
                  <p className="text-white/40 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: '12+', label: 'Fleet Owners' },
              { val: '20+', label: 'Cities' },
              { val: '₹2Cr+', label: 'Paid Out' },
            ].map(s => (
              <div key={s.label} className="bg-white/6 border border-white/10 rounded-xl p-3 text-center">
                <p className="font-display font-black text-white text-xl">{s.val}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
