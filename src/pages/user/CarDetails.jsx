import { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faGasPump, faGear, faUserGroup, faCalendarDays,
  faLocationDot, faChevronRight, faCheck, faCircleCheck,
  faCircleXmark, faCar, faClock, faTag, faMapPin, faPhone,
  faEnvelope, faIdCard, faUser, faArrowRight, faXmark,
  faShieldHalved, faNoteSticky, faCircleExclamation, faRoute,
} from '@fortawesome/free-solid-svg-icons';
import { useCars } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';
import { cityList } from '../../assets/assets';

const StarRow = ({ rating, count }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <FontAwesomeIcon key={s} icon={faStar}
          className={`text-sm ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}/>
      ))}
    </div>
    <span className="font-bold text-gray-900">{rating}</span>
    <span className="text-gray-400 text-sm">({count} reviews)</span>
  </div>
);

const hourOptions = [2,3,4,5,6,7,8,9,10,11,12];
const ID_TYPES = ['Aadhaar Card', 'PAN Card', 'Driving Licence', 'Passport', 'Voter ID'];

/* ── Booking Info Modal ── */
function BookingInfoModal({ car, bookingMeta, user, onConfirm, onClose }) {
  const [form, setForm] = useState({
    fullName:         user?.name || '',
    email:            user?.email || '',
    phone:            user?.phone || '',
    emergencyContact: '',
    pickupAddress:    '',
    dropoffAddress:   bookingMeta.dropoffLocation && bookingMeta.dropoffLocation !== bookingMeta.pickupLocation
                        ? '' : '',
    idType:           'Aadhaar Card',
    idNumber:         '',
    notes:            '',
  });
  const [errors, setErrors] = useState({});

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2)   e.fullName = 'Full name required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))             e.email    = 'Valid email required.';
    if (!form.phone.trim() || form.phone.replace(/\D/g,'').length < 10) e.phone = 'Valid phone number required.';
    if (!form.pickupAddress.trim() || form.pickupAddress.trim().length < 5) e.pickupAddress = 'Pickup address required.';
    if (!form.idNumber.trim() || form.idNumber.trim().length < 4)   e.idNumber = 'ID number required.';
    return e;
  };

  const handleConfirm = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onConfirm({ ...bookingMeta, customerInfo: form });
  };

  const hasDropoff = bookingMeta.dropoffLocation && bookingMeta.dropoffLocation !== bookingMeta.pickupLocation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-2xl flex flex-col max-h-screen sm:max-h-[92vh] animate-fade-in">

          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-gray-900">Complete Your Booking</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Fill in the required details to proceed</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors flex-shrink-0">
              <FontAwesomeIcon icon={faXmark}/>
            </button>
          </div>

          {/* Booking Summary */}
          <div className="mx-5 sm:mx-6 mt-4 mb-2 bg-primary-50 border border-primary-100 rounded-xl p-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <img src={car.image} alt={car.brand} className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=80'; }}/>
              <div className="min-w-0">
                <p className="font-display font-bold text-gray-900 text-sm truncate">{car.brand} {car.model}</p>
                <p className="text-primary-600 font-bold text-sm">{fmt(bookingMeta.total)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                ['Pickup', bookingMeta.pickupDate],
                bookingMeta.bookingType === 'daily'
                  ? ['Return', bookingMeta.returnDate]
                  : ['Time', bookingMeta.pickupTime],
                ['Location', bookingMeta.pickupLocation],
                ...(hasDropoff ? [['Drop-off', bookingMeta.dropoffLocation]] : []),
              ].map(([k,v]) => v ? (
                <div key={k} className="bg-white/70 rounded-lg px-3 py-2">
                  <p className="text-gray-400 font-medium">{k}</p>
                  <p className="font-bold text-gray-800 truncate">{v}</p>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-6">

            {/* Contact Information */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-primary-400"/>Contact Information
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                    placeholder="As on ID proof" className={`form-input ${errors.fullName ? 'form-input-error' : ''}`}/>
                  {errors.fullName && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs"/>{errors.fullName}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="Booking confirmation sent here" className={`form-input ${errors.email ? 'form-input-error' : ''}`}/>
                  {errors.email && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs"/>{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    placeholder="+91 98765 43210" className={`form-input ${errors.phone ? 'form-input-error' : ''}`}/>
                  {errors.phone && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs"/>{errors.phone}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact <span className="font-normal text-gray-400">(optional)</span></label>
                  <input type="tel" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})}
                    placeholder="+91 XXXXX XXXXX" className="form-input"/>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-primary-400"/>Location Details
              </p>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">
                    Pickup Address <span className="text-gray-400 font-normal text-xs">in {bookingMeta.pickupLocation}</span>
                  </label>
                  <input type="text" value={form.pickupAddress} onChange={e => setForm({...form, pickupAddress: e.target.value})}
                    placeholder={`e.g. 42 Main Street, ${bookingMeta.pickupLocation}`}
                    className={`form-input ${errors.pickupAddress ? 'form-input-error' : ''}`}/>
                  {errors.pickupAddress && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs"/>{errors.pickupAddress}</p>}
                </div>
                {hasDropoff && (
                  <div className="form-group">
                    <label className="form-label">
                      Drop-off Address <span className="text-gray-400 font-normal text-xs">in {bookingMeta.dropoffLocation}</span>
                    </label>
                    <input type="text" value={form.dropoffAddress} onChange={e => setForm({...form, dropoffAddress: e.target.value})}
                      placeholder={`e.g. 12 Park Lane, ${bookingMeta.dropoffLocation}`} className="form-input"/>
                  </div>
                )}
              </div>
            </div>

            {/* ID Proof */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-primary-400"/>Identity Verification
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">ID Proof Type</label>
                  <select value={form.idType} onChange={e => setForm({...form, idType: e.target.value})} className="form-input">
                    {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ID Number</label>
                  <input type="text" value={form.idNumber} onChange={e => setForm({...form, idNumber: e.target.value})}
                    placeholder="Enter your ID number"
                    className={`form-input ${errors.idNumber ? 'form-input-error' : ''}`}/>
                  {errors.idNumber && <p className="form-error"><FontAwesomeIcon icon={faCircleExclamation} className="text-xs"/>{errors.idNumber}</p>}
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mt-3">
                <FontAwesomeIcon icon={faShieldHalved} className="text-amber-500 mt-0.5 flex-shrink-0 text-sm"/>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Your ID will be verified at pickup. Please carry the original document. Data is encrypted and never shared with third parties.
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">
                Special Requests <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="E.g. child seat, GPS device, early morning pickup…"
                className="form-input resize-none"/>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-5 sm:px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-white sm:rounded-b-2xl">
            <button onClick={onClose} className="btn-secondary flex-shrink-0 px-5 py-2.5">Back</button>
            <button onClick={handleConfirm} className="flex-1 btn-primary py-3">
              <FontAwesomeIcon icon={faArrowRight}/>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarDetails() {
  const { id }          = useParams();
  const { getCarById }  = useCars();
  const { isLoggedIn, user } = useAuth();
  const navigate        = useNavigate();
  const location        = useLocation();
  const car             = getCarById(id);

  const [bookingType,     setBookingType]     = useState('daily');
  const [pickupDate,      setPickupDate]      = useState('');
  const [returnDate,      setReturnDate]      = useState('');
  const [pickupTime,      setPickupTime]      = useState('');
  const [hours,           setHours]           = useState(2);
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [error,           setError]           = useState('');
  const [bookingMeta,     setBookingMeta]     = useState(null); // triggers modal

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <FontAwesomeIcon icon={faCar} className="text-gray-400 text-3xl"/>
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Car Not Found</h2>
          <p className="text-gray-500 mb-6">The vehicle you're looking for doesn't exist.</p>
          <Link to="/cars" className="btn-primary">Back to Fleet</Link>
        </div>
      </div>
    );
  }

  const today       = new Date().toISOString().split('T')[0];
  const isPremium   = car.isPremium || car.pricePerDay >= 50000;
  const priceHour   = car.pricePerHour || Math.round(car.pricePerDay / 8);
  const calcDays    = () => { if (!pickupDate || !returnDate) return 0; const d = Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000); return d > 0 ? d : 0; };
  const days        = calcDays();
  const dailyTotal  = days * car.pricePerDay;
  const hourlyTotal = hours * priceHour;
  const resolvedDropoff = dropoffLocation || car.location;

  const handleBook = () => {
    setError('');
    if (!isLoggedIn) { navigate('/login', { state: { from: location.pathname } }); return; }

    if (bookingType === 'daily') {
      if (!pickupDate || !returnDate) { setError('Please select both pickup and return dates.'); return; }
      if (days < 1)                   { setError('Return date must be after the pickup date.'); return; }
      setBookingMeta({
        car, pickupDate, returnDate, days,
        total: dailyTotal, bookingType: 'daily',
        pickupLocation: car.location, dropoffLocation: resolvedDropoff,
      });
    } else {
      if (!pickupDate) { setError('Please select a pickup date.');  return; }
      if (!pickupTime) { setError('Please select a pickup time.');  return; }
      if (hours < 2)   { setError('Minimum booking is 2 hours.'); return; }
      setBookingMeta({
        car, pickupDate, pickupTime, hours,
        total: hourlyTotal, bookingType: 'hourly',
        pickupLocation: car.location, dropoffLocation: resolvedDropoff,
      });
    }
  };

  const handleModalConfirm = (meta) => {
    setBookingMeta(null);
    navigate('/payment', { state: { bookingData: meta } });
  };

  const specs = [
    { icon: faGasPump,      label: 'Fuel Type',    value: car.fuelType },
    { icon: faGear,         label: 'Transmission', value: car.transmission },
    { icon: faUserGroup,    label: 'Seating',      value: `${car.seatingCapacity} seats` },
    { icon: faCalendarDays, label: 'Year',         value: car.year },
  ];

  return (
    <div className="min-h-screen bg-slate-50 page-enter mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs"/>
          <Link to="/cars" className="hover:text-gray-700 transition-colors">Cars</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs"/>
          <span className="text-gray-900 font-medium">{car.brand} {car.model}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-hidden">
              <img src={car.image} alt={`${car.brand} ${car.model}`}
                className="w-full h-72 md:h-96 object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80'; }}/>
            </div>

            <div className="card p-4 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="badge bg-primary-100 text-primary-700">{car.category}</span>
                    <span className={car.availability ? 'badge-available' : 'badge-unavailable'}>
                      <FontAwesomeIcon icon={car.availability ? faCircleCheck : faCircleXmark} className="text-[10px]"/>
                      {car.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <h1 className="font-display font-black text-3xl text-gray-900">{car.brand} {car.model}</h1>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <FontAwesomeIcon icon={faLocationDot} className="text-gray-300"/>
                    {car.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-extrabold text-4xl text-primary-600 leading-none">₹{car.pricePerDay.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm mt-0.5">per day</p>
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 mt-2">
                    <FontAwesomeIcon icon={faClock} className="text-amber-500 text-xs"/>
                    <span className="text-amber-700 font-bold text-sm">₹{priceHour.toLocaleString()}</span>
                    <span className="text-amber-600 text-xs">/hr</span>
                  </div>
                </div>
              </div>

              <StarRow rating={car.rating} count={car.reviewCount}/>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-7 pt-7 border-t border-gray-100">
                {specs.map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center hover:bg-blue-50 transition-colors">
                    <FontAwesomeIcon icon={s.icon} className="text-primary-500 text-lg mb-2 block mx-auto"/>
                    <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                    <p className="font-bold text-gray-900 text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-7">
                <h2 className="font-display font-bold text-xl text-gray-900 mb-3">About This Car</h2>
                <p className="text-gray-500 leading-relaxed">{car.description}</p>
              </div>

              {car.features?.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTag} className="text-primary-400 text-base"/>Key Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {car.features.map(f => (
                      <div key={f} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/40 transition-colors">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faCheck} className="text-emerald-600 text-[9px]"/>
                        </div>
                        <span className="text-gray-700 text-sm font-semibold">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT — Booking Panel ── */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-bold text-xl text-gray-900 mb-5">Reserve This Car</h2>

              {/* Daily / Hourly toggle — Hourly only for Premium fleet */}
              {isPremium ? (
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-5 p-0.5 bg-gray-50">
                  {[['daily', faCalendarDays, 'text-primary-700', 'border-primary-100', 'Daily'],
                    ['hourly', faClock, 'text-amber-700', 'border-amber-100', 'Hourly']
                  ].map(([type, icon, textCls, borderCls, label]) => (
                    <button key={type} onClick={() => { setBookingType(type); setError(''); }}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                        bookingType === type ? `bg-white ${textCls} shadow-sm border ${borderCls}` : 'text-gray-500 hover:text-gray-700'}`}>
                      <FontAwesomeIcon icon={icon} className="text-xs"/>{label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-5 p-0.5 bg-gray-50">
                  <div className="flex-1 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 bg-white text-primary-700 shadow-sm border border-primary-100">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-xs"/> Daily
                  </div>
                </div>
              )}

              <div className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 mb-5 text-xs font-medium ${
                bookingType === 'daily'
                  ? 'bg-primary-50 border border-primary-100 text-primary-700'
                  : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
                <FontAwesomeIcon icon={bookingType === 'daily' ? faCalendarDays : faClock}/>
                {bookingType === 'daily'
                  ? `Daily rate: ₹${car.pricePerDay.toLocaleString()} / day`
                  : `Hourly rate: ₹${priceHour.toLocaleString()} / hr · Min. 2 hours`}
                {!isPremium && (
                  <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Standard Fleet</span>
                )}
              </div>

              {/* Daily fields */}
              {bookingType === 'daily' && (
                <div className="space-y-4 mb-4">
                  <div className="form-group">
                    <label className="form-label"><FontAwesomeIcon icon={faCalendarDays} className="text-primary-400 mr-1.5"/>Pickup Date</label>
                    <input type="date" value={pickupDate} min={today} onChange={e => setPickupDate(e.target.value)} className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><FontAwesomeIcon icon={faCalendarDays} className="text-primary-400 mr-1.5"/>Return Date</label>
                    <input type="date" value={returnDate} min={pickupDate || today} onChange={e => setReturnDate(e.target.value)} className="form-input"/>
                  </div>
                </div>
              )}

              {/* Hourly fields */}
              {bookingType === 'hourly' && (
                <div className="space-y-4 mb-4">
                  <div className="form-group">
                    <label className="form-label"><FontAwesomeIcon icon={faCalendarDays} className="text-amber-500 mr-1.5"/>Pickup Date</label>
                    <input type="date" value={pickupDate} min={today} onChange={e => setPickupDate(e.target.value)} className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><FontAwesomeIcon icon={faClock} className="text-amber-500 mr-1.5"/>Pickup Time</label>
                    <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><FontAwesomeIcon icon={faClock} className="text-amber-500 mr-1.5"/>Duration</label>
                    <select value={hours} onChange={e => setHours(Number(e.target.value))} className="form-input">
                      {hourOptions.map(h => <option key={h} value={h}>{h} hour{h>1?'s':''}{h===2?' (minimum)':''}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Drop-off */}
              <div className="form-group mb-4">
                <label className="form-label">
                  <FontAwesomeIcon icon={faMapPin} className="text-violet-500 mr-1.5"/>
                  Drop-off Location
                </label>
                <select value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)} className="form-input">
                  <option value="">Same as pickup — {car.location}</option>
                  {cityList.filter(c => c !== car.location).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {dropoffLocation && dropoffLocation !== car.location && (
                  <div className="flex items-center gap-1.5 mt-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                    <FontAwesomeIcon icon={faRoute} className="text-violet-500 text-xs flex-shrink-0"/>
                    <p className="text-xs text-violet-700 font-semibold">
                      One-way trip · Drop-off at {dropoffLocation}
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
                  <FontAwesomeIcon icon={faCircleXmark} className="text-red-500 mt-0.5 flex-shrink-0"/>
                  {error}
                </div>
              )}

              {/* Price summary */}
              {bookingType === 'daily' && days > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2 border border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>₹{car.pricePerDay.toLocaleString()} × {days} day{days>1?'s':''}</span>
                    <span>₹{dailyTotal.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600 text-lg">₹{dailyTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {bookingType === 'hourly' && hours >= 2 && (
                <div className="bg-amber-50 rounded-xl p-4 mb-5 space-y-2 border border-amber-100">
                  <div className="flex justify-between text-sm text-amber-700">
                    <span>₹{priceHour.toLocaleString()} × {hours} hr</span>
                    <span>₹{hourlyTotal.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-amber-200 pt-2 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-amber-600 text-lg">₹{hourlyTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button onClick={handleBook} disabled={!car.availability}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  car.availability
                    ? bookingType === 'hourly'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white hover:-translate-y-0.5'
                      : 'btn-primary'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                {car.availability ? (<>
                  <FontAwesomeIcon icon={bookingType === 'hourly' ? faClock : faCalendarDays}/>
                  {bookingType === 'hourly' ? 'Book by Hour' : 'Confirm Reservation'}
                </>) : 'Currently Unavailable'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">Free cancellation · No charge until confirmed</p>

              <div className={`mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl ${car.availability ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <span className={`w-2 h-2 rounded-full ${car.availability ? 'bg-emerald-500' : 'bg-red-400'}`}/>
                <span className={`text-sm font-semibold ${car.availability ? 'text-emerald-700' : 'text-red-600'}`}>
                  {car.availability ? 'Available for booking' : 'Not available right now'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Info Modal */}
      {bookingMeta && (
        <BookingInfoModal
          car={car}
          bookingMeta={bookingMeta}
          user={user}
          onConfirm={handleModalConfirm}
          onClose={() => setBookingMeta(null)}/>
      )}
    </div>
  );
}
