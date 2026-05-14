import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faLock, faEye, faEyeSlash, faSpinner,
  faCircleExclamation, faChartLine, faListCheck, faShield, faBolt,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

const features = [
  { icon: faChartLine, title: 'Revenue Analytics',  desc: 'Track earnings & fleet performance live.' },
  { icon: faListCheck, title: 'Fleet Management',   desc: 'Add, edit & monitor all your vehicles.' },
  { icon: faShield,    title: 'Booking Control',    desc: 'Approve, reject & manage reservations.' },
  { icon: faBolt,      title: 'Instant Alerts',     desc: 'Get notified the moment a booking lands.' },
];

export default function OwnerLogin() {
  const { login, isLoggedIn, isOwner, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: { email: 'owner@driveease.com', password: 'password123' },
  });

  useEffect(() => {
    // Only auto-redirect if already logged in as owner
    if (isLoggedIn && isOwner) navigate('/owner', { replace: true });
    // If a regular user lands here, do NOT redirect them — let them log in as owner if they want
  }, [isLoggedIn, isOwner]);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, 'owner');
      navigate('/owner');
    } catch {
      setError('root', { message: 'Invalid credentials. Use owner@driveease.com for demo.' });
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ══ LEFT — form panel ══ */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 overflow-y-auto bg-slate-50">
        <div className="w-full max-w-[420px] animate-fade-in">

          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700
            text-sm font-medium mb-7 transition-colors group">
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden mb-6">
            <Logo size="md" variant="dark" />
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>

            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}>
                  <FontAwesomeIcon icon={faShield} className="text-white text-sm" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl text-gray-900">Owner Portal</h1>
                  <p className="text-gray-400 text-xs">Fleet Manager Access</p>
                </div>
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
                  <label className="form-label" htmlFor="o-email">Email Address</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="o-email" type="email" autoComplete="email"
                      className={`form-input pl-11 ${errors.email ? 'form-input-error' : ''}`}
                      {...register('email', { required: 'Email is required' })} />
                  </div>
                  {errors.email && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.email.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="o-pwd">Password</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                    <input id="o-pwd" type={showPwd ? 'text' : 'password'} autoComplete="current-password"
                      className={`form-input pl-11 pr-12 ${errors.password ? 'form-input-error' : ''}`}
                      {...register('password', { required: 'Password is required' })} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                      <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                  </div>
                  {errors.password && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs" /> {errors.password.message}</p>}
                </div>

                {/* Demo hint */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
                  <strong>Demo credentials:</strong> owner@driveease.com / password123
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full py-3.5 font-bold text-base rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#1e40af,#2563eb)' }}>
                  {isLoading ? <><FontAwesomeIcon icon={faSpinner} spin /> Signing in…</> : 'Access Owner Dashboard'}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <Link to="/login"
                className="flex items-center justify-center gap-2 w-full h-11 border border-gray-200
                  hover:border-primary-300 hover:bg-primary-50 text-gray-500 hover:text-primary-700
                  font-semibold rounded-xl transition-all text-sm">
                Sign in as a regular user
              </Link>

              <p className="text-center text-sm text-gray-400 mt-5">
                Don't have an owner account?{' '}
                <Link to="/owner-register" className="text-primary-600 font-bold hover:underline">Register fleet</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT — dark visual panel ══ */}
      <div className="hidden lg:flex w-[480px] flex-shrink-0 flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#0a1628 0%,#0f2046 40%,#1e3a8a 75%,#1d4ed8 100%)' }}>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#3b82f6,transparent)' }} />
          <div className="absolute bottom-0 -left-16 w-[360px] h-[360px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <Logo size="lg" variant="light" />

          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-semibold">Owner Dashboard Live</span>
            </div>
            <h2 className="font-display font-black text-white text-4xl xl:text-5xl leading-tight mb-4">
              Manage Your<br />
              <span className="text-accent-400">Fleet Smarter.</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              The complete platform to manage your car rental business — bookings, fleet, analytics, all in one place.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {features.map(f => (
                <div key={f.title} className="bg-white/6 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 bg-primary-500/25 rounded-lg flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={f.icon} className="text-primary-300 text-sm" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{f.title}</p>
                  <p className="text-white/45 text-xs leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/25 text-xs">© {new Date().getFullYear()} DriveEase. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
