import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileContract, faChevronRight, faCircleCheck, faCar,
  faIndianRupeeSign, faShield, faRotateLeft, faGavel,
  faUser, faBan, faBuilding,
} from '@fortawesome/free-solid-svg-icons';

const sections = [
  {
    icon: faCircleCheck,
    title: 'Acceptance of Terms',
    color: 'text-emerald-600 bg-emerald-50',
    content: `By accessing or using DriveEase, you confirm that you are at least 18 years of age, hold a valid driving licence, and agree to be bound by these Terms & Conditions. If you do not agree to any part of these terms, please discontinue use of our platform immediately.`,
  },
  {
    icon: faUser,
    title: 'Eligibility',
    color: 'text-blue-600 bg-blue-50',
    content: `To rent a vehicle through DriveEase you must: (a) be at least 18 years old; (b) hold a valid Indian driving licence for the vehicle category you wish to rent; (c) provide a government-issued photo ID; and (d) have a valid payment method. We reserve the right to decline bookings at our discretion.`,
  },
  {
    icon: faIndianRupeeSign,
    title: 'Bookings & Payments',
    color: 'text-violet-600 bg-violet-50',
    content: `All prices are displayed in Indian Rupees (INR) and include applicable taxes. A booking is confirmed only upon successful payment. The platform charges an 18% GST and a convenience fee of ₹49 per booking. Payments are processed securely — DriveEase does not store card or UPI credentials on our servers.`,
  },
  {
    icon: faCircleCheck,
    title: 'First-Booking Discount',
    color: 'text-amber-600 bg-amber-50',
    content: `First-time users are eligible for a 15% discount using the coupon code FIRSTDRIVE. This discount applies to the base fare only and cannot be combined with other promotions. The coupon is valid for one use per user account and expires 30 days after account registration.`,
  },
  {
    icon: faCar,
    title: 'Vehicle Use',
    color: 'text-indigo-600 bg-indigo-50',
    content: `Rented vehicles must be used only by the registered driver and only for lawful purposes within India. You must not use the vehicle for racing, towing, transporting hazardous materials, or any illegal activity. Smoking, pets (unless explicitly approved), and off-road driving are prohibited unless stated otherwise in the specific vehicle listing.`,
  },
  {
    icon: faShield,
    title: 'Damage & Liability',
    color: 'text-red-600 bg-red-50',
    content: `The renter is responsible for any damage to the vehicle during the rental period, including damage caused by third parties. You must report any accident or damage to DriveEase and the vehicle owner immediately. Insurance options may be available at the time of booking. DriveEase's liability is limited to the rental amount paid.`,
  },
  {
    icon: faRotateLeft,
    title: 'Cancellations',
    color: 'text-teal-600 bg-teal-50',
    content: `Cancellations made more than 48 hours before the booking start time are eligible for a full refund. Cancellations between 24–48 hours receive a 75% refund. Cancellations within 24 hours receive a 50% refund. No-shows or cancellations after the booking start time are non-refundable. See our Refund Policy for full details.`,
  },
  {
    icon: faBuilding,
    title: 'Owner Responsibilities',
    color: 'text-cyan-600 bg-cyan-50',
    content: `Car owners who list vehicles on DriveEase must ensure their vehicles are roadworthy, properly insured, and comply with all applicable road transport laws. Owners must honour confirmed bookings. Repeated cancellations or poor vehicle condition may result in removal from the platform.`,
  },
  {
    icon: faBan,
    title: 'Intellectual Property',
    color: 'text-orange-600 bg-orange-50',
    content: `All content on the DriveEase platform, including logos, design, text, and software, is the property of DriveEase Pvt. Ltd. and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.`,
  },
  {
    icon: faGavel,
    title: 'Governing Law',
    color: 'text-gray-600 bg-gray-100',
    content: `These Terms & Conditions are governed by the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra. DriveEase reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.`,
  },
];

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="hero-bg py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-5">
            <FontAwesomeIcon icon={faFileContract} className="text-white text-2xl" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">Terms &amp; Conditions</h1>
          <p className="text-white/70 text-base max-w-xl mx-auto">
            Please read these terms carefully before using our platform.
          </p>
          <div className="flex items-center justify-center gap-2 mt-5 text-white/50 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            <span className="text-white/80">Terms &amp; Conditions</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Summary callout */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-semibold text-violet-800 mb-1">Summary</p>
          <p className="text-sm text-violet-700 leading-relaxed">
            Using DriveEase means you agree to use vehicles responsibly, pay all charges honestly, and follow Indian traffic laws. We aim to be fair — if something goes wrong, we'll work with you to resolve it. Last updated <strong>1 January 2026</strong>.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  <FontAwesomeIcon icon={s.icon} className="text-sm" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-gray-900 text-lg mb-2">{i + 1}. {s.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-links */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-100 flex flex-wrap gap-4 justify-center">
          {[
            { label: 'Privacy Policy', to: '/privacy-policy' },
            { label: 'Refund Policy',  to: '/refund-policy' },
            { label: 'Sitemap',        to: '/sitemap' },
            { label: 'Contact Us',     to: '/contact' },
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
