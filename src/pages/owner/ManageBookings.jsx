import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faCircleCheck, faCircleXmark, faFlag, faRotateLeft,
  faXmark, faUser, faPhone, faEnvelope, faCalendarDays,
  faLocationDot, faCarSide, faChevronDown, faChevronUp,
  faIdCard, faBan, faTriangleExclamation, faInfoCircle, faChevronRight,
  faKey, faTruckRampBox, faHandshake, faEraser, faTrash,
  faCheckDouble, faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { useBookings } from '../../context/BookingContext';

/* ─── Status badge map ─── */
const STATUS = {
  pending:   'badge-pending',
  confirmed: 'badge-confirmed',
  active:    'bg-purple-100 text-purple-700 badge',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

const TAB_COLORS = {
  all:       'bg-gray-700 text-white',
  pending:   'bg-amber-500 text-white',
  confirmed: 'bg-emerald-600 text-white',
  active:    'bg-purple-600 text-white',
  completed: 'bg-blue-600 text-white',
  cancelled: 'bg-red-500 text-white',
};

/* ─── Owner cancel reasons ─── */
const OWNER_CANCEL_REASONS = [
  { id: 'vehicle_unavailable', label: 'Vehicle unavailable',          desc: 'The requested car is not available on those dates' },
  { id: 'maintenance',         label: 'Vehicle under maintenance',    desc: 'The car needs servicing or repairs' },
  { id: 'verification_failed', label: 'Customer verification failed', desc: 'ID or licence could not be verified' },
  { id: 'duplicate',           label: 'Duplicate booking',            desc: 'Customer made multiple bookings for the same period' },
  { id: 'force_majeure',       label: 'Force majeure / Emergency',    desc: 'Unforeseen event outside our control' },
  { id: 'policy_violation',    label: 'Policy violation',             desc: 'Booking violates rental terms or conditions' },
  { id: 'other',               label: 'Other reason',                 desc: "Something else — I'll explain below" },
];

/* ─── Owner Cancel Modal ─── */
function OwnerCancelModal({ booking, onConfirm, onClose }) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customNote,     setCustomNote]     = useState('');
  const [step,           setStep]           = useState(1);

  if (!booking) return null;

  const chosenLabel = OWNER_CANCEL_REASONS.find(r => r.id === selectedReason)?.label || '';
  const finalReason = selectedReason === 'other'
    ? (customNote.trim() || 'Other reason')
    : chosenLabel;
  const canProceed = !!selectedReason && (selectedReason !== 'other' || customNote.trim().length >= 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <FontAwesomeIcon icon={faChevronRight} className="rotate-180 text-sm" />
              </button>
            )}
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-orange-500 text-sm" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-base">
                {step === 1 ? 'Reason for Cancellation' : 'Confirm & Notify Customer'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {step === 1 ? 'Customer will be notified with this reason' : 'This cannot be undone'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex flex-shrink-0">
          <div className={`h-0.5 flex-1 transition-all duration-300 ${step >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />
          <div className={`h-0.5 flex-1 transition-all duration-300 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* Booking summary */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3.5 mb-5">
            <div className="w-14 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              <img src={booking.carImage} alt="" className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=70'; }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-sm truncate">{booking.carBrand} {booking.carModel}</p>
              <p className="text-xs text-gray-400">{booking.pickupDate} → {booking.returnDate || '—'}</p>
              {(booking.customerName || booking.customerInfo?.fullName) && (
                <p className="text-xs text-primary-600 font-medium mt-0.5">
                  {booking.customerName || booking.customerInfo?.fullName}
                </p>
              )}
            </div>
            <p className="font-display font-extrabold text-primary-600 text-base flex-shrink-0">
              ₹{booking.totalPrice?.toLocaleString('en-IN')}
            </p>
          </div>

          {step === 1 && (
            <>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select cancellation reason</p>
              <div className="space-y-2 mb-4">
                {OWNER_CANCEL_REASONS.map(r => (
                  <button key={r.id} type="button" onClick={() => setSelectedReason(r.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-150 ${
                      selectedReason === r.id
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-100 hover:border-gray-300 hover:bg-slate-50'
                    }`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedReason === r.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                    }`}>
                      {selectedReason === r.id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold leading-tight ${selectedReason === r.id ? 'text-orange-700' : 'text-gray-800'}`}>
                        {r.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {selectedReason === 'other' && (
                <div className="mb-4">
                  <textarea
                    value={customNote}
                    onChange={e => setCustomNote(e.target.value)}
                    placeholder="Describe the reason in detail (min. 5 characters)…"
                    rows={3}
                    className="form-input resize-none text-sm"
                    autoFocus
                  />
                  <p className="text-xs text-gray-400 mt-1">{customNote.length} chars · min 5 required</p>
                </div>
              )}
              <button disabled={!canProceed} onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                  bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 disabled:cursor-not-allowed mt-2">
                Review & Confirm
                <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-start gap-2.5 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="text-orange-400 flex-shrink-0 mt-0.5 text-sm" />
                <div>
                  <p className="text-xs text-orange-600 font-bold uppercase tracking-wide mb-0.5">Cancellation reason</p>
                  <p className="text-sm font-medium text-orange-900">{finalReason}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-blue-800">
                <FontAwesomeIcon icon={faInfoCircle} className="flex-shrink-0 mt-0.5 text-blue-400" />
                <p>The customer will see this reason in their booking history. Any applicable refund will be processed within <strong>5–7 business days</strong>.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                  Go Back
                </button>
                <button onClick={() => onConfirm(finalReason)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faBan} className="text-xs" />
                  Cancel Booking
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Single booking card ─── */
function BookingCard({ b, approveBooking, rejectBooking, updateStatus, ownerCancelBooking, markHandedOver, completeReturn, ownerRemoveBooking }) {
  const [expanded,         setExpanded]         = useState(false);
  const [showCancelModal,  setShowCancelModal]  = useState(false);
  const [returnNote,       setReturnNote]       = useState('');
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);

  const name   = b.customerName  || b.customerInfo?.fullName  || '—';
  const email  = b.customerEmail || b.customerInfo?.email     || '—';
  const phone  = b.customerPhone || b.customerInfo?.phone     || '—';
  const idType   = b.customerInfo?.idType   || null;
  const idNumber = b.customerInfo?.idNumber || null;
  const notes    = b.customerInfo?.notes    || null;
  const hasCustomer = name !== '—';

  const isNew = b.bookedAt && (Date.now() - new Date(b.bookedAt).getTime()) < 30 * 60 * 1000;

  return (
    <>
      {showCancelModal && (
        <OwnerCancelModal
          booking={b}
          onConfirm={(reason) => { ownerCancelBooking(b.id, reason); setShowCancelModal(false); }}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      {showReturnConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faHandshake} className="text-blue-600 text-sm" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">Confirm Car Return</h3>
                <p className="text-xs text-gray-400">{b.carBrand} {b.carModel}</p>
              </div>
            </div>
            {b.returnCondition && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-4">
                <p className="text-xs text-blue-700 font-semibold">Customer reported condition:</p>
                <p className="text-sm text-blue-900 font-bold">{b.returnCondition}</p>
                {b.returnNotes && <p className="text-xs text-blue-700 mt-0.5">{b.returnNotes}</p>}
              </div>
            )}
            <div className="mb-4">
              <label className="form-label text-xs">Your notes (optional)</label>
              <textarea value={returnNote} onChange={e => setReturnNote(e.target.value)}
                rows={2} placeholder="Any observations about the returned car…"
                className="form-input resize-none text-sm" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReturnConfirm(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
              <button onClick={() => { completeReturn(b.id, { notes: returnNote }); setShowReturnConfirm(false); }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faHandshake} /> Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`card overflow-hidden transition-all duration-300 ${isNew ? 'ring-2 ring-primary-400 ring-offset-1' : ''} ${b.status === 'active' ? 'ring-2 ring-purple-400 ring-offset-1' : ''}`}>
        <div className="flex flex-col sm:flex-row">
          {/* Car image */}
          <div className="sm:w-44 h-36 sm:h-auto flex-shrink-0 relative">
            <img src={b.carImage} alt={`${b.carBrand} ${b.carModel}`}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=300&q=80'; }} />
            {b.status === 'cancelled' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full rotate-[-10deg]">CANCELLED</span>
              </div>
            )}
            {b.status === 'active' && (
              <div className="absolute bottom-2 left-2 right-2">
                <span className="flex items-center gap-1 justify-center bg-purple-600/95 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> ACTIVE
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 min-w-0">
            {/* Title row */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-lg text-gray-900 truncate">{b.carBrand} {b.carModel}</h3>
                  <span className={`${STATUS[b.status] || 'badge-pending'} capitalize`}>{b.status}</span>
                  {isNew && <span className="inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-full bg-primary-600 text-white tracking-wide">NEW</span>}
                </div>
                <p className="text-xs text-gray-400">
                  ID: <span className="font-semibold text-gray-600 font-mono">{b.id}</span>
                  {b.bookedAt && (
                    <span className="ml-3">
                      {new Date(b.bookedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </p>
              </div>
              <p className="font-display font-extrabold text-xl text-primary-600 flex-shrink-0">
                ₹{b.totalPrice?.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Date / location grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
              {[
                { icon: faCalendarDays, label: 'Pickup',   value: b.pickupDate  || '—' },
                { icon: faCalendarDays, label: 'Return',   value: b.returnDate  || '—' },
                { icon: faLocationDot,  label: 'Location', value: b.pickupLocation || '—' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <FontAwesomeIcon icon={icon} className="text-primary-400 text-[9px]" />{label}
                  </p>
                  <p className="font-semibold text-gray-900 text-sm truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Return request alert */}
            {b.returnRequested && b.status === 'active' && (
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2.5 mb-4">
                <FontAwesomeIcon icon={faTruckRampBox} className="text-blue-500 text-sm flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-0.5">Return Requested by Customer</p>
                  <p className="text-xs text-blue-800">Condition: <span className="font-semibold">{b.returnCondition}</span></p>
                  {b.returnNotes && <p className="text-xs text-blue-700 mt-0.5">Notes: {b.returnNotes}</p>}
                </div>
                <button onClick={() => setShowReturnConfirm(true)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                  <FontAwesomeIcon icon={faHandshake} className="text-[10px]" /> Confirm Return
                </button>
              </div>
            )}

            {/* Cancellation reason */}
            {b.status === 'cancelled' && b.cancelReason && (
              <div className={`flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 mb-4 text-sm ${
                b.cancelledBy === 'owner'
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-red-50 border border-red-100'
              }`}>
                <FontAwesomeIcon icon={faInfoCircle} className={`flex-shrink-0 mt-0.5 ${b.cancelledBy === 'owner' ? 'text-orange-400' : 'text-red-400'}`} />
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${b.cancelledBy === 'owner' ? 'text-orange-600' : 'text-red-600'}`}>
                    {b.cancelledBy === 'owner' ? 'Cancelled by you' : 'Cancelled by customer'}
                  </p>
                  <p className={b.cancelledBy === 'owner' ? 'text-orange-900' : 'text-red-800'}>{b.cancelReason}</p>
                </div>
              </div>
            )}

            {/* Customer info strip */}
            {hasCustomer && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-4">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-primary-600 text-xs" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
                <button onClick={() => setExpanded(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors flex-shrink-0">
                  {expanded ? 'Hide' : 'Details'}
                  <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} className="text-[10px]" />
                </button>
              </div>
            )}

            {/* Expanded customer details */}
            {expanded && hasCustomer && (
              <div className="mb-4 bg-gray-50 border border-gray-100 rounded-xl p-4 grid sm:grid-cols-2 gap-3">
                {[
                  { icon: faUser,     label: 'Full Name', value: name  },
                  { icon: faPhone,    label: 'Phone',     value: phone },
                  { icon: faEnvelope, label: 'Email',     value: email },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <FontAwesomeIcon icon={icon} className="text-gray-400 text-xs mt-1 flex-shrink-0 w-3" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                    </div>
                  </div>
                ))}
                {idType && idNumber && (
                  <div className="flex items-start gap-2.5">
                    <FontAwesomeIcon icon={faIdCard} className="text-gray-400 text-xs mt-1 flex-shrink-0 w-3" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{idType}</p>
                      <p className="text-sm font-semibold text-gray-800 font-mono">{idNumber}</p>
                    </div>
                  </div>
                )}
                {notes && (
                  <div className="flex items-start gap-2.5 sm:col-span-2">
                    <FontAwesomeIcon icon={faCarSide} className="text-gray-400 text-xs mt-1 flex-shrink-0 w-3" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Special Requests</p>
                      <p className="text-sm text-gray-700">{notes}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              {b.status === 'pending' && (
                <>
                  <button onClick={() => approveBooking(b.id)}
                    className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <FontAwesomeIcon icon={faCircleCheck} /> Approve
                  </button>
                  <button onClick={() => rejectBooking(b.id)}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                    <FontAwesomeIcon icon={faCircleXmark} /> Reject
                  </button>
                </>
              )}

              {b.status === 'confirmed' && (
                <button onClick={() => markHandedOver(b.id)}
                  className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  <FontAwesomeIcon icon={faKey} /> Mark as Handed Over
                </button>
              )}

              {b.status === 'active' && !b.returnRequested && (
                <button onClick={() => setShowReturnConfirm(true)}
                  className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  <FontAwesomeIcon icon={faFlag} /> Complete Return
                </button>
              )}

              {(b.status === 'pending' || b.status === 'confirmed') && (
                <button onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 hover:text-orange-700 text-xs font-bold px-4 py-2 rounded-xl transition-all">
                  <FontAwesomeIcon icon={faBan} className="text-[10px]" /> Cancel Booking
                </button>
              )}

              {b.status === 'cancelled' && (
                <button onClick={() => updateStatus(b.id, 'pending')}
                  className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  <FontAwesomeIcon icon={faRotateLeft} /> Restore
                </button>
              )}

              {(b.status === 'cancelled' || b.status === 'completed') && (
                <button onClick={() => ownerRemoveBooking(b.id)}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-xs font-medium px-3 py-2 rounded-xl transition-colors ml-auto">
                  <FontAwesomeIcon icon={faTrash} className="text-[10px]" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Clear History Modal ─── */
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
            <p className="text-xs text-gray-400">{count} completed &amp; cancelled booking{count !== 1 ? 's' : ''} across all users</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-500 mb-2">
            This will permanently remove all <strong>completed</strong> and <strong>cancelled</strong> bookings from the entire system.
          </p>
          <p className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-5">
            ⚠ Active and pending bookings will not be affected. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
            <button onClick={onConfirm}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faEraser} className="text-xs" /> Clear {count} Booking{count !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ManageBookings page ─── */
export default function ManageBookings() {
  const {
    allBookings, approveBooking, rejectBooking, ownerCancelBooking,
    updateStatus, markHandedOver, completeReturn,
    clearOwnerHistory, ownerRemoveBooking,
  } = useBookings();

  const [filter,         setFilter]         = useState('all');
  const [search,         setSearch]         = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [sortBy,         setSortBy]         = useState('newest');

  /* ── Derived counts ── */
  const counts = useMemo(() => ({
    all:       allBookings.length,
    pending:   allBookings.filter(b => b.status === 'pending').length,
    confirmed: allBookings.filter(b => b.status === 'confirmed').length,
    active:    allBookings.filter(b => b.status === 'active').length,
    completed: allBookings.filter(b => b.status === 'completed').length,
    cancelled: allBookings.filter(b => b.status === 'cancelled').length,
  }), [allBookings]);

  /* ── Filtered + sorted list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = allBookings.filter(b => {
      const matchFilter = filter === 'all' || b.status === filter;
      const matchSearch = !q || `${b.carBrand} ${b.carModel} ${b.id} ${b.customerName || ''} ${b.customerInfo?.fullName || ''}`
        .toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });

    if (sortBy === 'newest')   result = [...result].sort((a, b) => new Date(b.bookedAt ?? 0) - new Date(a.bookedAt ?? 0));
    if (sortBy === 'oldest')   result = [...result].sort((a, b) => new Date(a.bookedAt ?? 0) - new Date(b.bookedAt ?? 0));
    if (sortBy === 'amount-h') result = [...result].sort((a, b) => (b.totalPrice ?? 0) - (a.totalPrice ?? 0));
    if (sortBy === 'amount-l') result = [...result].sort((a, b) => (a.totalPrice ?? 0) - (b.totalPrice ?? 0));

    return result;
  }, [allBookings, filter, search, sortBy]);

  const pastBookingsCount = counts.completed + counts.cancelled;

  return (
    <>
      {showClearModal && (
        <ClearHistoryModal
          count={pastBookingsCount}
          onConfirm={() => { clearOwnerHistory(); setShowClearModal(false); setFilter('all'); }}
          onClose={() => setShowClearModal(false)}
        />
      )}

      <div className="animate-fade-in space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Manage Bookings</h1>
            <p className="text-gray-400 text-sm mt-0.5">Review, approve, and manage all customer reservations</p>
          </div>
          {pastBookingsCount > 0 && (
            <button onClick={() => setShowClearModal(true)}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all flex-shrink-0">
              <FontAwesomeIcon icon={faEraser} className="text-xs" />
              Clear History
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{pastBookingsCount}</span>
            </button>
          )}
        </div>

        {/* Status tab pills */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {Object.entries(counts).map(([key, count]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`rounded-xl px-3 py-3 text-left transition-all duration-200 border-2 ${
                filter === key
                  ? `${TAB_COLORS[key]} border-transparent shadow-md`
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
              }`}>
              <p className={`text-2xl font-display font-black ${filter === key ? 'text-white' : 'text-gray-900'}`}>{count}</p>
              <p className={`text-xs font-semibold capitalize mt-0.5 ${filter === key ? 'text-white/80' : 'text-gray-400'}`}>{key}</p>
            </button>
          ))}
        </div>

        {/* Search + Sort bar */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by car, booking ID, or customer name…"
              className="form-input pl-11 w-full" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            )}
          </div>
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="form-input pl-8 pr-4 text-sm appearance-none min-w-[160px]">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amount-h">Amount: High → Low</option>
              <option value="amount-l">Amount: Low → High</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        {(search || filter !== 'all') && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FontAwesomeIcon icon={faCheckDouble} className="text-primary-400 text-xs" />
            Showing <strong className="text-gray-800">{filtered.length}</strong> of <strong className="text-gray-800">{allBookings.length}</strong> bookings
            {filter !== 'all' && (
              <span className="ml-1 capitalize font-semibold text-primary-600">· {filter}</span>
            )}
          </div>
        )}

        {/* Booking list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="card text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCarSide} className="text-gray-300 text-2xl" />
              </div>
              <p className="font-display font-bold text-lg text-gray-700 mb-1">No bookings found</p>
              <p className="text-gray-400 text-sm">
                {search
                  ? 'Try a different search term.'
                  : filter !== 'all'
                    ? 'No bookings with this status yet.'
                    : 'No bookings have been placed yet.'}
              </p>
              {(search || filter !== 'all') && (
                <button onClick={() => { setSearch(''); setFilter('all'); }}
                  className="mt-4 btn-secondary text-sm">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filtered.map(b => (
              <BookingCard
                key={b.id}
                b={b}
                approveBooking={approveBooking}
                rejectBooking={rejectBooking}
                ownerCancelBooking={ownerCancelBooking}
                updateStatus={updateStatus}
                markHandedOver={markHandedOver}
                completeReturn={completeReturn}
                ownerRemoveBooking={ownerRemoveBooking}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
