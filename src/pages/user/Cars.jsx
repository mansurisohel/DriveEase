import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faSliders, faLocationDot, faXmark,
  faCrown, faCar, faArrowRight, faChevronDown,
  faChevronLeft, faChevronRight, faBan, faCircleInfo,
  faCheckCircle, faGauge, faStar, faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { useCars } from '../../context/CarContext';
import { cityList } from '../../assets/assets';
import CarCard from '../../components/CarCard';
import { SkeletonCard } from '../../components/Skeleton';

const PER_PAGE = 6;

const TIERS = [
  {
    id: 'standard', label: 'Standard Fleet', sub: '₹1,000 – ₹20,000 / day',
    desc: 'Hatchbacks, sedans, SUVs & MPVs — perfect for city, family and business travel.',
    icon: faCar, min: 0, max: 20000,
    grad: 'from-blue-600 to-indigo-600',
    bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800',
    border: 'border-blue-200', accent: 'text-blue-600',
    tag: 'Most Popular', tagColor: 'bg-blue-600',
    gradActive: 'linear-gradient(135deg,#1d4ed8 0%,#4f46e5 100%)',
    perks: ['Economy friendly', 'City & highway', 'Instant booking'],
    highlightColor: 'blue',
  },
  {
    id: 'premium', label: 'Premium Luxury', sub: '₹50,000 – ₹1,00,000 / day',
    desc: 'Rolls-Royce, Bentley, Ferrari, Lamborghini — for weddings, events & extraordinary occasions.',
    icon: faCrown, min: 50000, max: 100000,
    grad: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800',
    border: 'border-amber-200', accent: 'text-amber-600',
    tag: 'Exclusive', tagColor: 'bg-amber-500',
    gradActive: 'linear-gradient(135deg,#d97706 0%,#ea580c 100%)',
    perks: ['White-glove service', 'Weddings & events', 'Chauffeur ready'],
    highlightColor: 'amber',
  },
];

function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const start = Math.max(1, page - 1);
  const end   = Math.min(pages, page + 1);
  const nums  = [];
  if (start > 1) nums.push(1);
  if (start > 2) nums.push('…');
  for (let i = start; i <= end; i++) nums.push(i);
  if (end < pages - 1) nums.push('…');
  if (end < pages) nums.push(pages);
  const btn = 'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all';
  return (
    <div className="mt-10 flex flex-col items-center gap-2.5">
      <p className="text-xs text-gray-400">
        Showing <span className="font-bold text-gray-700">{(page-1)*perPage+1}–{Math.min(page*perPage,total)}</span> of <span className="font-bold text-gray-700">{total}</span> vehicles
      </p>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button onClick={() => onChange(page-1)} disabled={page===1} className={`${btn} ${page===1?'text-gray-300 cursor-not-allowed':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
        </button>
        {nums.map((n,i) => n==='…'
          ? <span key={`e${i}`} className="w-9 text-center text-gray-400 text-sm">…</span>
          : <button key={n} onClick={()=>onChange(n)} className={`${btn} ${n===page?'bg-primary-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{n}</button>
        )}
        <button onClick={() => onChange(page+1)} disabled={page===pages} className={`${btn} ${page===pages?'text-gray-300 cursor-not-allowed':'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
        </button>
      </div>
    </div>
  );
}

function PaginatedGrid({ cars, wrapClass = '' }) {
  const [page, setPage] = useState(1);
  const top = useRef(null);
  const slice = cars.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const go = (p) => { setPage(p); setTimeout(() => top.current?.scrollIntoView({behavior:'smooth',block:'start'}), 40); };
  useEffect(() => setPage(1), [cars]);
  return (
    <div ref={top} className={wrapClass}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {slice.map(car => <CarCard key={car.id} car={car} />)}
      </div>
      <Pagination total={cars.length} page={page} perPage={PER_PAGE} onChange={go} />
    </div>
  );
}

function Filters({ filters, setFilters, categories, stdCount, premCount, activeTier, setActiveTier, hasActive, clear }) {
  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const pickTier = (t) => {
    if (activeTier === t.id) { setActiveTier(null); setFilters(f => ({ ...f, minPrice: 0, maxPrice: 100000 })); }
    else { setActiveTier(t.id); setFilters(f => ({ ...f, minPrice: t.min, maxPrice: t.max })); }
  };
  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-gray-900 flex items-center gap-2">
          <FontAwesomeIcon icon={faSliders} className="text-primary-500 text-sm" /> Filters
        </h3>
        {hasActive && (
          <button onClick={clear} className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1">
            <FontAwesomeIcon icon={faXmark} /> Clear All
          </button>
        )}
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Tier</p>
        {TIERS.map(t => {
          const on = activeTier === t.id;
          return (
            <button key={t.id} onClick={() => pickTier(t)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${on ? 'text-white border-transparent shadow-md' : `bg-gray-50 text-gray-700 ${t.border} hover:bg-white`}`}
              style={on ? { background: t.gradActive } : {}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={t.icon} className="text-xs" /> {t.label}
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${on ? 'bg-white/20 text-white' : t.badge}`}>
                  {t.id === 'standard' ? stdCount : premCount}
                </span>
              </div>
              <p className={`text-[10px] mt-0.5 ml-5 ${on ? 'text-white/70' : 'text-gray-400'}`}>{t.sub}</p>
            </button>
          );
        })}
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
        <div className="relative">
          <FontAwesomeIcon icon={faLocationDot} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <select value={filters.location} onChange={e => set('location', e.target.value)} className="form-input pl-9 text-sm">
            <option value="">All Cities</option>
            {cityList.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {['', ...categories].map(cat => (
            <button key={cat || 'all'} onClick={() => set('category', cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filters.category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat || 'All'}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Price / Day</p>
          <span className="text-sm font-bold text-primary-600">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input type="range" min={1000} max={100000} step={1000}
          value={filters.maxPrice} className="w-full"
          onChange={e => { set('maxPrice', Number(e.target.value)); setActiveTier(null); }} />
        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
          <span>₹1K</span><span>₹50K</span><span>₹1L</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By</p>
        <select value={filters.sortBy} onChange={e => set('sortBy', e.target.value)} className="form-input text-sm">
          <option value="default">Default Order</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
}

/* ── Enhanced Tier Card ── */
function TierCard({ tier, count, active, onToggle }) {
  const on = active;
  return (
    <button
      onClick={onToggle}
      className={`relative overflow-hidden rounded-2xl text-left transition-all duration-300 group
        ${on ? 'shadow-2xl scale-[1.01]' : 'bg-white border-2 hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.005]'}
        ${on ? '' : tier.border}`}
      style={on ? { background: tier.gradActive } : {}}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: on ? 'rgba(255,255,255,0.4)' : 'transparent' }} />
      <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10 pointer-events-none"
        style={{ background: on ? 'rgba(255,255,255,0.3)' : 'transparent' }} />

      <div className="relative p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          {/* Icon + label */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all
              ${on ? 'bg-white/20' : `bg-gradient-to-br ${tier.grad}`}`}>
              <FontAwesomeIcon icon={tier.icon} className={`text-base ${on ? 'text-white' : 'text-white'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-display font-bold text-base leading-tight ${on ? 'text-white' : 'text-gray-900'}`}>
                  {tier.label}
                </h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${on ? 'bg-white/20 text-white' : `${tier.tagColor} text-white`}`}>
                  {tier.tag}
                </span>
              </div>
              <p className={`text-xs font-semibold mt-0.5 ${on ? 'text-white/80' : tier.accent}`}>{tier.sub}</p>
            </div>
          </div>

          {/* Vehicle count bubble */}
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 font-display
            ${on ? 'bg-white/15 border border-white/25' : `${tier.bg} border ${tier.border}`}`}>
            <span className={`font-black text-xl leading-none ${on ? 'text-white' : tier.accent}`}>{count}</span>
            <span className={`text-[9px] font-semibold leading-tight ${on ? 'text-white/70' : 'text-gray-400'}`}>vehicles</span>
          </div>
        </div>

        {/* Description */}
        <p className={`text-xs leading-relaxed mb-4 hidden sm:block ${on ? 'text-white/75' : 'text-gray-500'}`}>
          {tier.desc}
        </p>

        {/* Perks row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tier.perks.map(perk => (
            <span key={perk} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full
              ${on ? 'bg-white/15 text-white' : `${tier.badge}`}`}>
              <FontAwesomeIcon icon={faCheckCircle} className="text-[9px]" />
              {perk}
            </span>
          ))}
        </div>

        {/* Footer CTA */}
        <div className={`flex items-center justify-between pt-3 border-t ${on ? 'border-white/20' : 'border-gray-100'}`}>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${on ? 'text-white/90' : tier.accent}`}>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            {on ? 'Browsing this tier' : `Browse ${tier.label}`}
          </span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
            ${on ? 'bg-white/20 rotate-90' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
            <FontAwesomeIcon icon={faChevronRight} className={`text-[9px] ${on ? 'text-white' : 'text-gray-500'}`} />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Cars() {
  const { getFilteredCars, filters, setFilters, categories, cars: allCars } = useCars();
  const [loading, setLoading]         = useState(true);
  const [cars, setCars]               = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTier, setActiveTier]   = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('de_recent_searches') || '[]'); } catch { return []; }
  });
  const searchRef    = useRef(null);
  const searchDebounce = useRef(null);

  const hasActive    = !!(filters.location || filters.category || filters.maxPrice < 100000 || filters.minPrice > 0 || filters.sortBy !== 'default' || filters.search);
  const stdCount     = allCars.filter(c => c.availability && c.pricePerDay <= 20000).length;
  const premCount    = allCars.filter(c => c.availability && c.pricePerDay >= 50000).length;
  const totalAvail   = allCars.filter(c => c.availability).length;
  const totalUnavail = allCars.filter(c => !c.availability).length;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => { setCars(getFilteredCars()); setLoading(false); }, 380);
    return () => clearTimeout(t);
  }, [filters]);

  /* Close suggestions on outside click */
  useEffect(() => {
    const fn = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* Build suggestion list from car data */
  const suggestions = searchInput.trim().length >= 1
    ? [...new Set(
        allCars.flatMap(c => [c.brand, c.model, c.category, c.location, c.fuelType])
      )].filter(s => s && s.toLowerCase().includes(searchInput.toLowerCase()) && s.toLowerCase() !== searchInput.toLowerCase())
        .slice(0, 6)
    : [];

  const QUICK_PICKS = ['SUV', 'Sedan', 'Mumbai', 'Delhi', 'Electric', 'Luxury'];

  const commitSearch = (val) => {
    const trimmed = val.trim();
    setSearchInput(trimmed);
    setFilters(f => ({ ...f, search: trimmed }));
    setShowSuggestions(false);
    if (trimmed && !recentSearches.includes(trimmed)) {
      const updated = [trimmed, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      try { localStorage.setItem('de_recent_searches', JSON.stringify(updated)); } catch {}
    }
  };

  const handleSearchInput = (val) => {
    setSearchInput(val);
    setShowSuggestions(true);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setFilters(f => ({ ...f, search: val }));
    }, 300);
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters(f => ({ ...f, search: '' }));
    setShowSuggestions(false);
  };

  const removeRecent = (item, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r !== item);
    setRecentSearches(updated);
    try { localStorage.setItem('de_recent_searches', JSON.stringify(updated)); } catch {}
  };

  const clear = () => {
    setFilters({ location: '', category: '', minPrice: 0, maxPrice: 100000, sortBy: 'default', search: '' });
    setSearchInput('');
    setActiveTier(null);
  };
  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const filterProps = { filters, setFilters, categories, stdCount, premCount, activeTier, setActiveTier, hasActive, clear };
  const availableCars   = cars.filter(c => c.availability);
  const unavailableCars = cars.filter(c => !c.availability);

  return (
    <div className="min-h-screen bg-slate-50 page-enter mt-10">

      {/* ── Hero ── */}
      <div className="hero-bg pt-20 pb-20 relative">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Title + counters */}
          <div className="mb-7">
            <p className="section-tag text-primary-300 mb-2">Our Fleet</p>
            <h1 className="font-display font-black text-white text-3xl sm:text-4xl md:text-5xl mb-4">Browse All Cars</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
                <FontAwesomeIcon icon={faCar} className="text-white/60 text-sm" />
                <span className="text-white/90 text-sm font-semibold">{allCars.length} Total</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-emerald-300 text-sm font-semibold">{totalAvail} Available</span>
              </div>
              <div className="flex items-center gap-2 bg-red-500/15 border border-red-400/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <FontAwesomeIcon icon={faBan} className="text-red-400 text-xs" />
                <span className="text-red-300 text-sm font-semibold">{totalUnavail} Unavailable</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-400/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <FontAwesomeIcon icon={faCrown} className="text-amber-400 text-xs" />
                <span className="text-amber-300 text-sm font-semibold">{premCount} Luxury</span>
              </div>
            </div>
          </div>

          {/* ── Enhanced Search Bar ── */}
          <div className="max-w-2xl relative" style={{ zIndex: 100 }} ref={searchRef}>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 z-10 text-sm pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={e => handleSearchInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={e => { if (e.key === 'Enter') commitSearch(searchInput); if (e.key === 'Escape') setShowSuggestions(false); }}
                placeholder="Search by brand, model, city or fuel type…"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/12 backdrop-blur-md
                  border border-white/20 focus:border-white/50 text-white placeholder-white/40
                  font-medium text-sm focus:outline-none transition-all duration-200
                  focus:bg-white/18 focus:shadow-lg"
              />
              {searchInput && (
                <button onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 transition-colors">
                  <FontAwesomeIcon icon={faXmark} className="text-white text-xs" />
                </button>
              )}

              {/* Dropdown suggestions */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in" style={{ zIndex: 200 }}>
                  {/* Live suggestions */}
                  {suggestions.length > 0 && (
                    <div className="py-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 pt-1 pb-1.5">Suggestions</p>
                      {suggestions.map(s => (
                        <button key={s} onClick={() => commitSearch(s)}
                          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-primary-50 transition-colors text-left">
                          <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-xs flex-shrink-0" />
                          <span className="text-sm text-gray-700 font-medium">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recent searches */}
                  {recentSearches.length > 0 && !searchInput && (
                    <div className={`py-2 ${suggestions.length > 0 ? 'border-t border-gray-50' : ''}`}>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 pt-1 pb-1.5">Recent</p>
                      {recentSearches.map(r => (
                        <div key={r} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 group">
                          <button onClick={() => commitSearch(r)} className="flex items-center gap-3 flex-1 text-left">
                            <FontAwesomeIcon icon={faRotateLeft} className="text-gray-300 text-xs flex-shrink-0" />
                            <span className="text-sm text-gray-600">{r}</span>
                          </button>
                          <button onClick={(e) => removeRecent(r, e)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 transition-all">
                            <FontAwesomeIcon icon={faXmark} className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick picks */}
                  {!searchInput && (
                    <div className={`px-4 pt-2 pb-3 ${recentSearches.length > 0 ? 'border-t border-gray-50' : ''}`}>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Quick Search</p>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_PICKS.map(q => (
                          <button key={q} onClick={() => commitSearch(q)}
                            className="text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-100 px-2.5 py-1 rounded-lg transition-colors">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestions.length === 0 && searchInput.trim().length > 0 && (
                    <div className="px-4 py-4 text-sm text-gray-400 text-center">
                      No suggestions for "<span className="font-semibold text-gray-600">{searchInput}</span>"
                      <button onClick={() => commitSearch(searchInput)} className="block mx-auto mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700">
                        Search anyway →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {filters.search && (
              <p className="mt-2 text-white/60 text-xs">
                <span className="font-bold text-white">"{filters.search}"</span> — {cars.length} vehicle{cars.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Enhanced Tier Cards ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-0 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIERS.map(t => (
            <TierCard
              key={t.id}
              tier={t}
              count={t.id === 'standard' ? stdCount : premCount}
              active={activeTier === t.id}
              onToggle={() => {
                if (activeTier === t.id) { setActiveTier(null); setFilters(f => ({ ...f, minPrice: 0, maxPrice: 100000 })); }
                else { setActiveTier(t.id); setFilters(f => ({ ...f, minPrice: t.min, maxPrice: t.max })); }
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">

        {/* Mobile filter toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm font-semibold">
            {loading ? 'Loading…' : `${cars.length} vehicles`}
          </p>
          <button onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${hasActive ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700'}`}>
            <FontAwesomeIcon icon={faSliders} className="text-sm" />
            Filters {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />}
            <FontAwesomeIcon icon={faChevronDown} className={`text-xs transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="lg:hidden mb-5 animate-fade-in">
            <Filters {...filterProps} />
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Filters {...filterProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">

            {activeTier && (() => {
              const t = TIERS.find(x => x.id === activeTier);
              return (
                <div className={`flex items-center justify-between mb-5 px-4 py-3 rounded-xl border ${t.border} ${t.bg}`}>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={t.icon} className={`${t.accent} text-sm`} />
                    <span className={`font-semibold text-sm ${t.accent}`}>{t.label} · {t.sub}</span>
                  </div>
                  <button onClick={clear} className={`text-xs font-bold ${t.accent} flex items-center gap-1`}>
                    <FontAwesomeIcon icon={faXmark} /> View All
                  </button>
                </div>
              );
            })()}

            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-500 text-sm">
                {loading ? 'Loading…' : (
                  <>
                    <span className="font-bold text-gray-900">{cars.length}</span> vehicles found
                    {unavailableCars.length > 0 && !activeTier && (
                      <span className="ml-2 text-xs font-medium text-red-400">
                        · {unavailableCars.length} unavailable
                      </span>
                    )}
                  </>
                )}
              </p>
              <select value={filters.sortBy} onChange={e => set('sortBy', e.target.value)}
                className="hidden sm:block text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none focus:border-primary-400">
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>

            ) : cars.length === 0 ? (
              <div className="card text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-2xl" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No Cars Found</h3>
                <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">Try different keywords or adjust your filters.</p>
                <button onClick={clear} className="btn-primary">Clear All Filters</button>
              </div>

            ) : activeTier ? (
              <PaginatedGrid cars={cars} />

            ) : (
              (() => {
                const std  = availableCars.filter(c => c.pricePerDay <= 20000);
                const prem = availableCars.filter(c => c.pricePerDay >= 50000);
                const mid  = availableCars.filter(c => c.pricePerDay > 20000 && c.pricePerDay < 50000);

                return (
                  <div className="space-y-12">
                    {std.length > 0 && (
                      <section>
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faCar} className="text-white text-sm" />
                          </div>
                          <div>
                            <h2 className="font-display font-bold text-gray-900">Standard Fleet</h2>
                            <p className="text-xs text-gray-400">₹1,000 – ₹20,000 per day</p>
                          </div>
                          <span className="ml-auto text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{std.length} available</span>
                        </div>
                        <PaginatedGrid cars={std} />
                      </section>
                    )}

                    {mid.length > 0 && (<section><PaginatedGrid cars={mid} /></section>)}

                    {prem.length > 0 && (
                      <section>
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-amber-100">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#f59e0b,#ea580c)' }}>
                            <FontAwesomeIcon icon={faCrown} className="text-white text-sm" />
                          </div>
                          <div>
                            <h2 className="font-display font-bold text-gray-900">Premium Luxury</h2>
                            <p className="text-xs text-gray-400">₹50,000 – ₹1,00,000 per day</p>
                          </div>
                          <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{prem.length} exclusive</span>
                        </div>
                        <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(251,191,36,.04),rgba(234,88,12,.04))', border: '1px solid rgba(251,191,36,.18)' }}>
                          <PaginatedGrid cars={prem} />
                        </div>
                      </section>
                    )}

                    {unavailableCars.length > 0 && (
                      <section>
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-red-100">
                          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faBan} className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <h2 className="font-display font-bold text-gray-700">Currently Unavailable</h2>
                            <p className="text-xs text-gray-400">Booked or under maintenance — check back soon</p>
                          </div>
                          <span className="ml-auto text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                            {unavailableCars.length} cars
                          </span>
                        </div>
                        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
                          <FontAwesomeIcon icon={faCircleInfo} className="text-amber-500 text-sm mt-0.5 flex-shrink-0" />
                          <p className="text-amber-700 text-xs leading-relaxed">
                            These vehicles are <strong>temporarily unavailable</strong> — currently rented, under maintenance, or reserved. Check back soon or browse our available fleet above.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                          {unavailableCars.map(car => <CarCard key={car.id} car={car} />)}
                        </div>
                      </section>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
