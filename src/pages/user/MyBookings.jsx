import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardList, faCar, faCalendarDays, faLocationDot,
  faXmark, faCircleCheck, faClock, faCircleXmark, faCheck,
  faArrowRight, faTrash, faMapPin, faTriangleExclamation,
  faBan, faChevronRight, faInfoCircle, faKey,
  faRotateLeft, faCircleDot, faTruckRampBox, faHandshake,
  faClipboard, faEraser, faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

/* ─── Status config ─── */
const statusConfig = {
  pending:   { label: 'Pending Approval', icon: faClock,        cls: 'badge-pending',   desc: 'Waiting for the owner to confirm your booking.' },
  confirmed: { label: 'Confirmed',        icon: faCircleCheck,  cls: 'badge-confirmed', desc: 'Owner approved. Tap "Confirm Pickup" once you collect the car.' },
  active:    { label: 'Active Rental',    icon: faCircleDot,    cls: 'bg-purple-100 text-purple-700 badge', desc: 'You have the car. Tap "Return Car" when you\'re done.' },
  completed: { label: 'Completed',        icon: faCheck,        cls: 'badge-completed', desc: 'Trip completed and car returned. Thanks for riding with us!' },
  cancelled: { label: 'Cancelled',        icon: faCircleXmark,  cls: 'badge-cancelled', desc: '' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span className={cfg.cls}>
      <FontAwesomeIcon icon={cfg.icon} className="text-[9px]" />{cfg.label}
    </span>
  );
};

/* ─── Status Progress Tracker ── */
function StatusTracker({ booking }) {
  const steps = [
    { key: 'pending',   label: 'Placed',    icon: faClipboard },
    { key: 'confirmed', label: 'Approved',  icon: faCircleCheck },
    { key: 'active',    label: 'Picked Up', icon: faKey },
    { key: 'completed', label: 'Done',      icon: faHandshake },
  ];
  if (booking.status === 'cancelled') return null;

  const order = ['pending', 'confirmed', 'active', 'completed'];
  const currentIdx = order.indexOf(booking.status);

  return (
    <div className="flex items-center gap-0 mb-4 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const done    = i < currentIdx;
        const current = i === currentIdx;
        return (
          <div key={step.key} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1 px-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                done    ? 'bg-emerald-500 text-white' :
                current ? 'bg-primary-600 text-white ring-4 ring-primary-100' :
                          'bg-gray-100 text-gray-400'
              }`}>
                <FontAwesomeIcon icon={step.icon} className="text-[10px]" />
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${
                done ? 'text-emerald-600' : current ? 'text-primary-600' : 'text-gray-400'
              }`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 mb-4 flex-shrink-0 transition-all ${i < currentIdx ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Pickup confirm modal ─── */
function PickupModal({ booking, onConfirm, onClose }) {
  const [checked, setChecked] = useState(false);
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faKey} className="text-emerald-600 text-sm" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900">Confirm Pickup</h3>
              <p className="text-xs text-gray-400">Confirm you have received the car</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3.5">
            <div className="w-14 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              <img src={booking.carImage} alt="" className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=70'; }} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{booking.carBrand} {booking.carModel}</p>
              <p className="text-xs text-gray-400">{booking.pickupLocation} · {booking.pickupDate}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 text-xs uppercase tracking-wide">Before confirming, verify:</p>
            {['The car matches what you booked', 'Fuel level and mileage have been noted', 'You have the keys and any documents', 'You are satisfied with the car\'s condition'].map(item => (
              <div key={item} className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-gray-300 text-xs mt-0.5 flex-shrink-0" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
          <label className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl border border-primary-100 cursor-pointer">
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="mt-0.5 flex-shrink-0 accent-primary-600" />
            <span className="text-sm text-primary-800 font-medium">I confirm I have received the car in satisfactory condition and accept responsibility for it during the rental period.</span>
          </label>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={onConfirm} disabled={!checked}
            className="flex-1 btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            <FontAwesomeIcon icon={faKey} /> Confirm Pickup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Return request modal ─── */
const CONDITIONS = ['Excellent — no issues', 'Good — minor wear', 'Fair — some damage to report', 'Poor — significant issue'];

function ReturnModal({ booking, onConfirm, onClose }) {
  const [condition, setCondition] = useState('Excellent — no issues');
  const [notes, setNotes]         = useState('');
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faTruckRampBox} className="text-blue-600 text-sm" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900">Return Car</h3>
              <p className="text-xs text-gray-400">Submit your return request</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3.5">
            <div className="w-14 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              <img src={booking.carImage} alt="" className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=70'; }} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{booking.carBrand} {booking.carModel}</p>
              <p className="text-xs text-gray-400">Return at: {booking.dropoffLocation || booking.pickupLocation}</p>
            </div>
          </div>
          <div>
            <label className="form-label mb-2">Car Condition at Return</label>
            <div className="space-y-2">
              {CONDITIONS.map(c => (
                <label key={c} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${condition === c ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="condition" value={c} checked={condition === c} onChange={() => setCondition(c)} className="accent-primary-600" />
                  <span className="text-sm font-medium text-gray-700">{c}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">Additional Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Any damage, concerns, or requests for the owner…"
              className="form-input resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button onClick={() => onConfirm({ condition, notes })} className="flex-1 btn-primary">
            <FontAwesomeIcon icon={faTruckRampBox} /> Submit Return
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Cancel modal ─── */
const USER_CANCEL_REASONS = [
  { id: 'plans_changed',  label: 'Change of plans',            desc: 'My schedule or travel plans changed' },
  { id: 'better_deal',    label: 'Found a better deal',        desc: 'Got a cheaper option elsewhere' },
  { id: 'wrong_booking',  label: 'Booked by mistake',          desc: 'Wrong car, dates, or location selected' },
  { id: 'dates_changed',  label: 'Travel dates changed',       desc: 'My pickup or return dates shifted' },
  { id: 'car_preference', label: 'Changed vehicle preference', desc: 'I want a different car type' },
  { id: 'other',          label: 'Other reason',               desc: 'Something else — I\'ll explain below' },
];

function CancelModal({ booking, onConfirm, onClose }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customNote, setCustomNote]         = useState('');
  const [step, setStep]                     = useState(1);
  if (!booking) return null;

  const chosenLabel = USER_CANCEL_REASONS.find(r => r.id === selectedReason)?.label || '';
  const finalReason = selectedReason === 'other' ? (customNote.trim() || 'Other reason') : chosenLabel;
  const canProceed  = !!selectedReason && (selectedReason !== 'other' || customNote.trim().length >= 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-700 mr-1">
                <FontAwesomeIcon icon={faChevronRight} className="rotate-180 text-sm" />
              </button>
            )}
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faBan} className="text-red-500 text-sm" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-base">
                {step === 1 ? 'Why are you cancelling?' : 'Confirm Cancellation'}
              </h3>
              <p className="text-xs text-gray-400">{step === 1 ? 'This helps us improve' : 'This cannot be undone'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="flex flex-shrink-0">
          <div className={`h-0.5 flex-1 transition-all duration-300 ${step >= 1 ? 'bg-red-500' : 'bg-gray-200'}`} />
          <div className={`h-0.5 flex-1 transition-all duration-300 ${step >= 2 ? 'bg-red-500' : 'bg-gray-200'}`} />
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-2">
              {USER_CANCEL_REASONS.map(r => (
                <button key={r.id} onClick={() => setSelectedReason(r.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${selectedReason === r.id ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                  <p className="font-semibold text-gray-900 text-sm">{r.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                </button>
              ))}
              {selectedReason === 'other' && (
                <textarea value={customNote} onChange={e => setCustomNote(e.target.value)} rows={3}
                  placeholder="Please explain (min. 5 characters)…"
                  className="form-input resize-none w-full mt-2" />
              )}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-800 font-medium">Reason: <span className="font-bold">{finalReason}</span></p>
              </div>
              <p className="text-sm text-gray-500">This booking will be permanently cancelled and cannot be restored from your side.</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          {step === 1 ? (
            <>
              <button onClick={onClose} className="flex-1 btn-secondary">Keep Booking</button>
              <button onClick={() => setStep(2)} disabled={!canProceed} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                Continue
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="flex-1 btn-secondary">Go Back</button>
              <button onClick={() => onConfirm(finalReason)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faBan} className="text-xs" /> Confirm Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RemoveModal({ booking, onConfirm, onClose }) {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-gray-900">Remove from History?</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-500 mb-5">This booking will be permanently removed from your history and cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">Keep</button>
            <button onClick={onConfirm} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faTrash} className="text-xs" />Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Clear History Confirm Modal ─── */
function ClearHistoryModal({ count, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faEraser} className="text-red-500 text-sm" />
          </div>
          <div>
            <h3 className="font-display font-bold text-gray-900">Clear Past Bookings?</h3>
            <p className="text-xs text-gray-400">{count} completed &amp; cancelled booking{count !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-500 mb-2">This will permanently remove all <strong>completed</strong> and <strong>cancelled</strong> bookings from your history.</p>
          <p className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-5">⚠ Active and pending bookings will not be affected.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
            <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faEraser} className="text-xs" /> Clear {count} Booking{count !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const tabs = ['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'];
const TAB_ACTIVE = {
  all: 'bg-gray-800 text-white', pending: 'bg-amber-500 text-white',
  confirmed: 'bg-emerald-600 text-white', active: 'bg-purple-600 text-white',
  completed: 'bg-blue-600 text-white', cancelled: 'bg-red-500 text-white',
};

export default function MyBookings() {
  const { bookings, cancelBooking, removeBooking, confirmPickup, requestReturn, clearUserHistory } = useBookings();
  const { isLoggedIn } = useAuth();
  const [activeTab,      setActiveTab]      = useState('all');
  const [cancelTarget,   setCancelTarget]   = useState(null);
  const [removeTarget,   setRemoveTarget]   = useState(null);
  const [pickupTarget,   setPickupTarget]   = useState(null);
  const [returnTarget,   setReturnTarget]   = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab);
  const tabCount = (t) => t === 'all' ? bookings.length : bookings.filter(b => b.status === t).length;
  const pastBookingsCount = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length;

  return (
    <>
      <CancelModal      booking={cancelTarget}  onConfirm={(r) => { cancelBooking(cancelTarget.id, r); setCancelTarget(null); }} onClose={() => setCancelTarget(null)} />
      <RemoveModal      booking={removeTarget}  onConfirm={() => { removeBooking(removeTarget.id); setRemoveTarget(null); }}    onClose={() => setRemoveTarget(null)} />
      <PickupModal      booking={pickupTarget}  onConfirm={() => { confirmPickup(pickupTarget.id); setPickupTarget(null); }}    onClose={() => setPickupTarget(null)} />
      <ReturnModal      booking={returnTarget}  onConfirm={(d) => { requestReturn(returnTarget.id, d); setReturnTarget(null); }} onClose={() => setReturnTarget(null)} />
      {showClearModal && (
        <ClearHistoryModal
          count={pastBookingsCount}
          onConfirm={() => { clearUserHistory(); setShowClearModal(false); setActiveTab('all'); }}
          onClose={() => setShowClearModal(false)}
        />
      )}

      <div className="min-h-screen bg-slate-50 page-enter mt-10">
        {/* Hero header */}
        <div className="hero-bg py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faClipboardList} className="text-white" />
                  </div>
                  <p className="section-tag text-primary-300 mb-0">My Bookings</p>
                </div>
                <h1 className="font-display font-black text-white text-4xl mb-2">Your Rental History</h1>
                <p className="text-white/60">Track, manage, and act on all your DriveEase bookings.</p>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-shrink-0">
                {pastBookingsCount > 0 && (
                  <button
                    onClick={() => setShowClearModal(true)}
                    className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/35 border border-red-400/40 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
                  >
                    <FontAwesomeIcon icon={faEraser} className="text-xs" />
                    Clear History
                    <span className="bg-red-500/50 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pastBookingsCount}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stats row */}
            {bookings.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-8">
                {tabs.filter(t => t !== 'all').map(t => {
                  const count = tabCount(t);
                  const colors = {
                    pending: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
                    confirmed: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
                    active: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
                    completed: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
                    cancelled: 'bg-red-500/20 text-red-200 border-red-400/30',
                  };
                  return (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className={`${colors[t]} border rounded-xl p-3 text-center transition-all hover:scale-105 ${activeTab === t ? 'ring-2 ring-white/30' : ''}`}>
                      <p className="font-display font-black text-xl">{count}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80 capitalize">{t}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-7 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap capitalize transition-all flex-shrink-0 ${
                  activeTab === t ? TAB_ACTIVE[t] : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}>
                {t === 'all' ? 'All Bookings' : t.charAt(0).toUpperCase() + t.slice(1)}
                {tabCount(t) > 0 && (
                  <span className={`ml-1.5 text-xs ${activeTab === t ? 'text-white/70' : 'text-gray-400'}`}>({tabCount(t)})</span>
                )}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="card text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faClipboardList} className="text-gray-400 text-2xl" />
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-500 mb-6 text-sm">{activeTab === 'all' ? "You haven't made any bookings yet." : `No ${activeTab} bookings found.`}</p>
              {activeTab === 'all' && (
                <Link to="/cars" className="btn-primary inline-flex"><FontAwesomeIcon icon={faCar} />Browse Cars</Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(b => {
                const cfg = statusConfig[b.status] || statusConfig.pending;
                return (
                  <div key={b.id} className={`card overflow-hidden transition-all duration-300 hover:shadow-card-hover ${b.status === 'active' ? 'ring-2 ring-purple-400 ring-offset-1' : ''}`}>
                    <div className="flex flex-col sm:flex-row">
                      {/* Car image */}
                      <div className="sm:w-44 h-40 sm:h-auto flex-shrink-0 relative overflow-hidden">
                        <img src={b.carImage} alt={`${b.carBrand} ${b.carModel}`}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80'; }} />
                        {b.status === 'cancelled' && (
                          <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center">
                            <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full rotate-[-12deg] shadow">CANCELLED</span>
                          </div>
                        )}
                        {b.status === 'active' && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <span className="flex items-center gap-1.5 justify-center bg-purple-600/95 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> ACTIVE RENTAL
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-5">
                        {/* Title & price */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-display font-bold text-xl text-gray-900">{b.carBrand} {b.carModel}</h3>
                              <StatusBadge status={b.status} />
                            </div>
                            {/* Booking ID — styled like Amazon/Zomato order number */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                                <FontAwesomeIcon icon={faReceipt} className="text-gray-400 text-[9px]" />
                                <span className="font-mono font-bold text-gray-700 text-xs tracking-widest">{b.id}</span>
                              </div>
                              {b.bookedAt && (
                                <span className="text-xs text-gray-400">
                                  {new Date(b.bookedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-display font-extrabold text-2xl text-primary-600">₹{b.totalPrice.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">₹{b.pricePerDay?.toLocaleString()} / day</p>
                          </div>
                        </div>

                        {/* Status progress tracker */}
                        <StatusTracker booking={b} />

                        {/* Status hint */}
                        {b.status !== 'cancelled' && cfg.desc && (
                          <div className={`flex items-start gap-2 rounded-xl px-3 py-2 mb-3 ${
                            b.status === 'active'    ? 'bg-purple-50 border border-purple-100' :
                            b.status === 'confirmed' ? 'bg-emerald-50 border border-emerald-100' :
                            b.status === 'completed' ? 'bg-blue-50 border border-blue-100' :
                            'bg-amber-50 border border-amber-100'
                          }`}>
                            <FontAwesomeIcon icon={faInfoCircle} className={`text-xs flex-shrink-0 mt-0.5 ${
                              b.status === 'active'    ? 'text-purple-400' :
                              b.status === 'confirmed' ? 'text-emerald-500' :
                              b.status === 'completed' ? 'text-blue-400' : 'text-amber-400'
                            }`} />
                            <p className="text-xs text-gray-600">{cfg.desc}</p>
                          </div>
                        )}

                        {/* Trip details */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                          <div className="bg-slate-50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1"><FontAwesomeIcon icon={faCalendarDays} className="text-[9px]" />Pickup</div>
                            <p className="font-semibold text-gray-900 text-sm">{b.pickupDate}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1"><FontAwesomeIcon icon={faCalendarDays} className="text-[9px]" />Return</div>
                            <p className="font-semibold text-gray-900 text-sm">{b.returnDate || '—'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1"><FontAwesomeIcon icon={faLocationDot} className="text-[9px]" />Location</div>
                            <p className="font-semibold text-gray-900 text-sm">{b.pickupLocation}</p>
                          </div>
                          {b.dropoffLocation && b.dropoffLocation !== b.pickupLocation && (
                            <div className="bg-violet-50 rounded-xl p-3">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1"><FontAwesomeIcon icon={faMapPin} className="text-violet-400 text-[9px]" />Drop-off</div>
                              <p className="font-semibold text-violet-700 text-sm">{b.dropoffLocation}</p>
                            </div>
                          )}
                        </div>

                        {/* Return requested notice */}
                        {b.returnRequested && b.status === 'active' && (
                          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5 mb-4">
                            <FontAwesomeIcon icon={faTruckRampBox} className="text-blue-400 text-sm flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-0.5">Return Requested</p>
                              <p className="text-xs text-blue-800">Condition reported: <span className="font-semibold">{b.returnCondition}</span></p>
                              {b.returnNotes && <p className="text-xs text-blue-700 mt-0.5">Notes: {b.returnNotes}</p>}
                              <p className="text-xs text-blue-600 mt-0.5">Waiting for owner to confirm.</p>
                            </div>
                          </div>
                        )}

                        {/* Cancellation reason */}
                        {b.status === 'cancelled' && b.cancelReason && (
                          <div className={`flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 mb-4 text-sm ${b.cancelledBy === 'owner' ? 'bg-orange-50 border border-orange-200' : 'bg-red-50 border border-red-100'}`}>
                            <FontAwesomeIcon icon={faInfoCircle} className={`flex-shrink-0 mt-0.5 text-sm ${b.cancelledBy === 'owner' ? 'text-orange-400' : 'text-red-400'}`} />
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${b.cancelledBy === 'owner' ? 'text-orange-600' : 'text-red-600'}`}>
                                {b.cancelledBy === 'owner' ? 'Cancelled by owner' : 'Cancellation reason'}
                              </p>
                              <p className={`text-sm ${b.cancelledBy === 'owner' ? 'text-orange-800' : 'text-red-800'}`}>{b.cancelReason}</p>
                            </div>
                          </div>
                        )}

                        {/* Action row */}
                        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
                          <Link to={`/cars/${b.carId}`}
                            className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                            View Car <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                          </Link>

                          {b.status === 'confirmed' && (
                            <button onClick={() => setPickupTarget(b)}
                              className="ml-auto flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                              <FontAwesomeIcon icon={faKey} className="text-xs" /> Confirm Pickup
                            </button>
                          )}

                          {b.status === 'active' && !b.returnRequested && (
                            <button onClick={() => setReturnTarget(b)}
                              className="ml-auto flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                              <FontAwesomeIcon icon={faTruckRampBox} className="text-xs" /> Return Car
                            </button>
                          )}

                          {(b.status === 'pending' || b.status === 'confirmed') && (
                            <button onClick={() => setCancelTarget(b)}
                              className={`flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${b.status === 'confirmed' ? '' : 'ml-auto'}`}>
                              <FontAwesomeIcon icon={faBan} className="text-xs" /> Cancel
                            </button>
                          )}

                          {(b.status === 'cancelled' || b.status === 'completed') && (
                            <button onClick={() => setRemoveTarget(b)}
                              className="ml-auto flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-xs font-medium px-3 py-2 rounded-xl transition-colors">
                              <FontAwesomeIcon icon={faTrash} className="text-[10px]" />Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom clear history CTA for easy access */}
          {pastBookingsCount > 0 && activeTab !== 'pending' && activeTab !== 'confirmed' && activeTab !== 'active' && (
            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Clean up your history</p>
                <p className="text-xs text-gray-400 mt-0.5">{pastBookingsCount} past booking{pastBookingsCount !== 1 ? 's' : ''} can be cleared</p>
              </div>
              <button onClick={() => setShowClearModal(true)}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all flex-shrink-0">
                <FontAwesomeIcon icon={faEraser} className="text-xs" /> Clear History
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
