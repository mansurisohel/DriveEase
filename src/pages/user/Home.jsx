import { useState, useEffect, useRef, useCallback } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faShield, faClock, faCreditCard, faHeadset,
  faCar, faLocationDot, faGasPump, faStar, faArrowRight,
  faCheck, faQuoteLeft, faChevronLeft, faChevronRight,
  faUsers, faRoute, faCalendarCheck, faMedal
} from '@fortawesome/free-solid-svg-icons';
import { useCars } from '../../context/CarContext';
import { cityList } from '../../assets/assets';
import CarCard from '../../components/CarCard';
import hero_car from '../../assets/images/cars/hero_car.png';

import pr1 from '../../assets/images/reviews/pr-1.png';
import pr2 from '../../assets/images/reviews/pr-2.png';
import pr3 from '../../assets/images/reviews/pr-3.png';
import pr4 from '../../assets/images/reviews/pr-4.png';
import pr5 from '../../assets/images/reviews/pr-5.png';


const STAT_NUMS = [
  { target: 35,   suffix: '+',  label: 'Premium Vehicles', icon: faCar,         duration: 1600 },
  { target: 8,    suffix: '+',  label: 'Indian Cities',    icon: faLocationDot, duration: 1200 },
  { target: 120,  suffix: '+',  label: 'Happy Customers',  icon: faUsers,       duration: 1400 },
  { target: 48,   suffix: '',   label: 'Average Rating',   icon: faStar,        duration: 1000, transform: v => (v / 10).toFixed(1) },
];

/* Animated counter component */
function AnimCounter({ target, suffix, duration, transform }) {
  const { count, ref } = useCountUp(target, duration);
  const display = transform ? transform(count) : count;
  return <span ref={ref}>{display}{suffix}</span>;
}


const features = [
  { icon: faShield,     title: 'Full Insurance Coverage', color: 'text-blue-600 bg-blue-50',
    desc: 'Drive confidently — every rental includes comprehensive insurance at no extra cost.' },
  { icon: faClock,      title: '24/7 Roadside Support',   color: 'text-violet-600 bg-violet-50',
    desc: 'Our dedicated team is available around the clock, wherever your journey takes you.' },
  { icon: faCreditCard, title: 'Transparent Pricing',     color: 'text-emerald-600 bg-emerald-50',
    desc: 'No hidden fees, no surprises. Pay exactly what you see — nothing more.' },
  { icon: faHeadset,    title: 'Instant Confirmation',    color: 'text-amber-600 bg-amber-50',
    desc: 'Book in under 2 minutes and get confirmed instantly via email and SMS.' },
  { icon: faMedal,      title: 'Premium Fleet',           color: 'text-rose-600 bg-rose-50',
    desc: 'Curated collection of luxury, economy, sports, and SUV vehicles ready to go.' },
  { icon: faRoute,      title: 'Flexible Pickup Points',  color: 'text-cyan-600 bg-cyan-50',
    desc: 'Pick up at airports, hotels, or our conveniently located city branches.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Business Traveler, Mumbai',
    text: 'DriveEase made my Mumbai business trip completely effortless. The Hyundai Creta was spotless and the booking process took just 2 minutes. Will definitely use again!',
    image: pr1, rating: 5 },
  { name: 'Arjun Mehta', role: 'Road Trip Enthusiast, Delhi',
    text: 'Rented the Mahindra XUV700 for a Manali trip. Absolutely outstanding — car was immaculate, pickup was smooth, and the team was super helpful throughout. 10/10!',
    image: pr2, rating: 5 },
  { name: 'Sneha Iyer', role: 'Travel Blogger, Bengaluru',
    text: "I've tried many car rental services across India but DriveEase stands apart. The Tata Nexon EV was perfect for our Coorg trip — silent, smooth, and eco-friendly!",
    image: pr3, rating: 5 },
  { name: 'Rahul Kapoor', role: 'Corporate Client, Hyderabad',
    text: "We've used DriveEase for all our company's executive travel needs. The BMW fleet is impeccable and the chauffeur-ready service is a game changer. Highly recommended!",
    image: pr4, rating: 5 },
  { name: 'Divya Nair', role: 'Honeymooner, Goa',
    text: 'Rented a Mercedes C-Class for our honeymoon trip through Goa and it was magical. Pristine condition, on-time delivery, zero hassle. Thank you DriveEase!',
    image: pr5, rating: 5 },
];

function TestimonialsSlider() {
  const [active, setActive]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const [paused, setPaused]     = useState(false);
  const timerRef  = useRef(null);
  const activeRef = useRef(0);          // stable ref — no stale closures
  const count = testimonials.length;
  const INTERVAL = 4000;

  // Keep ref in sync
  useEffect(() => { activeRef.current = active; }, [active]);

  const goTo = useCallback((nextIdx, dir = 'next') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setActive(nextIdx);
      setAnimating(false);
    }, 320);
  }, [animating]);

  const prev = () => goTo(active === 0 ? count - 1 : active - 1, 'prev');
  const next = () => goTo((activeRef.current + 1) % count, 'next');

  // Stable autoplay — reads activeRef so it never goes stale
  useEffect(() => {
    const tick = () => {
      if (!paused) goTo((activeRef.current + 1) % count, 'next');
    };
    timerRef.current = setInterval(tick, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, count, goTo]);   // goTo changes only when animating changes; safe

  const t = testimonials[active];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="section-tag">Customer Reviews</p>
          <h2 className="section-title text-3xl md:text-4xl mb-3">What Our Clients Say</h2>
          <p className="section-desc max-w-lg mx-auto">Real stories from real customers who've experienced the DriveEase difference.</p>
        </div>
        <div className="relative max-w-4xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="card p-8 md:p-10 relative transition-all" style={{
            opacity: animating ? 0 : 1,
            transform: animating ? `translateX(${direction === 'next' ? '-30px' : '30px'})` : 'translateX(0)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}>
            <FontAwesomeIcon icon={faQuoteLeft} className="absolute top-6 right-6 text-primary-100 text-6xl md:text-7xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 flex-shrink-0">
                <img src={t.image} alt={t.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-4 ring-primary-100 shadow-md" />
                <div className="md:text-center">
                  <p className="font-display font-bold text-gray-900 text-sm md:text-base leading-tight">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                  <div className="flex items-center gap-0.5 mt-2 md:justify-center">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className={`text-xs ${i < t.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-px bg-gray-100 self-stretch mx-2" />
              <div className="flex-1">
                <p className="text-gray-600 text-base md:text-lg leading-relaxed italic">"{t.text}"</p>
              </div>
            </div>
          </div>
          <button onClick={prev} aria-label="Previous" className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full border border-gray-100 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition-all group z-20">
            <FontAwesomeIcon icon={faChevronLeft} className="text-gray-500 group-hover:text-primary-600 text-sm" />
          </button>
          <button onClick={next} aria-label="Next" className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white shadow-lg rounded-full border border-gray-100 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition-all group z-20">
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-500 group-hover:text-primary-600 text-sm" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3 mt-8">
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > active ? 'next' : 'prev')}
                className={`rounded-full transition-all duration-300 ${i === active ? 'bg-primary-600 w-8 h-2.5' : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'}`}
                aria-label={`Review ${i + 1}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium">{active + 1} / {count}</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { cars, setFilters } = useCars();
  const [city, setCity]             = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const carImgRef = useRef(null);

  const handleHeroMouseMove = useCallback((e) => {
    if (!heroRef.current || !carImgRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    carImgRef.current.style.transform = `translateX(${x * 18}px) translateY(${y * 10}px) rotate(${x * 1.5}deg)`;
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    if (carImgRef.current) {
      carImgRef.current.style.transform = 'translateX(0) translateY(0) rotate(0)';
    }
  }, []);

  // Show 4 featured cars — available first, then unavailable
  const featured = [
    ...cars.filter(c => c.availability),
    ...cars.filter(c => !c.availability)
  ].slice(0, 4);
  const today    = new Date().toISOString().split('T')[0];

  const handleSearch = e => {
    e.preventDefault();
    if (city) setFilters(f => ({ ...f, location: city }));
    navigate('/cars');
  };

  return (
    <div className="page-enter mt-10">

      {/* ═══════════════════ HERO — Split Layout ═══════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative overflow-hidden" style={{
        background: 'linear-gradient(150deg, #f0f4ff 0%, #f8faff 35%, #eef2f9 70%, #e8edf6 100%)',
        minHeight: 'auto',
      }}>
        {/* Background layers */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(219,234,254,0.7) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(224,231,255,0.5) 0%, transparent 70%)' }} />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #c7d2e8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.45,
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col">

          {/* ── Two-column hero grid ── */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center pt-20 sm:pt-24 lg:pt-20 pb-10 lg:pb-16">

            {/* LEFT: Text + Search */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left pt-6 lg:pt-0">
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 bg-white/80 border border-blue-200/60 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-6 shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
                Premium Car Rental · Available 24/7 · 8+ Cities
              </div>

              {/* Main heading */}
              <h1 className="font-display font-black text-gray-900 text-3xl sm:text-5xl md:text-6xl xl:text-[68px] mb-5 leading-[1.04] tracking-tight">
                Drive Your{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text" style={{
                    backgroundImage: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)'
                  }}>Dream</span>
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                    <path d="M0 3 Q50 6 100 3 Q150 0 200 3" stroke="url(#grad)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1d4ed8"/>
                        <stop offset="100%" stopColor="#7c3aed"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                {' '}Car Today
              </h1>

              <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 max-w-lg">
                World-class vehicles, seamless booking, transparent pricing,
                and unmatched customer care — across India.
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 mb-7 justify-center lg:justify-start">
                {['Free Cancellation', 'No Hidden Fees', 'Instant Confirmation', 'Fully Insured'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 bg-white/70 border border-blue-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-[10px]" />
                    {t}
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3 mb-7 justify-center lg:justify-start">
                <Link to="/cars" className="btn-primary text-sm sm:text-base px-5 sm:px-7 py-3 sm:py-3.5 shadow-lg" style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)' }}>
                  <FontAwesomeIcon icon={faCar} />
                  Browse All Cars
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 text-base">
                  Learn More
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                {STAT_NUMS.slice(0, 3).map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <FontAwesomeIcon icon={s.icon} className="text-blue-400 text-sm" />
                    <span className="font-extrabold text-gray-900 text-base">
                      <AnimCounter {...s} />
                    </span>
                    <span className="text-gray-400 text-xs">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Car Image Visual */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[420px] h-[420px] rounded-full border border-blue-200/30 animate-pulse-slow" />
                <div className="absolute w-[340px] h-[340px] rounded-full border border-blue-200/40" />
                <div className="absolute w-[260px] h-[260px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(219,234,254,0.5) 0%, transparent 70%)' }} />
              </div>

              {/* Car image container */}
              <div className="relative z-10 w-full max-w-[940px]">
                {/* Glow effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-16 rounded-full blur-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.25) 0%, transparent 70%)' }} />

                <img
                  ref={carImgRef}
                  src={hero_car}
                  alt="Premium BMW on DriveEase"
                  className="w-full object-contain drop-shadow-2xl parallax-layer"
                  style={{ filter: 'drop-shadow(0 20px 60px rgba(30,64,175,0.2))', transition: 'transform 0.15s ease-out' }}
                />

                {/* Floating info cards */}
                <div className="absolute -top-2 -left-2 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3 animate-float">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faCheck} className="text-emerald-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Fully Insured</p>
                    <p className="text-[10px] text-gray-400">Zero-risk coverage</p>
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3" style={{ animation: 'float 4s ease-in-out 2s infinite' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)' }}>
                    <FontAwesomeIcon icon={faStar} className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">4.9 ★ Rating</p>
                    <p className="text-[10px] text-gray-400">120+ happy customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Search Bar — full width below hero ── */}
          <div className="pb-10 mt-2 overflow-x-hidden px-4 sm:px-0">
            <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(59,130,246,0.15)] border border-blue-100/50 p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

                {/* Pickup Location */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)' }}>
                    <FontAwesomeIcon icon={faLocationDot} className="text-blue-600 text-xs" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pickup Location</p>
                    <select value={city} onChange={e => setCity(e.target.value)}
                      className="w-full text-sm font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer">
                      <option value="">Select your city</option>
                      {cityList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Pick-up Date */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 border-b sm:border-b-0 sm:border-r border-gray-100">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #d1fae5, #e0e7ff)' }}>
                    <FontAwesomeIcon icon={faClock} className="text-emerald-600 text-xs" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pick-up Date</p>
                    <input type="date" value={pickupDate} min={today} onChange={e => setPickupDate(e.target.value)}
                      className="w-full text-sm font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer" />
                  </div>
                </div>

                {/* Return Date */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #fef3c7, #fee2e2)' }}>
                    <FontAwesomeIcon icon={faCalendarCheck} className="text-amber-600 text-xs" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Return Date</p>
                    <input type="date" value={returnDate} min={pickupDate || today} onChange={e => setReturnDate(e.target.value)}
                      className="w-full text-sm font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer" />
                  </div>
                </div>

                {/* Search Button */}
                <button type="submit" className="flex-shrink-0 w-full sm:w-auto px-4 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)' }}>
                  <FontAwesomeIcon icon={faSearch} />
                  <span>Find Cars</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-20 border-t border-blue-100/40" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-blue-100/40">
              {STAT_NUMS.map(s => (
                <div key={s.label} className="flex items-center gap-2.5 px-4 sm:px-6 py-4 sm:py-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)' }}>
                    <FontAwesomeIcon icon={s.icon} className="text-blue-600 text-xs sm:text-sm" />
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-gray-900 text-lg sm:text-xl leading-none">
                      <AnimCounter {...s} />
                    </p>
                    <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-tag">Top Picks</p>
              <h2 className="section-title text-3xl md:text-4xl">Featured Vehicles</h2>
            </div>
            <Link to="/cars" className="hidden sm:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors">
              View All <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(car => <CarCard key={car.id} car={car} />)}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/cars" className="btn-primary">View All Cars <FontAwesomeIcon icon={faArrowRight} /></Link>
          </div>
        </div>
      </section>


      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-tag">Simple Process</p>
            <h2 className="section-title text-3xl md:text-4xl mb-3">Book in 3 Easy Steps</h2>
            <p className="section-desc max-w-md mx-auto">From search to keys in hand — the fastest rental experience in India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line desktop */}
            <div aria-hidden className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200" />
            {[
              { step: '01', title: 'Browse & Search', desc: 'Filter by city, category, or price. View full specs and photos before you decide.', color: 'bg-blue-600', light: 'bg-blue-50 text-blue-600' },
              { step: '02', title: 'Book Instantly', desc: 'Select your dates, confirm in under 2 minutes. No paperwork, no waiting.', color: 'bg-indigo-600', light: 'bg-indigo-50 text-indigo-600' },
              { step: '03', title: 'Drive & Enjoy', desc: 'Pick up at your chosen location and hit the road with full insurance included.', color: 'bg-violet-600', light: 'bg-violet-50 text-violet-600' },
            ].map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-center text-center p-7 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-card transition-all duration-300 border border-transparent hover:border-gray-100">
                <div className={`w-16 h-16 rounded-2xl ${s.light} flex items-center justify-center mb-5 text-2xl font-black font-display`}>
                  {s.step}
                </div>
                <h3 className="font-display font-bold text-gray-900 text-xl mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY CHOOSE US ═══════════════════ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <p className="section-tag">Our Advantages</p>
            <h2 className="section-title text-3xl md:text-4xl mb-4">Why Choose DriveEase?</h2>
            <p className="section-desc">We go beyond just renting cars — we deliver exceptional experiences with every booking.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all duration-300 bg-white cursor-default">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={f.icon} className="text-base" />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROMO BAND ═══════════════════ */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #1e40af 100%)' }}>
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,.5) 40px, rgba(255,255,255,.5) 41px)' }} />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <FontAwesomeIcon icon={faMedal} className="text-amber-400 text-xs" />
                Limited Time Offer
              </div>
              <h3 className="font-display font-black text-white text-3xl mb-2">First Rental? Get 15% Off</h3>
              <p className="text-primary-200 text-sm">
                Use code <strong className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md">FIRSTDRIVE</strong> at checkout.
              </p>
            </div>
            <Link to="/cars" className="bg-white text-primary-600 hover:bg-gray-50 font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0">
              Book Now <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <TestimonialsSlider />

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="hero-bg py-24 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag text-accent-400">Get Started Today</p>
          <h2 className="font-display font-black text-white text-4xl md:text-5xl mb-4">Ready to Hit the Road?</h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">Browse our premium fleet and book your dream car in under 2 minutes. No hidden fees, no surprises.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/cars" className="btn-accent px-10 py-4 text-base font-bold shadow-xl shadow-accent-600/30">
              Browse All Cars <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link to="/contact" className="border border-white/20 hover:border-white/40 hover:bg-white/8 text-white font-semibold px-10 py-4 rounded-xl transition-all duration-200 text-base">
              Contact Us
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-white/10">
            {['Free Cancellation', 'No Hidden Fees', 'Instant Confirmation', 'Fully Insured'].map(t => (
              <div key={t} className="flex items-center gap-2 text-white/60 text-sm">
                <FontAwesomeIcon icon={faCheck} className="text-emerald-400 text-xs" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
