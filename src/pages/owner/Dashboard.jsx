import { useState } from 'react';
import { useContact } from '../../context/ContactContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StatCounter from '../../components/StatCounter';
import {
  faCar, faClipboardList, faCircleCheck, faIndianRupeeSign,
  faArrowTrendUp, faArrowTrendDown, faClock, faUser,
  faCalendarDays, faBell, faChartPie, faLink,
  faEnvelope, faTag, faCheck, faTrash, faEye, faInbox,
  faCircleDot, faReply,
} from '@fortawesome/free-solid-svg-icons';
import { dummyDashboardData } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useCars } from '../../context/CarContext';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, numericValue, growth, iconBg, accent }) => (
  <div className={`owner-stat-card p-6 border-t-4 ${accent}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center`}>
        <FontAwesomeIcon icon={icon} className="text-lg" />
      </div>
      {growth !== undefined && (
        <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
          growth >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          <FontAwesomeIcon icon={growth >= 0 ? faArrowTrendUp : faArrowTrendDown} className="text-[10px]" />
          {Math.abs(growth)}%
        </div>
      )}
    </div>
    <p className="font-display font-extrabold text-gray-900 text-3xl mb-1">
      {numericValue !== undefined
        ? <StatCounter value={numericValue} duration={1400}
            prefix={value.startsWith('₹') ? '₹' : ''}
          />
        : value}
    </p>
    <p className="text-gray-400 text-sm font-medium">{label}</p>
  </div>
);


function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const STATUS_CONFIG = {
  unread:  { label: 'Unread',  cls: 'bg-red-100 text-red-700 border border-red-200',       dot: 'bg-red-500' },
  read:    { label: 'Read',    cls: 'bg-gray-100 text-gray-600 border border-gray-200',     dot: 'bg-gray-400' },
  replied: { label: 'Replied', cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
};

const SUBJECT_COLORS = {
  'Booking Support':    'bg-blue-100 text-blue-700',
  'Payment Issue':      'bg-amber-100 text-amber-700',
  'Vehicle Damage':     'bg-red-100 text-red-700',
  'Refund Request':     'bg-violet-100 text-violet-700',
  'Partnership Enquiry':'bg-emerald-100 text-emerald-700',
  'Other':              'bg-gray-100 text-gray-600',
};

function CustomerResponses() {
  const { contactMessages, markMessageRead, markMessageReplied, deleteMessage, unreadCount } = useContact();
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read' | 'replied'

  const filtered = filter === 'all' ? contactMessages : contactMessages.filter(m => m.status === filter);

  const handleExpand = (id) => {
    setExpanded(prev => (prev === id ? null : id));
    const msg = contactMessages.find(m => m.id === id);
    if (msg && msg.status === 'unread') markMessageRead(id);
  };

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-100 flex-shrink-0">
            <FontAwesomeIcon icon={faInbox} className="text-white text-sm" />
          </div>
          <div>
            <h3 className="font-display font-bold text-gray-900 text-base flex items-center gap-2">
              Customer Responses
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400">{contactMessages.length} total messages from the contact form</p>
          </div>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 flex-wrap">
          {['all', 'unread', 'read', 'replied'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f === 'all' ? `All (${contactMessages.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faInbox} className="text-gray-300 text-2xl" />
          </div>
          <p className="font-semibold text-gray-400">No messages yet</p>
          <p className="text-xs text-gray-300 mt-1">Messages from the Contact page will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {filtered.map(msg => {
            const isOpen  = expanded === msg.id;
            const cfg     = STATUS_CONFIG[msg.status] ?? STATUS_CONFIG.unread;
            const subColor = SUBJECT_COLORS[msg.subject] ?? 'bg-gray-100 text-gray-600';
            return (
              <div key={msg.id} className={`transition-colors duration-150 ${isOpen ? 'bg-violet-50/30' : 'hover:bg-gray-50/60'}`}>
                {/* Row */}
                <div className="flex items-start gap-4 px-6 py-4 cursor-pointer" onClick={() => handleExpand(msg.id)}>
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-bold text-sm">{msg.name?.[0]?.toUpperCase()}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-sm ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>
                          {msg.name}
                        </span>
                        {msg.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${subColor}`}>{msg.subject}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400">{fmtDate(msg.submittedAt)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{msg.email}</p>
                    {!isOpen && (
                      <p className="text-sm text-gray-500 mt-1 truncate">{msg.message}</p>
                    )}
                  </div>
                </div>

                {/* Expanded message */}
                {isOpen && (
                  <div className="px-6 pb-5 ml-14">
                    <div className="bg-white border border-violet-100 rounded-xl p-4 shadow-sm">
                      <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-2">Message</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <a href={`mailto:${msg.email}`}
                        className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[10px]" /> Reply via Email
                      </a>
                      {msg.status !== 'replied' && (
                        <button onClick={(e) => { e.stopPropagation(); markMessageReplied(msg.id); }}
                          className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                          <FontAwesomeIcon icon={faReply} className="text-[10px]" /> Mark as Replied
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); if (expanded === msg.id) setExpanded(null); }}
                        className="flex items-center gap-1.5 text-xs text-red-500 font-semibold hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 ml-auto">
                        <FontAwesomeIcon icon={faTrash} className="text-[10px]" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { allBookings } = useBookings();
  const { cars } = useCars();
  const data = dummyDashboardData;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const ownerName    = user?.name || 'Owner';
  const businessName = user?.businessName || 'DriveEase Fleet';
  const joinedDate   = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  // Use live allBookings if available, else fall back to dummy data
  const liveBookings      = allBookings.length > 0 ? allBookings : data.recentBookings;
  const totalBookings     = liveBookings.length;
  const completedBookings = liveBookings.filter(b => b.status === 'completed').length;
  const pendingBookings   = liveBookings.filter(b => b.status === 'pending').length;
  const liveRevenue       = liveBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || b.amount || 0), 0);
  const monthlyRevenue = liveRevenue || data.monthlyRevenue;
  const completionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;
  const recentBookings = [...liveBookings].slice(0, 6);

  const stats = [
    { icon: faCar,             label: 'Total Vehicles',  value: String(cars.length || data.totalCars),  numericValue: cars.length || data.totalCars,    iconBg: 'bg-blue-100 text-blue-600',     accent: 'border-blue-500' },
    { icon: faClipboardList,   label: 'Total Bookings',  value: String(totalBookings),  numericValue: totalBookings,  growth: data.bookingGrowth, iconBg: 'bg-violet-100 text-violet-600', accent: 'border-violet-500' },
    { icon: faCircleCheck,     label: 'Completed',       value: String(completedBookings), numericValue: completedBookings,                          iconBg: 'bg-emerald-100 text-emerald-600', accent: 'border-emerald-500' },
    { icon: faIndianRupeeSign, label: 'Total Revenue',   value: `₹${monthlyRevenue.toLocaleString()}`, numericValue: monthlyRevenue, growth: data.revenueGrowth, iconBg: 'bg-amber-100 text-amber-600', accent: 'border-amber-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Welcome Header ── */}
      <div className="card p-6 border-0 overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%)' }}>
        {/* Background decor */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {user?.avatar && !user.avatar.includes('ui-avatars') ? (
              <img src={user.avatar} alt={ownerName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/15 ring-4 ring-white/20 flex items-center justify-center flex-shrink-0 shadow-xl">
                <span className="text-white font-display font-black text-2xl">{getInitials(ownerName)}</span>
              </div>
            )}

            <div>
              <p className="text-blue-200 text-sm font-medium mb-0.5">{getGreeting()},</p>
              <h1 className="font-display font-black text-white text-xl sm:text-2xl md:text-3xl leading-tight">{ownerName}</h1>
              {businessName && businessName !== 'DriveEase Fleet' && (
                <div className="flex items-center gap-1.5 mt-1">
                  <FontAwesomeIcon icon={faChartPie} className="text-blue-300 text-xs" />
                  <span className="text-blue-200 text-xs font-medium">{businessName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2 backdrop-blur-sm">
              <FontAwesomeIcon icon={faCalendarDays} className="text-blue-200 text-sm" />
              <span className="text-white/90 text-xs font-medium">{today}</span>
            </div>
            {joinedDate && (
              <div className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faUser} className="text-blue-300 text-[10px]" />
                <span className="text-blue-300 text-xs">Member since {joinedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-lg px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-semibold">Dashboard Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Today's Quick Snapshot ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg text-gray-900">Fleet Overview</h2>
          <p className="text-gray-400 text-sm mt-0.5">Here's your performance snapshot</p>
        </div>
        <Link to="/owner/manage-bookings" className="owner-quick-action owner-quick-action-ghost text-xs">
          <FontAwesomeIcon icon={faBell} className="text-xs" />
          {pendingBookings} Pending
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Lower grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="owner-section-header">
            <div>
              <h2 className="owner-section-title">Recent Bookings</h2>
              <p className="owner-section-sub">Latest {recentBookings.length} transactions</p>
            </div>
            <Link to="/owner/manage-bookings" className="owner-quick-action owner-quick-action-ghost text-xs">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="owner-table">
              <thead>
                <tr>
                  {['Booking ID', 'Customer', 'Vehicle', 'Status', 'Amount'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => {
                  const customerLabel = b.customerName || b.customerInfo?.fullName || b.customer || 'Customer';
                  const vehicleLabel  = b.carBrand ? `${b.carBrand} ${b.carModel}` : b.car || '—';
                  const amountVal     = b.totalPrice || b.amount || 0;
                  const badgeClass = {
                    pending:   'owner-badge owner-badge-pending',
                    confirmed: 'owner-badge owner-badge-confirmed',
                    active:    'owner-badge owner-badge-active',
                    completed: 'owner-badge owner-badge-completed',
                    cancelled: 'owner-badge owner-badge-cancelled',
                  }[b.status] ?? 'owner-badge owner-badge-pending';
                  return (
                    <tr key={b.id}>
                      <td className="font-bold text-primary-600 font-mono text-xs">{b.id}</td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xs">{customerLabel[0]?.toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-gray-900 truncate max-w-[120px]">{customerLabel}</span>
                        </div>
                      </td>
                      <td className="text-gray-500 truncate max-w-[140px]">{vehicleLabel}</td>
                      <td><span className={`${badgeClass} capitalize`}>{b.status}</span></td>
                      <td className="font-bold text-gray-900">₹{amountVal.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick metrics */}
        <div className="space-y-4">
          {/* Completion rate */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-gray-900">Completion Rate</h3>
              <FontAwesomeIcon icon={faChartPie} className="text-primary-400 text-sm" />
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className="font-display font-extrabold text-4xl text-gray-900">{completionRate}%</span>
              <span className="text-emerald-600 text-sm font-semibold pb-1">On track</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-700 h-3 rounded-full transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{completedBookings} of {totalBookings} bookings completed</p>
          </div>

          {/* Revenue card */}
          <div className="card p-5 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faIndianRupeeSign} className="text-white/70" />
              <p className="text-white/70 text-sm font-medium">Total Revenue</p>
            </div>
            <p className="font-display font-extrabold text-3xl mb-2">₹{monthlyRevenue.toLocaleString()}</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
              <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(completionRate, 100)}%` }} />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
              {completionRate}% completion rate
            </div>
          </div>

          {/* Avg per booking */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faClock} className="text-amber-500 text-sm" />
              <p className="text-gray-400 text-sm font-medium">Avg. per Booking</p>
            </div>
            <p className="font-display font-extrabold text-3xl text-gray-900 mt-2">
              ₹{completedBookings > 0 ? Math.round(monthlyRevenue / completedBookings).toLocaleString() : '0'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Based on completed bookings</p>
          </div>
        </div>
      </div>

      {/* ── Customer Responses Section ── */}
      <CustomerResponses />
    </div>
  );
}
