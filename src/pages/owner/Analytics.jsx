import { useState, useMemo } from 'react';
import StatCounter from '../../components/StatCounter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faIndianRupeeSign, faCar, faCalendarDays,
  faArrowTrendUp, faArrowTrendDown, faDownload, faFilter,
  faMapLocationDot, faChartPie, faStar, faBolt,
  faFireFlameCurved, faTrophy, faPercent, faUsers, faClock,
  faRotateRight, faCheckCircle, faXmarkCircle, faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';
import { useBookings } from '../../context/BookingContext';
import { useCars } from '../../context/CarContext';

/* ─── Constants ────────────────────────────────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CAR_CATEGORY_COLORS = {
  Sedan:    '#2563EB',
  SUV:      '#7C3AED',
  MPV:      '#0891B2',
  Luxury:   '#D97706',
  Premium:  '#DC2626',
  Hatchback:'#059669',
  Other:    '#64748B',
};

const PERIOD_OPTIONS = ['All Time', 'Last 12 Months', 'This Quarter', 'This Month', 'Last Month'];

/* ─── Helpers ───────────────────────────────────────────── */
function getDateRange(period) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();

  switch (period) {
    case 'This Month':
      return { from: new Date(y, m, 1), to: now };
    case 'Last Month': {
      const lm = m === 0 ? 11 : m - 1;
      const ly = m === 0 ? y - 1 : y;
      return { from: new Date(ly, lm, 1), to: new Date(y, m, 0, 23, 59, 59) };
    }
    case 'This Quarter': {
      const qStart = Math.floor(m / 3) * 3;
      return { from: new Date(y, qStart, 1), to: now };
    }
    case 'Last 12 Months':
      return { from: new Date(y - 1, m + 1, 1), to: now };
    default: // All Time
      return { from: new Date(2000, 0, 1), to: now };
  }
}

function daysBetween(dateA, dateB) {
  return Math.max(0, Math.round((new Date(dateB) - new Date(dateA)) / 86400000));
}

function growthPct(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/* ─── Sub-components ────────────────────────────────────── */
function KPICard({ icon, iconBg, iconColor, label, numericValue, prefix = '', suffix = '', growth, accent, note }) {
  const up = growth >= 0;
  return (
    <div
      className={`group relative overflow-hidden bg-white rounded-2xl border-l-4 ${accent} p-5 cursor-default
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <FontAwesomeIcon icon={icon} className={`${iconColor} text-base`} />
        </div>
        {growth !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full
            ${up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
            <FontAwesomeIcon icon={up ? faArrowTrendUp : faArrowTrendDown} className="text-[9px]" />
            {Math.abs(growth)}%
          </span>
        )}
      </div>
      <p className="font-display font-extrabold text-2xl text-gray-900 mb-0.5">
        {prefix}<StatCounter value={numericValue} duration={1200} />{suffix}
      </p>
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      {note && <p className="text-gray-300 text-[10px] mt-1">{note}</p>}
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="flex flex-col items-center justify-center h-44 text-gray-300 gap-2">
      <FontAwesomeIcon icon={faChartLine} className="text-3xl" />
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export default function Analytics() {
  const { allBookings } = useBookings();
  const { cars } = useCars();
  const [period, setPeriod] = useState('Last 12 Months');

  /* ── Date range for current period ── */
  const { from: rangeFrom, to: rangeTo } = useMemo(() => getDateRange(period), [period]);

  /* ── Previous period (same length, shifted back) ── */
  const prevRange = useMemo(() => {
    const len = rangeTo - rangeFrom;
    return { from: new Date(rangeFrom - len), to: new Date(rangeFrom - 1) };
  }, [rangeFrom, rangeTo]);

  /* ── Filter bookings to period ── */
  const filtered = useMemo(() =>
    allBookings.filter(b => {
      const d = new Date(b.bookedAt ?? 0);
      return d >= rangeFrom && d <= rangeTo;
    }), [allBookings, rangeFrom, rangeTo]);

  const prevFiltered = useMemo(() =>
    allBookings.filter(b => {
      const d = new Date(b.bookedAt ?? 0);
      return d >= prevRange.from && d <= prevRange.to;
    }), [allBookings, prevRange]);

  /* ── Build a carId→car lookup map ── */
  const carMap = useMemo(() => new Map(cars.map(c => [c.id, c])), [cars]);

  /* ── Core analytics ── */
  const stats = useMemo(() => {
    const byStatus = (arr, status) => arr.filter(b => b.status === status);

    const completed  = byStatus(filtered, 'completed');
    const confirmed  = byStatus(filtered, 'confirmed');
    const active     = byStatus(filtered, 'active');
    const pending    = byStatus(filtered, 'pending');
    const cancelled  = byStatus(filtered, 'cancelled');

    // Revenue = completed + confirmed + active bookings
    const revenue = [...completed, ...confirmed, ...active]
      .reduce((s, b) => s + (b.totalPrice || 0), 0);
    const prevRevenue = prevFiltered
      .filter(b => ['completed', 'confirmed', 'active'].includes(b.status))
      .reduce((s, b) => s + (b.totalPrice || 0), 0);

    // Unique customers
    const uniqueEmails = new Set(
      filtered.map(b => b.customerEmail || b.customerInfo?.email).filter(Boolean)
    );
    const prevUniqueEmails = new Set(
      prevFiltered.map(b => b.customerEmail || b.customerInfo?.email).filter(Boolean)
    );

    // Avg rental duration (in days)
    const durationsWithData = filtered.filter(b => b.pickupDate && b.returnDate);
    const avgDuration = durationsWithData.length
      ? (durationsWithData.reduce((s, b) => s + daysBetween(b.pickupDate, b.returnDate), 0) / durationsWithData.length).toFixed(1)
      : 0;

    // Avg revenue per booking
    const avgBookingValue = completed.length
      ? Math.round(completed.reduce((s, b) => s + (b.totalPrice || 0), 0) / completed.length)
      : 0;

    // ── Monthly trend (12 months) ──
    const revByMonth   = Array(12).fill(0);
    const bookByMonth  = Array(12).fill(0);
    // Always span the last 12 months regardless of period
    const last12Start  = new Date(); last12Start.setFullYear(last12Start.getFullYear() - 1);
    allBookings.filter(b => new Date(b.bookedAt) >= last12Start).forEach(b => {
      const monthIdx = new Date(b.bookedAt).getMonth();
      bookByMonth[monthIdx]++;
      if (['completed', 'confirmed', 'active'].includes(b.status)) {
        revByMonth[monthIdx] += (b.totalPrice || 0);
      }
    });

    // ── Category breakdown from real data ──
    const catCounts = {};
    filtered.forEach(b => {
      const car = carMap.get(b.carId);
      const cat = car?.category || 'Other';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    const catTotal = Object.values(catCounts).reduce((a, b) => a + b, 0);
    const categories = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => ({
        label,
        value: catTotal ? Math.round((count / catTotal) * 100) : 0,
        count,
        color: CAR_CATEGORY_COLORS[label] || '#64748B',
      }));

    // ── Top cities from real pickupLocation ──
    const cityRev   = {};
    const cityBook  = {};
    filtered.forEach(b => {
      const city = b.pickupLocation || 'Unknown';
      cityBook[city] = (cityBook[city] || 0) + 1;
      if (['completed', 'confirmed', 'active'].includes(b.status)) {
        cityRev[city] = (cityRev[city] || 0) + (b.totalPrice || 0);
      }
    });
    const topCities = Object.entries(cityBook)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, bookings]) => ({ city, bookings, revenue: cityRev[city] || 0 }));

    // ── Top vehicles from real data ──
    const carRevMap   = {};
    const carBookMap  = {};
    filtered.forEach(b => {
      const key = b.carId;
      carRevMap[key]  = (carRevMap[key]  || 0) + (b.totalPrice || 0);
      carBookMap[key] = (carBookMap[key] || 0) + 1;
    });
    const topCars = Object.entries(carRevMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, revenue]) => {
        const car = carMap.get(id);
        return {
          id,
          name: car ? `${car.brand} ${car.model}` : (filtered.find(b => b.carId === id)
            ? `${filtered.find(b => b.carId === id).carBrand} ${filtered.find(b => b.carId === id).carModel}`
            : id),
          bookings: carBookMap[id] || 0,
          rating:   car?.rating || 4.5,
          revenue,
        };
      });

    // ── Fleet utilization ──
    const bookedCarIds = new Set(
      byStatus(filtered, 'active').concat(byStatus(filtered, 'confirmed')).map(b => b.carId)
    );
    const totalFleet   = cars.length || 1;
    const availFleet   = cars.filter(c => c.availability).length;
    const utilRate     = Math.round((bookedCarIds.size / totalFleet) * 100);

    // ── Cancellation rate ──
    const cancelRate = filtered.length
      ? Math.round((cancelled.length / filtered.length) * 100)
      : 0;

    // ── Daily booking trend (last 30 days) ──
    const dailyMap = {};
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    filtered.filter(b => new Date(b.bookedAt) >= thirtyDaysAgo).forEach(b => {
      const day = new Date(b.bookedAt).toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const dailyLabels = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(thirtyDaysAgo); d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
    const dailyBookings = dailyLabels.map(d => dailyMap[d] || 0);

    return {
      revenue, prevRevenue,
      totalBookings: filtered.length,
      prevBookings:  prevFiltered.length,
      uniqueCustomers: uniqueEmails.size,
      prevCustomers:   prevUniqueEmails.size,
      activeFleet:  availFleet,
      activeRentals: active.length,
      avgDuration:  parseFloat(avgDuration),
      avgBookingValue,
      revByMonth, bookByMonth,
      categories, topCities, topCars,
      utilRate,
      statusCounts: {
        completed:  completed.length,
        confirmed:  confirmed.length,
        active:     active.length,
        pending:    pending.length,
        cancelled:  cancelled.length,
      },
      cancelRate,
      dailyLabels, dailyBookings,
    };
  }, [filtered, prevFiltered, carMap, cars, allBookings]);

  /* ── Derived display values ── */
  const maxRev   = Math.max(...stats.revByMonth, 1);
  const maxBook  = Math.max(...stats.bookByMonth, 1);
  const maxDaily = Math.max(...stats.dailyBookings, 1);
  const totalStatus = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);
  const avgRating = cars.length
    ? (cars.reduce((s, c) => s + (c.rating || 4.5), 0) / cars.length).toFixed(1)
    : '4.5';

  const revenueGrowth   = growthPct(stats.revenue, stats.prevRevenue);
  const bookingGrowth   = growthPct(stats.totalBookings, stats.prevBookings);
  const customerGrowth  = growthPct(stats.uniqueCustomers, stats.prevCustomers);

  /* ── Donut segments ── */
  let offset = 0;
  const donutSegments = stats.categories.map(cat => {
    const circ = 2 * Math.PI * 42;
    const dash = (cat.value / 100) * circ;
    const gap  = circ - dash;
    const seg  = { ...cat, dash, gap, offset };
    offset += dash;
    return seg;
  });

  /* ── Export CSV ── */
  const handleExport = () => {
    const rows = [
      ['Booking ID', 'Car', 'Customer', 'Status', 'Pickup Date', 'Return Date', 'Location', 'Amount (₹)', 'Booked At'],
      ...filtered.map(b => [
        b.id, `${b.carBrand} ${b.carModel}`,
        b.customerName || b.customerInfo?.fullName || 'N/A',
        b.status,
        b.pickupDate || '', b.returnDate || '',
        b.pickupLocation || '',
        b.totalPrice || 0,
        b.bookedAt ? new Date(b.bookedAt).toLocaleString() : '',
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `driveease-analytics-${period.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasData = filtered.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Analytics</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Live performance from <span className="text-primary-600 font-semibold">{filtered.length}</span> bookings
            in period · <span className="text-gray-500">{allBookings.length} total tracked</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="form-input py-2 pr-8 text-sm appearance-none min-w-[160px]"
            >
              {PERIOD_OPTIONS.map(p => <option key={p}>{p}</option>)}
            </select>
            <FontAwesomeIcon icon={faFilter} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>
          <button onClick={handleExport} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
            <FontAwesomeIcon icon={faDownload} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={faIndianRupeeSign} iconBg="bg-blue-100" iconColor="text-blue-600"
          label="Total Revenue" prefix="₹"
          numericValue={Math.round(stats.revenue / 1000)} suffix="K"
          growth={period !== 'All Time' ? revenueGrowth : undefined}
          accent="border-blue-500"
          note={period !== 'All Time' ? 'vs previous period' : undefined}
        />
        <KPICard
          icon={faCalendarDays} iconBg="bg-violet-100" iconColor="text-violet-600"
          label="Bookings" numericValue={stats.totalBookings}
          growth={period !== 'All Time' ? bookingGrowth : undefined}
          accent="border-violet-500"
          note={period !== 'All Time' ? 'vs previous period' : undefined}
        />
        <KPICard
          icon={faStar} iconBg="bg-amber-100" iconColor="text-amber-600"
          label="Avg Fleet Rating"
          numericValue={parseFloat(avgRating) * 10}
          suffix={`/50`}
          accent="border-amber-500"
        />
        <KPICard
          icon={faCar} iconBg="bg-emerald-100" iconColor="text-emerald-600"
          label="Available Vehicles" numericValue={stats.activeFleet}
          accent="border-emerald-500"
          note={`of ${cars.length} total fleet`}
        />
      </div>

      {/* ── Quick Highlights ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: faUsers,            label: 'Unique Customers',  value: stats.uniqueCustomers,      color: 'text-blue-600',   bg: 'bg-blue-50',   growth: period !== 'All Time' ? customerGrowth : undefined },
          { icon: faFireFlameCurved,  label: 'Active Rentals',   value: stats.activeRentals,        color: 'text-purple-600', bg: 'bg-purple-50' },
          { icon: faClock,            label: 'Avg Rental (days)', value: stats.avgDuration || '–',   color: 'text-teal-600',   bg: 'bg-teal-50'   },
          { icon: faPercent,          label: 'Cancel Rate',       value: `${stats.cancelRate}%`,     color: 'text-red-600',    bg: 'bg-red-50'    },
        ].map(({ icon, label, value, color, bg, growth }) => (
          <div key={label} className={`${bg} rounded-xl p-4 flex items-center gap-3
            hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <FontAwesomeIcon icon={icon} className={`${color} text-sm`} />
            </div>
            <div className="min-w-0">
              <p className={`font-display font-black text-xl ${color}`}>{value}</p>
              <p className="text-gray-500 text-[11px] font-medium leading-tight">{label}</p>
              {growth !== undefined && (
                <p className={`text-[10px] font-bold ${growth >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                  {growth >= 0 ? '+' : ''}{growth}% vs prev
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue/Bookings Monthly Trend + Category Donut ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Monthly trend chart */}
        <div className="lg:col-span-2 card p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-primary-500 text-sm" />
                Monthly Revenue & Bookings
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">Last 12 months · all bookings</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-600 inline-block" />Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-violet-400 inline-block" />Bookings
              </span>
            </div>
          </div>

          {stats.revByMonth.every(v => v === 0) && stats.bookByMonth.every(v => v === 0) ? (
            <EmptyChart label="No booking data for the last 12 months" />
          ) : (
            <div className="flex items-end gap-1 h-44 px-1">
              {stats.revByMonth.map((rev, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group cursor-default">
                  <div className="w-full flex flex-col items-center gap-0.5 relative">
                    {/* Tooltip */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 hidden group-hover:flex
                      flex-col items-center z-20 pointer-events-none">
                      <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg whitespace-nowrap shadow-xl text-center">
                        <div>₹{(rev / 1000).toFixed(0)}K revenue</div>
                        <div className="text-gray-300">{stats.bookByMonth[i]} bookings</div>
                      </div>
                      <div className="w-1.5 h-1.5 bg-gray-900 rotate-45 -mt-[3px]" />
                    </div>
                    {/* Bookings bar */}
                    <div
                      className="w-full bg-violet-300/50 group-hover:bg-violet-400 rounded-t transition-all duration-300"
                      style={{ height: `${(stats.bookByMonth[i] / maxBook) * 38}px` }}
                    />
                    {/* Revenue bar */}
                    <div
                      className="w-full rounded-t transition-all duration-300 group-hover:brightness-110"
                      style={{
                        height: `${(rev / maxRev) * 96}px`,
                        background: 'linear-gradient(to top,#1d4ed8,#3b82f6)',
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium mt-1">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400">Peak Month</p>
              <p className="font-display font-bold text-gray-900">
                {stats.revByMonth.every(v => v === 0) ? '–' : MONTHS[stats.revByMonth.indexOf(maxRev)]}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg Monthly Rev</p>
              <p className="font-display font-bold text-gray-900">
                ₹{Math.round(stats.revByMonth.reduce((a, b) => a + b, 0) / 12 / 1000)}K
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg Booking Value</p>
              <p className="font-display font-bold text-gray-900">
                {stats.avgBookingValue ? `₹${(stats.avgBookingValue / 1000).toFixed(1)}K` : '–'}
              </p>
            </div>
          </div>
        </div>

        {/* Category donut */}
        <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-gray-900">By Category</h2>
            <FontAwesomeIcon icon={faChartPie} className="text-gray-400" />
          </div>

          {stats.categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-300 gap-2">
              <FontAwesomeIcon icon={faChartPie} className="text-2xl" />
              <p className="text-xs">No category data yet</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-5">
                <svg viewBox="0 0 120 120" className="w-32 h-32">
                  {donutSegments.map(seg => (
                    <circle
                      key={seg.label} cx="60" cy="60" r="42" fill="none"
                      stroke={seg.color} strokeWidth="16"
                      strokeDasharray={`${seg.dash} ${seg.gap}`}
                      strokeDashoffset={-seg.offset}
                      transform="rotate(-90 60 60)"
                      className="transition-all duration-500"
                    />
                  ))}
                  <circle cx="60" cy="60" r="34" fill="white" />
                  <text x="60" y="57" textAnchor="middle"
                    style={{ fontSize: 13, fontWeight: 800, fill: '#0F172A', fontFamily: 'Outfit' }}>
                    {filtered.length}
                  </text>
                  <text x="60" y="68" textAnchor="middle"
                    style={{ fontSize: 6.5, fill: '#94A3B8', fontWeight: 600 }}>trips</text>
                </svg>
              </div>
              <div className="space-y-2.5">
                {stats.categories.slice(0, 5).map(({ label, value, count, color }) => (
                  <div key={label} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform duration-200"
                        style={{ background: color }}
                      />
                      <span className="text-sm text-gray-600 font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">{count}</span>
                      <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${value}%`, background: color }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-8 text-right">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Last 30 Days Daily Bookings sparkline ── */}
      <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faBolt} className="text-amber-500 text-sm" />
              Daily Bookings · Last 30 Days
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Total {stats.dailyBookings.reduce((a, b) => a + b, 0)} bookings in this window
            </p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-2xl text-gray-900">{maxDaily}</p>
            <p className="text-xs text-gray-400">peak day</p>
          </div>
        </div>
        <div className="flex items-end gap-0.5 h-20">
          {stats.dailyBookings.map((count, i) => (
            <div
              key={i}
              className="flex-1 group relative cursor-default"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
            >
              {/* Tooltip */}
              {count > 0 && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 hidden group-hover:flex
                  flex-col items-center z-10 pointer-events-none">
                  <div className="bg-gray-800 text-white text-[9px] font-bold px-1.5 py-1 rounded whitespace-nowrap">
                    {count} · {stats.dailyLabels[i]?.slice(5)}
                  </div>
                  <div className="w-1 h-1 bg-gray-800 rotate-45 -mt-[2px]" />
                </div>
              )}
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  count === maxDaily ? 'bg-amber-400' : count > 0 ? 'bg-primary-400 group-hover:bg-primary-500' : 'bg-gray-100'
                }`}
                style={{ height: `${(count / maxDaily) * 64 + (count > 0 ? 4 : 0)}px` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-gray-300">
          <span>{stats.dailyLabels[0]?.slice(5)}</span>
          <span>{stats.dailyLabels[14]?.slice(5)}</span>
          <span>{stats.dailyLabels[29]?.slice(5)}</span>
        </div>
      </div>

      {/* ── Top Cities + Top Vehicles ── */}
      <div className="grid lg:grid-cols-2 gap-5">

        {/* Top Cities */}
        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="font-display font-semibold text-gray-900">Top Pickup Cities</h2>
              <p className="text-xs text-gray-400 mt-0.5">From actual booking locations</p>
            </div>
            <FontAwesomeIcon icon={faMapLocationDot} className="text-primary-400" />
          </div>

          {stats.topCities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-300 gap-2 p-6">
              <FontAwesomeIcon icon={faMapLocationDot} className="text-2xl" />
              <p className="text-xs">No city data in this period</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.topCities.map(({ city, bookings, revenue }, i) => (
                <div key={city} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group cursor-default">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black
                    group-hover:scale-110 transition-transform duration-200
                    ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-50 text-orange-700' : 'bg-primary-50 text-primary-600'}`}>
                    {i === 0 ? <FontAwesomeIcon icon={faTrophy} className="text-[10px]" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{city}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${stats.topCities[0].bookings > 0 ? (bookings / stats.topCities[0].bookings) * 100 : 0}%`,
                            background: 'linear-gradient(to right,#2563eb,#1d4ed8)',
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 font-medium flex-shrink-0">{bookings} trips</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">
                      {revenue > 0 ? `₹${(revenue / 1000).toFixed(0)}K` : '–'}
                    </p>
                    <p className="text-xs text-gray-400">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Vehicles */}
        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="font-display font-semibold text-gray-900">Top Vehicles</h2>
              <p className="text-xs text-gray-400 mt-0.5">Best performers by revenue earned</p>
            </div>
            <FontAwesomeIcon icon={faCar} className="text-emerald-400" />
          </div>

          {stats.topCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-300 gap-2 p-6">
              <FontAwesomeIcon icon={faCar} className="text-2xl" />
              <p className="text-xs">No vehicle data in this period</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stats.topCars.map(({ name, bookings, rating, revenue }, i) => (
                <div key={name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group cursor-default">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black
                    group-hover:scale-110 transition-transform duration-200
                    ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                    {i === 0 ? <FontAwesomeIcon icon={faTrophy} className="text-[10px]" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FontAwesomeIcon icon={faStar} className="text-amber-400 text-[10px]" />
                      <span className="text-xs text-gray-400 font-medium">
                        {typeof rating === 'number' ? rating.toFixed(1) : rating} · {bookings} {bookings === 1 ? 'booking' : 'bookings'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">₹{(revenue / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-gray-400">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Booking Status Breakdown ── */}
      <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="font-display font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartPie} className="text-primary-500 text-sm" />
          Booking Status Breakdown
          <span className="text-xs font-normal text-gray-400 ml-1">({totalStatus} in period)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { key: 'confirmed', label: 'Confirmed', icon: faCheckCircle,   color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { key: 'completed', label: 'Completed', icon: faRotateRight,   color: 'bg-blue-500',    textColor: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
            { key: 'active',    label: 'Active',    icon: faBolt,          color: 'bg-purple-500',  textColor: 'text-purple-700',  bg: 'bg-purple-50',  border: 'border-purple-200'  },
            { key: 'pending',   label: 'Pending',   icon: faHourglassHalf, color: 'bg-amber-500',   textColor: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
            { key: 'cancelled', label: 'Cancelled', icon: faXmarkCircle,   color: 'bg-red-500',     textColor: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200'     },
          ].map(({ key, label, icon, color, textColor, bg, border }) => {
            const count = stats.statusCounts[key] || 0;
            const pct   = totalStatus ? Math.round((count / totalStatus) * 100) : 0;
            return (
              <div key={key} className={`${bg} border ${border} rounded-2xl p-4 text-center
                hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default`}>
                <FontAwesomeIcon icon={icon} className={`${textColor} text-lg mb-2`} />
                <p className={`font-display font-black text-3xl ${textColor}`}>{count}</p>
                <p className="text-gray-600 text-xs font-semibold mt-1">{label}</p>
                <div className="w-full bg-white/70 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
                <p className={`text-xs font-bold mt-1.5 ${textColor}`}>{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Fleet Utilisation ── */}
      <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faCar} className="text-primary-500 text-sm" />
            Fleet Overview
          </h2>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />Unavailable
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Fleet',    value: cars.length,               sub: 'all vehicles',          color: 'text-gray-800' },
            { label: 'Available Now',  value: stats.activeFleet,         sub: 'ready to rent',         color: 'text-emerald-600' },
            { label: 'Active Rentals', value: stats.activeRentals,       sub: 'currently out',         color: 'text-purple-600' },
            { label: 'Utilisation',    value: `${stats.utilRate}%`,      sub: 'confirmed + active',    color: 'text-primary-600' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 text-center cursor-default hover:bg-gray-100 transition-colors">
              <p className={`font-display font-black text-3xl ${color}`}>{value}</p>
              <p className="text-gray-700 text-xs font-semibold mt-1">{label}</p>
              <p className="text-gray-400 text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
        {/* Utilisation bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Fleet utilisation rate</span>
            <span className="font-bold text-gray-600">{stats.utilRate}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${stats.utilRate}%`,
                background: stats.utilRate > 70
                  ? 'linear-gradient(to right,#10b981,#059669)'
                  : stats.utilRate > 40
                    ? 'linear-gradient(to right,#3b82f6,#1d4ed8)'
                    : 'linear-gradient(to right,#f59e0b,#d97706)',
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}