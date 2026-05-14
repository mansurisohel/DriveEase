import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotateLeft, faChevronRight, faIndianRupeeSign,
  faCircleCheck, faXmark, faClock, faEnvelope,
  faCarCrash, faCalendarXmark, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

const tiers = [
  {
    pct: '100%',
    label: 'Full Refund',
    when: 'More than 48 hours before booking start',
    color: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    pct: '75%',
    label: 'Partial Refund',
    when: '24–48 hours before booking start',
    color: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    pct: '50%',
    label: 'Half Refund',
    when: 'Less than 24 hours before booking start',
    color: 'bg-orange-400',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    pct: '0%',
    label: 'No Refund',
    when: 'No-show or after booking start time',
    color: 'bg-red-400',
    badge: 'bg-red-100 text-red-700',
  },
];

const sections = [
  {
    icon: faEnvelope,
    title: 'How to Request a Refund',
    color: 'text-blue-600 bg-blue-50',
    content: `To request a refund, go to My Bookings in your account, select the booking you wish to cancel, and click "Cancel Booking". The refund will be processed automatically based on the cancellation timeline above. You will receive a confirmation email within a few minutes. Refunds are processed to your original payment method.`,
  },
  {
    icon: faCalendarXmark,
    title: 'Owner-Initiated Cancellations',
    color: 'text-violet-600 bg-violet-50',
    content: `If a car owner cancels your confirmed booking, you are entitled to a full 100% refund regardless of how close to the booking start time the cancellation occurs. We will also try to help you find an alternative vehicle from our fleet. Repeated owner cancellations result in the owner being suspended from the platform.`,
  },
  {
    icon: faXmark,
    title: 'Non-Refundable Situations',
    color: 'text-red-600 bg-red-50',
    content: `The following charges are non-refundable under any circumstances: the ₹49 convenience fee, any add-on services already consumed (fuel, driver services, accessories), and bookings cancelled after the vehicle has been handed over. Refunds are also not applicable for trips cut short due to traffic violations or misuse of the vehicle.`,
  },
  {
    icon: faClock,
    title: 'Early Return Policy',
    color: 'text-teal-600 bg-teal-50',
    content: `If you return the vehicle earlier than the scheduled return date, you may be eligible for a partial refund for the unused days, subject to the car owner's approval. Early return credits are calculated on a pro-rata daily basis minus a ₹200 processing fee per day returned early. Contact support to initiate an early return.`,
  },
  {
    icon: faCarCrash,
    title: 'Damage Disputes',
    color: 'text-orange-600 bg-orange-50',
    content: `In cases where a damage deposit has been charged, it will be released within 3 business days after the vehicle is inspected and returned in satisfactory condition. If damage is found, the cost of repair up to the deposit amount may be deducted. Disputes must be raised within 48 hours of vehicle return.`,
  },
  {
    icon: faIndianRupeeSign,
    title: 'Refund Timelines',
    color: 'text-emerald-600 bg-emerald-50',
    content: `Refunds are processed within 5–7 business days for card payments. UPI refunds typically appear within 1–3 business days. Net banking refunds may take up to 7–10 business days depending on your bank. We initiate all refunds within 24 hours of the cancellation request.`,
  },
  {
    icon: faExclamationTriangle,
    title: 'Exceptional Circumstances',
    color: 'text-amber-600 bg-amber-50',
    content: `In cases of medical emergencies, natural disasters, or government-imposed travel restrictions, DriveEase may at its discretion provide a full refund or trip credit regardless of the standard cancellation timeline. Supporting documentation may be required. Contact our support team as soon as possible in such situations.`,
  },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="hero-bg py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-5">
            <FontAwesomeIcon icon={faRotateLeft} className="text-white text-2xl" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">Refund Policy</h1>
          <p className="text-white/70 text-base max-w-xl mx-auto">
            Clear, fair refund rules — no surprises.
          </p>
          <div className="flex items-center justify-center gap-2 mt-5 text-white/50 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            <span className="text-white/80">Refund Policy</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Visual refund schedule */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-gray-900 text-xl mb-2 text-center">Cancellation Refund Schedule</h2>
          <p className="text-gray-500 text-sm text-center mb-8">How much you get back depends on when you cancel.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tiers.map(t => (
              <div key={t.pct} className="card p-5 text-center">
                <div className={`w-12 h-12 ${t.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-black text-sm">{t.pct}</span>
                </div>
                <p className="font-display font-bold text-gray-900 text-base mb-1">{t.label}</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${t.badge} mb-2`}>
                  {t.pct} back
                </span>
                <p className="text-xs text-gray-500 leading-snug">{t.when}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed sections */}
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  <FontAwesomeIcon icon={s.icon} className="text-sm" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-gray-900 text-lg mb-2">{s.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-100 flex flex-wrap gap-4 justify-center">
          {[
            { label: 'Privacy Policy',    to: '/privacy-policy' },
            { label: 'Terms & Conditions', to: '/terms' },
            { label: 'Sitemap',            to: '/sitemap' },
            { label: 'Contact Us',         to: '/contact' },
          ].map(l => (
            <Link key={l.to} to={l.to}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
