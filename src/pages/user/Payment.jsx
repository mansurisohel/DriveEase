import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard, faLock, faShieldHalved, faCalendarDays,
  faLocationDot, faCarSide, faCheckCircle, faChevronRight,
  faArrowLeft, faSpinner, faRotate, faBuildingColumns,
  faMobileScreenButton, faWallet, faCircleCheck, faGasPump,
  faGear, faUserGroup, faTag, faReceipt, faXmarkCircle,
  faChevronDown, faTicket, faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

/* ── UPI SVGs (exact filenames from disk) ── */
import imgPhonePe   from '../../assets/images/payments/upi/PhonePe.svg';
import imgGpay      from '../../assets/images/payments/upi/GPay.svg';
import imgPaytm     from '../../assets/images/payments/upi/Paytm.svg';
import imgAmazonPay from '../../assets/images/payments/upi/Amazon-Pay.svg';
import imgBhim      from '../../assets/images/payments/upi/BHIM.svg';

/* ── Bank SVGs (exact filenames from disk) ── */
import imgSbi    from '../../assets/images/payments/banks/SBI.svg';
import imgHdfc   from '../../assets/images/payments/banks/HDFC.svg';
import imgIcici  from '../../assets/images/payments/banks/ICICI.svg';
import imgAxis   from '../../assets/images/payments/banks/Axis.svg';
import imgKotak  from '../../assets/images/payments/banks/Kotak-Mahindra.svg';
import imgPnb    from '../../assets/images/payments/banks/PNB.svg';
import imgBob    from '../../assets/images/payments/banks/BOB.svg';
import imgCanara from '../../assets/images/payments/banks/Canara.svg';

/* ─── helpers ─── */
const fmt     = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const luhn    = (num) => {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
};
const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const fmtExp  = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
};
const cardBrand = (num) => {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n))           return 'visa';
  if (/^5[1-5]/.test(n))     return 'mastercard';
  if (/^3[47]/.test(n))      return 'amex';
  if (/^(508[5-9]|6069|607|608|6521|652[2-9]|6530|6532|65[3-9])/.test(n)) return 'rupay';
  return null;
};

/* ─── Coupon config ─── */
const COUPONS = {
  FIRSTDRIVE: { discount: 0.15, label: '15% off — Welcome gift!' },
  SAVE5:      { discount: 0.05, label: '5% off'                  },
};

/* ─── Payment method tabs ─── */
const METHODS = [
  { id: 'card',    label: 'Card',        icon: faCreditCard        },
  { id: 'upi',     label: 'UPI',         icon: faMobileScreenButton},
  { id: 'netbank', label: 'Net Banking', icon: faBuildingColumns   },
  { id: 'wallet',  label: 'Wallet',      icon: faWallet            },
];

const BANKS = [
  { name: 'State Bank of India',  img: imgSbi,    color: '#2B61B3' },
  { name: 'HDFC Bank',            img: imgHdfc,   color: '#004C8F' },
  { name: 'ICICI Bank',           img: imgIcici,  color: '#F16422' },
  { name: 'Axis Bank',            img: imgAxis,   color: '#97144D' },
  { name: 'Kotak Mahindra',       img: imgKotak,  color: '#ED1C24' },
  { name: 'Punjab National Bank', img: imgPnb,    color: '#003399' },
  { name: 'Bank of Baroda',       img: imgBob,    color: '#F47920' },
  { name: 'Canara Bank',          img: imgCanara, color: '#005BAC' },
];

const UPI_APPS = [
  { name: 'PhonePe',    img: imgPhonePe,   bg: '#5f259f', border: false, handle: 'phonepe@ybl'  },
  { name: 'Google Pay', img: imgGpay,      bg: '#ffffff', border: true,  handle: 'name@okicici' },
  { name: 'Paytm',      img: imgPaytm,     bg: '#ffffff', border: false, handle: 'name@paytm'   },
  { name: 'Amazon Pay', img: imgAmazonPay, bg: '#ffffff', border: false, handle: 'name@apl'     },
  { name: 'BHIM',       img: imgBhim,      bg: '#ffffff', border: false, handle: 'name@upi'     },
];

/* ── Logo components ── */
function UpiAppLogo({ app, size = 40 }) {
  return (
    <div style={{
      width: size, height: size,
      background: app.bg, borderRadius: Math.round(size * 0.24),
      overflow: 'hidden', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
      ...(app.border ? { border: '1.5px solid #e8eaed' } : {}),
    }}>
      <img src={app.img} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}
function BankLogo({ bank, size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.28),
      background: 'white', border: `1.5px solid ${bank.color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <img src={bank.img} alt={bank.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
  );
}

/* ─── Card brand badges ─── */
function CardLogo({ brand }) {
  if (brand === 'visa')       return <span className="text-[10px] font-black tracking-wider bg-blue-700 text-white px-1.5 py-0.5 rounded">VISA</span>;
  if (brand === 'mastercard') return <span className="flex"><span className="w-5 h-5 rounded-full bg-red-500 opacity-90" /><span className="w-5 h-5 rounded-full bg-amber-400 opacity-90 -ml-2" /></span>;
  if (brand === 'amex')       return <span className="text-[10px] font-black tracking-wider bg-blue-500 text-white px-1.5 py-0.5 rounded">AMEX</span>;
  if (brand === 'rupay')      return <span className="text-[10px] font-black tracking-wider bg-green-700 text-white px-1.5 py-0.5 rounded">RuPay</span>;
  return null;
}

/* ─── 3-D Card Preview ─── */
function CardPreview({ number, name, expiry, flipped }) {
  const brand  = cardBrand(number);
  const masked = number.replace(/\D/g,'').padEnd(16,'•').replace(/(.{4})/g,'$1 ').trim();
  return (
    <div className="relative w-full max-w-[320px] sm:max-w-[360px] mx-auto" style={{ perspective: '1000px', height: '190px' }}>
      <div className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#1d4ed8 0%,#1e40af 40%,#312e81 100%)' }}>
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white/5" />
          <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5 p-1">
                  {[...Array(4)].map((_,i)=><div key={i} className="w-1.5 h-1.5 bg-amber-700/50 rounded-sm" />)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {brand ? <CardLogo brand={brand} /> : <span className="text-white/30 text-xs font-medium">DEBIT / CREDIT</span>}
              </div>
            </div>
            <div>
              <p className="font-mono text-white text-lg sm:text-xl tracking-[0.18em] mb-3 drop-shadow">{masked}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
                  <p className="text-white text-sm font-semibold tracking-wide uppercase truncate max-w-[140px] sm:max-w-[180px]">{name || 'YOUR NAME'}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
                  <p className="text-white text-sm font-mono">{expiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)' }}>
          <div className="w-full h-10 bg-gray-900 mt-8" />
          <div className="px-6 mt-5">
            <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">CVV</p>
            <div className="bg-white rounded-md h-9 flex items-center justify-end px-4">
              <span className="text-gray-400 font-mono tracking-[0.3em] text-sm">•••</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step indicator ─── */
function Steps({ current }) {
  const steps = ['Review', 'Payment', 'Confirm'];
  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
            i < current  ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
            : i === current ? 'bg-primary-600 text-white shadow-lg'
            : 'text-gray-400 bg-gray-100'
          }`}>
            {i < current
              ? <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs" />
              : <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-black ${i===current?'bg-white/25':'bg-gray-300/50'}`}>{i+1}</span>
            }
            <span className="text-[10px] xs:text-xs sm:text-sm">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-4 sm:w-6 mx-0.5 sm:mx-1 transition-all ${i < current ? 'bg-emerald-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN PAYMENT COMPONENT
════════════════════════════════════════════════════════ */
export default function Payment() {
  const location         = useLocation();
  const navigate         = useNavigate();
  const { addBooking, bookings }   = useBookings();
  const { isLoggedIn, user } = useAuth();

  const bookingData = location.state?.bookingData;

  useEffect(() => {
    if (!isLoggedIn)  { navigate('/login'); return; }
    if (!bookingData) { navigate('/cars');  return; }
  }, []);

  const [method,   setMethod]   = useState('card');
  const [step,     setStep]     = useState(1);
  const [cardNum,  setCardNum]  = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry,   setExpiry]   = useState('');
  const [cvv,      setCvv]      = useState('');
  const [flipped,  setFlipped]  = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [upiId,    setUpiId]    = useState('');
  const [bank,     setBank]     = useState('');
  const [wallet,   setWallet]   = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [timer,    setTimer]    = useState(0);
  const timerRef = useRef(null);

  /* ── Coupon state ── */
  const [couponInput,   setCouponInput]   = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);  // { code, discount, label }
  const [couponError,   setCouponError]   = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  /* Auto-apply FIRSTDRIVE only for genuinely new users:
     - registered within last 7 days AND have zero prior bookings
     - never applies to existing users logging in */
  const isNewUser = (() => {
    if (!user?.joinedDate) return false;
    const joined = new Date(user.joinedDate);
    const now    = new Date();
    const daysSinceJoin = (now - joined) / (1000 * 60 * 60 * 24);
    const userBookingCount = bookings.filter(b => b.userId === user?.id).length;
    return daysSinceJoin <= 7 && userBookingCount === 0;
  })();

  useEffect(() => {
    if (isNewUser && !appliedCoupon) {
      setAppliedCoupon({ code: 'FIRSTDRIVE', ...COUPONS['FIRSTDRIVE'] });
      setCouponSuccess('Welcome! FIRSTDRIVE coupon applied — 15% off your first booking');
    }
  }, [isNewUser]);

  if (!bookingData) return null;

  const { car, pickupDate, returnDate, days, total, pickupLocation, dropoffLocation } = bookingData;
  const baseFare    = total;
  const tax         = Math.round(baseFare * 0.18);
  const convenience = 49;
  const couponSaving = appliedCoupon ? Math.round(baseFare * appliedCoupon.discount) : 0;
  const grand       = baseFare + tax + convenience - couponSaving;

  /* Apply coupon manually */
  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code.'); return; }
    if (code === 'FIRSTDRIVE' && !isNewUser) {
      setCouponError('This coupon is only valid for new users within 7 days of registration.');
      return;
    }
    if (appliedCoupon?.code === code) { setCouponError('This coupon is already applied.'); return; }
    const def = COUPONS[code];
    if (!def) { setCouponError('Invalid coupon code. Please try again.'); return; }
    setAppliedCoupon({ code, ...def });
    setCouponSuccess(`Coupon "${code}" applied — ${def.label}`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const validate = () => {
    const e = {};
    if (method === 'card') {
      const raw = cardNum.replace(/\s/g,'');
      if (raw.length < 16)                      e.cardNum  = 'Enter a valid 16-digit card number';
      else if (!luhn(raw))                      e.cardNum  = 'Invalid card number';
      if (!cardName.trim())                     e.cardName = 'Name on card is required';
      if (!/^\d{2}\/\d{2}$/.test(expiry))      e.expiry   = 'Enter expiry as MM/YY';
      else {
        const [m,y] = expiry.split('/').map(Number);
        const now   = new Date();
        if (m < 1 || m > 12) e.expiry = 'Invalid month';
        else if (y+2000 < now.getFullYear() || (y+2000===now.getFullYear() && m < now.getMonth()+1))
          e.expiry = 'Card has expired';
      }
      if (cvv.length < 3) e.cvv = 'Enter a valid CVV';
    }
    if (method === 'upi')     { if (!/^[\w.\-]+@[\w]+$/.test(upiId)) e.upiId = 'Enter a valid UPI ID (e.g. name@upi)'; }
    if (method === 'netbank') { if (!bank)   e.bank   = 'Please select a bank';   }
    if (method === 'wallet')  { if (!wallet) e.wallet = 'Please select a wallet'; }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setStep(2);
    let t = 3;
    setTimer(t);
    timerRef.current = setInterval(() => {
      t--; setTimer(t);
      if (t <= 0) {
        clearInterval(timerRef.current);
        const ok = Math.random() > 0.1;
        if (ok) {
          addBooking({
            carId: car.id, carBrand: car.brand, carModel: car.model, carImage: car.image,
            pickupDate, returnDate, pickupLocation, dropoffLocation,
            totalPrice: grand, pricePerDay: car.pricePerDay,
            paymentMethod: method, paymentStatus: 'paid',
            couponApplied: appliedCoupon?.code || null,
            customerInfo: bookingData.customerInfo || null,
            customerName: bookingData.customerInfo?.fullName || user?.name || 'Customer',
            customerEmail: bookingData.customerInfo?.email || user?.email || '',
            customerPhone: bookingData.customerInfo?.phone || '',
          });
          setStep(3);
          setTimeout(() => navigate('/my-bookings'), 5000);
        } else { setStep(4); }
      }
    }, 1000);
  };

  const retry = () => { setStep(1); setErrors({}); };

  /* ── Processing screen ── */
  if (step === 2) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
      <div className="card p-10 max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
          <FontAwesomeIcon icon={faSpinner} className="text-primary-600 text-3xl animate-spin" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Processing Payment</h2>
        <p className="text-gray-400 text-sm mb-6">Please don't close this window…</p>
        <div className="flex gap-1 justify-center mb-6">
          {[0,1,2].map(i=><div key={i} className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
        </div>
        <div className="bg-slate-50 rounded-xl px-5 py-3">
          <div className="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faLock} className="text-emerald-500 text-xs" />
            <span className="text-xs font-semibold text-gray-600">256-bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Success screen ── */
  if (step === 3) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="card p-8 sm:p-10 max-w-md w-full text-center animate-fade-in">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
            <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-5xl" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faShieldHalved} className="text-white text-[10px]" />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Payment Successful
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-400 text-sm mb-6">
          Your reservation is confirmed. Confirmation sent to <strong className="text-gray-700">{user?.email}</strong>
        </p>
        <div className="bg-slate-50 rounded-2xl p-5 text-left mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <img src={car.image} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
            <div>
              <p className="font-display font-bold text-gray-900">{car.brand} {car.model}</p>
              <p className="text-xs text-gray-400">{car.category} · {car.year}</p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ['Pickup Date',     pickupDate],
              ['Return Date',     returnDate],
              ['Pickup Location', pickupLocation],
              ...(dropoffLocation && dropoffLocation !== pickupLocation
                ? [['Drop-off Location', dropoffLocation]] : []),
              ['Duration',        `${days} day${days>1?'s':''}`],
              ['Amount Paid',     fmt(grand)],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-400">{k}</span>
                <span className="font-semibold text-gray-900">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/my-bookings" className="btn-primary w-full"><FontAwesomeIcon icon={faReceipt} /> View My Bookings</Link>
          <Link to="/" className="btn-secondary w-full">Back to Home</Link>
        </div>
        <p className="text-xs text-gray-300 mt-4">Auto-redirecting to bookings in a few seconds…</p>
      </div>
    </div>
  );

  /* ── Failed screen ── */
  if (step === 4) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16">
      <div className="card p-10 max-w-sm w-full text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <FontAwesomeIcon icon={faXmarkCircle} className="text-red-500 text-4xl" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-400 text-sm mb-7">Something went wrong. Your card has not been charged.</p>
        <div className="space-y-3">
          <button onClick={retry} className="btn-primary w-full"><FontAwesomeIcon icon={faRotate} /> Try Again</button>
          <Link to="/cars" className="btn-secondary w-full block text-center">Browse Other Cars</Link>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════
     MAIN PAYMENT UI
  ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50 page-enter mt-20 pb-24 lg:pb-8">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 lg:top-[70px] z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-800 text-sm font-medium transition-colors group">
              <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
              </div>
              <span className="text-xs">Back</span>
            </button>
            <div className="w-px h-5 bg-gray-200 hidden sm:block" />
            <Steps current={1} />
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-emerald-50 border border-emerald-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <FontAwesomeIcon icon={faLock} className="text-emerald-500 text-xs" />
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 hidden xs:inline">Secured Pay</span>
            <span className="text-[10px] font-bold text-emerald-700 sm:hidden">Secure</span>
          </div>
        </div>
      </div>

      {/* ── Mobile booking summary accordion ── */}
      <div className="lg:hidden bg-white border-b border-gray-100">
        <button onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <img src={car.image} alt="" className="w-10 h-7 object-cover rounded-lg flex-shrink-0"
              onError={e=>{e.target.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=60'}} />
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">{car.brand} {car.model}</p>
              <p className="text-xs text-gray-400">{days} day{days>1?'s':''} · {pickupLocation}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-primary-600 text-base">{fmt(grand)}</span>
            <FontAwesomeIcon icon={faChevronDown} className={`text-gray-400 text-xs transition-transform ${summaryOpen?'rotate-180':''}`} />
          </div>
        </button>

        {summaryOpen && (
          <div className="px-4 pb-4 border-t border-gray-50">
            <div className="space-y-2 pt-3">
              {[
                [faCalendarDays, 'Pick-up',   pickupDate],
                [faCalendarDays, 'Return',    returnDate],
                [faLocationDot,  'Pick-up at',pickupLocation],
                ...(dropoffLocation && dropoffLocation !== pickupLocation
                  ? [[faMapPin, 'Drop-off at', dropoffLocation]] : []),
                [faCarSide,     'Duration',  `${days} day${days>1?'s':''}`],
              ].map(([icon, label, val]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FontAwesomeIcon icon={icon} className="text-[11px] w-3.5" />{label}
                  </div>
                  <span className="font-semibold text-gray-900 text-right">{val}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500"><span>{fmt(car.pricePerDay)} × {days}d</span><span>{fmt(baseFare)}</span></div>
                <div className="flex justify-between text-sm text-gray-500"><span>GST (18%)</span><span>{fmt(tax)}</span></div>
                <div className="flex justify-between text-sm text-gray-500"><span>Convenience</span><span>{fmt(convenience)}</span></div>
                {couponSaving > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span><span>-{fmt(couponSaving)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total</span><span className="text-primary-600">{fmt(grand)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">

          {/* ═══ LEFT — Payment form ═══ */}
          <div className="space-y-4 sm:space-y-5">

            {/* Heading */}
            <div className="card p-4 sm:p-5 border-l-4 border-l-primary-500">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faCreditCard} className="text-primary-600" />
                </div>
                <div>
                  <h1 className="font-display font-black text-xl sm:text-2xl text-gray-900 leading-tight">Complete Your Payment</h1>
                  <p className="text-gray-400 text-xs sm:text-sm">Choose a payment method to confirm your booking.</p>
                </div>
              </div>
            </div>

            {/* 3D Card preview */}
            {method === 'card' && <CardPreview number={cardNum} name={cardName} expiry={expiry} flipped={flipped} />}

            {/* Method tabs */}
            <div className="card p-1.5 grid grid-cols-4 gap-1 sm:gap-1.5">
              {METHODS.map((m) => (
                <button key={m.id} onClick={() => { setMethod(m.id); setErrors({}); }}
                  className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                    method === m.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  <FontAwesomeIcon icon={m.icon} className="text-sm sm:text-base" />
                  <span className="leading-tight text-center">{m.label}</span>
                </button>
              ))}
            </div>

            {/* ── CARD FORM ── */}
            {method === 'card' && (
              <div className="card p-5 sm:p-6 space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display font-bold text-base sm:text-lg text-gray-900">Card Details</h3>
                  <div className="flex items-center gap-1.5">
                    {['visa','mastercard','rupay','amex'].map(b=>(
                      <span key={b} className="opacity-60 scale-90"><CardLogo brand={b} /></span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faCreditCard} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none" />
                    <input type="text" placeholder="0000 0000 0000 0000" value={cardNum}
                      onChange={e => setCardNum(fmtCard(e.target.value))}
                      className={`form-input pl-11 pr-16 font-mono ${errors.cardNum?'form-input-error':''}`} maxLength={19} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2"><CardLogo brand={cardBrand(cardNum)} /></div>
                  </div>
                  {errors.cardNum && <p className="form-error"><FontAwesomeIcon icon={faXmarkCircle} className="text-xs" />{errors.cardNum}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Name on Card</label>
                  <input type="text" placeholder="Your Name" value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    className={`form-input ${errors.cardName?'form-input-error':''}`} />
                  {errors.cardName && <p className="form-error"><FontAwesomeIcon icon={faXmarkCircle} className="text-xs" />{errors.cardName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input type="text" placeholder="MM/YY" value={expiry}
                      onChange={e => setExpiry(fmtExp(e.target.value))}
                      className={`form-input font-mono ${errors.expiry?'form-input-error':''}`} maxLength={5} />
                    {errors.expiry && <p className="form-error text-[10px]"><FontAwesomeIcon icon={faXmarkCircle} className="text-[9px]" />{errors.expiry}</p>}
                  </div>
                  <div className="form-group">
                    <label className="form-label flex items-center justify-between">
                      CVV <span className="text-xs text-gray-300 font-normal">3–4 digits</span>
                    </label>
                    <input type="password" placeholder="•••" value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/,'').slice(0,4))}
                      onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)}
                      className={`form-input font-mono ${errors.cvv?'form-input-error':''}`} maxLength={4} />
                    {errors.cvv && <p className="form-error text-[10px]"><FontAwesomeIcon icon={faXmarkCircle} className="text-[9px]" />{errors.cvv}</p>}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div onClick={() => setSaveCard(!saveCard)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${saveCard?'bg-primary-600 border-primary-600':'border-gray-300 group-hover:border-primary-400'}`}>
                    {saveCard && <FontAwesomeIcon icon={faCheckCircle} className="text-white text-[10px]" />}
                  </div>
                  <span className="text-sm text-gray-600">Save card for future bookings</span>
                </label>
              </div>
            )}

            {/* ── UPI FORM ── */}
            {method === 'upi' && (
              <div className="card p-5 sm:p-6 space-y-4 sm:space-y-5">
                <h3 className="font-display font-bold text-base sm:text-lg text-gray-900">UPI Payment</h3>
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faMobileScreenButton} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none" />
                    <input type="text" placeholder="yourname@okaxis" value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className={`form-input pl-11 ${errors.upiId?'form-input-error':''}`} />
                  </div>
                  {errors.upiId && <p className="form-error"><FontAwesomeIcon icon={faXmarkCircle} className="text-xs" />{errors.upiId}</p>}
                  <p className="form-hint">Supported: GPay, PhonePe, Paytm, BHIM, and all UPI apps</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Pay via</p>
                  <div className="grid grid-cols-3 xs:grid-cols-5 sm:grid-cols-5 gap-2 sm:gap-3">
                    {UPI_APPS.map(app => (
                      <button key={app.name} onClick={() => setUpiId(app.handle)}
                        className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl border transition-all group ${
                          upiId === app.handle
                            ? 'border-primary-300 bg-primary-50 shadow-sm'
                            : 'border-gray-100 hover:border-primary-200 hover:bg-primary-50 hover:shadow-sm'
                        }`}>
                        <UpiAppLogo app={app} size={40} />
                        <span className="text-[9px] sm:text-[10px] text-gray-500 font-semibold leading-tight text-center group-hover:text-primary-600 transition-colors">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {upiId && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                    <FontAwesomeIcon icon={faMobileScreenButton} className="text-blue-500 text-xs flex-shrink-0" />
                    <span className="text-xs text-blue-700 font-medium break-all">{upiId}</span>
                  </div>
                )}
              </div>
            )}

            {/* ── NET BANKING ── */}
            {method === 'netbank' && (
              <div className="card p-5 sm:p-6 space-y-4 sm:space-y-5">
                <h3 className="font-display font-bold text-base sm:text-lg text-gray-900">Net Banking</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {BANKS.map(b => (
                    <button key={b.name} onClick={() => setBank(b.name)}
                      className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl border text-left transition-all ${
                        bank === b.name
                          ? 'border-primary-400 bg-primary-50 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-slate-50'
                      }`}>
                      <BankLogo bank={b} size={32} />
                      <p className={`text-xs sm:text-sm font-semibold leading-tight truncate ${bank===b.name?'text-primary-700':'text-gray-700'}`}>{b.name}</p>
                    </button>
                  ))}
                </div>
                {errors.bank && <p className="form-error"><FontAwesomeIcon icon={faXmarkCircle} className="text-xs" />{errors.bank}</p>}
              </div>
            )}

            {/* ── WALLET ── */}
            {method === 'wallet' && (
              <div className="card p-5 sm:p-6 space-y-4 sm:space-y-5">
                <h3 className="font-display font-bold text-base sm:text-lg text-gray-900">Pay via Wallet</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {UPI_APPS.map(app => (
                    <button key={app.name} onClick={() => setWallet(app.name)}
                      className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border transition-all ${
                        wallet === app.name
                          ? 'border-primary-400 bg-primary-50 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-slate-50'
                      }`}>
                      <UpiAppLogo app={app} size={40} />
                      <div className="text-left min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{app.name}</p>
                        <p className="text-xs text-gray-400">Instant transfer</p>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.wallet && <p className="form-error"><FontAwesomeIcon icon={faXmarkCircle} className="text-xs" />{errors.wallet}</p>}
              </div>
            )}

            {/* ── COUPON ── */}
            <div className="card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faTicket} className="text-amber-500 text-sm" />
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-gray-900">Coupon / Promo Code</h3>
              </div>

              {/* New-user auto-applied banner */}
              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-emerald-600">{appliedCoupon.label}</p>
                    </div>
                  </div>
                  <button onClick={handleRemoveCoupon}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
                    Remove
                  </button>
                </div>
              )}

              {/* Manual entry */}
              {!appliedCoupon && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                    className="form-input flex-1 uppercase tracking-widest font-mono text-sm"
                  />
                  <button onClick={handleApplyCoupon}
                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-colors flex-shrink-0">
                    Apply
                  </button>
                </div>
              )}

              {couponError   && <p className="text-red-500 text-xs font-semibold mt-2">{couponError}</p>}
              {couponSuccess && !appliedCoupon?.code && <p className="text-emerald-600 text-xs font-semibold mt-2">{couponSuccess}</p>}

              {!appliedCoupon && isNewUser && (
                <p className="text-xs text-gray-400 mt-2">
                  Try <span className="font-bold text-primary-500 cursor-pointer" onClick={() => setCouponInput('FIRSTDRIVE')}>FIRSTDRIVE</span> for 15% off your first booking!
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-3 border-t border-gray-100">
              {[[faLock,'256-bit SSL'],[faShieldHalved,'PCI DSS Compliant'],[faCheckCircle,'RBI Authorised']].map(([icon,label])=>(
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FontAwesomeIcon icon={icon} className="text-emerald-400" />{label}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT — Order summary (desktop) ═══ */}
          <div className="hidden lg:block space-y-4">
            <div className="card p-5">
              <h3 className="font-display font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="flex gap-4 mb-5">
                <img src={car.image} alt={`${car.brand} ${car.model}`}
                  className="w-24 h-16 object-cover rounded-xl flex-shrink-0"
                  onError={e=>{e.target.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80'}} />
                <div>
                  <h4 className="font-display font-bold text-gray-900 leading-tight">{car.brand} {car.model}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{car.category} · {car.year}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[[faGasPump,car.fuelType],[faGear,car.transmission],[faUserGroup,`${car.seatingCapacity} Seats`]].map(([ic,val])=>(
                      <span key={val} className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        <FontAwesomeIcon icon={ic} className="text-gray-400" />{val}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pb-4 border-b border-gray-100">
                {[
                  [faCalendarDays, 'Pick-up',    pickupDate],
                  [faCalendarDays, 'Return',     returnDate],
                  [faLocationDot,  'Pick-up at', pickupLocation],
                  ...(dropoffLocation && dropoffLocation !== pickupLocation
                    ? [[faMapPin, 'Drop-off at', dropoffLocation]] : []),
                  [faCarSide, 'Duration', `${days} day${days>1?'s':''}`],
                ].map(([icon, label, val]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FontAwesomeIcon icon={icon} className="text-[11px] w-3.5" />{label}
                    </div>
                    <span className="font-semibold text-gray-900">{val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-500"><span>{fmt(car.pricePerDay)} × {days} day{days>1?'s':''}</span><span>{fmt(baseFare)}</span></div>
                <div className="flex justify-between text-sm text-gray-500"><span>GST (18%)</span><span>{fmt(tax)}</span></div>
                <div className="flex justify-between text-sm text-gray-500"><span>Convenience fee</span><span>{fmt(convenience)}</span></div>
                {couponSaving > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faTicket} className="text-xs" />
                      Coupon ({appliedCoupon.code})
                    </span>
                    <span>-{fmt(couponSaving)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                  <FontAwesomeIcon icon={faTag} className="text-emerald-500 text-xs" />
                  <span className="text-xs text-emerald-700 font-semibold">FREE cancellation included</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100 font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-primary-600 text-xl font-extrabold">{fmt(grand)}</span>
                </div>
              </div>
            </div>

            {/* Desktop pay button */}
            <button onClick={handlePay}
              className="w-full py-4 text-base font-bold text-white rounded-2xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-3"
              style={{ background: 'linear-gradient(135deg,#1d4ed8 0%,#4f46e5 100%)' }}>
              <FontAwesomeIcon icon={faLock} />
              Pay {fmt(grand)} Securely
            </button>

            <div className="text-center">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                By completing payment you agree to DriveEase's{' '}
                <span className="text-primary-500 cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-primary-500 cursor-pointer hover:underline">Cancellation Policy</span>.
              </p>
            </div>

            <div className="card p-4">
              <p className="text-xs text-gray-400 font-semibold mb-3">Accepted Payment Methods</p>
              <div className="flex flex-wrap gap-2">
                {['Visa','Mastercard','RuPay','Amex','UPI','PhonePe','Paytm','GPay','Net Banking'].map(p=>(
                  <span key={p} className="text-[10px] font-semibold bg-slate-100 text-gray-600 px-2 py-1 rounded-md">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky pay button ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-white border-t border-gray-100 shadow-2xl">
        <button onClick={handlePay}
          className="w-full py-3.5 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg,#1d4ed8 0%,#4f46e5 100%)' }}>
          <FontAwesomeIcon icon={faLock} />
          Pay {fmt(grand)} Securely
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-1.5">
          <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-400 mr-1" />
          256-bit SSL · PCI DSS Compliant
        </p>
      </div>
    </div>
  );
}
