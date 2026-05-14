import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShield, faChevronRight, faDatabase, faCookieBite,
  faUserShield, faEye, faEnvelope, faChild,
  faRotate, faPhone, faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

const sections = [
  {
    icon: faDatabase,
    title: 'Information We Collect',
    color: 'text-blue-600 bg-blue-50',
    content: `We collect information you provide directly to us, such as your name, email address, phone number, and payment details when you register or make a booking. We also automatically collect certain technical information when you use our platform, including your IP address, browser type, device identifiers, and usage data to improve our services.`,
  },
  {
    icon: faEye,
    title: 'How We Use Your Information',
    color: 'text-violet-600 bg-violet-50',
    content: `Your information is used to process bookings, facilitate payments, communicate booking confirmations and updates, provide customer support, personalise your experience, and improve our platform. We may also use your data to send promotional offers with your consent, which you may withdraw at any time.`,
  },
  {
    icon: faUserShield,
    title: 'Information Sharing',
    color: 'text-emerald-600 bg-emerald-50',
    content: `We do not sell your personal data to third parties. We may share your information with car owners to fulfil your bookings, payment processors to complete transactions, and service providers who assist in operating our platform under strict confidentiality agreements. We may disclose information when required by law or to protect the rights and safety of our users.`,
  },
  {
    icon: faShield,
    title: 'Data Security',
    color: 'text-indigo-600 bg-indigo-50',
    content: `We implement industry-standard security measures including SSL/TLS encryption, secure data storage, and access controls to protect your personal information. While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet or electronic storage is 100% secure.`,
  },
  {
    icon: faCookieBite,
    title: 'Cookies & Tracking',
    color: 'text-amber-600 bg-amber-50',
    content: `We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyse platform usage. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, some portions of our service may not function properly.`,
  },
  {
    icon: faCircleCheck,
    title: 'Your Rights',
    color: 'text-teal-600 bg-teal-50',
    content: `You have the right to access, update, or delete your personal information at any time through your account settings. You may also request a copy of data we hold about you, object to processing, or withdraw consent for marketing communications. To exercise these rights, contact us at privacy@driveease.in.`,
  },
  {
    icon: faChild,
    title: "Children's Privacy",
    color: 'text-pink-600 bg-pink-50',
    content: `Our service is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information immediately.`,
  },
  {
    icon: faRotate,
    title: 'Policy Changes',
    color: 'text-orange-600 bg-orange-50',
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the effective date. Continued use of our service after changes constitutes your acceptance of the revised policy.`,
  },
  {
    icon: faEnvelope,
    title: 'Contact Us',
    color: 'text-gray-600 bg-gray-100',
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy Team at privacy@driveease.in or write to us at DriveEase Pvt. Ltd., Plot 42, BKC, Bandra East, Mumbai, Maharashtra 400051.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="hero-bg py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-5">
            <FontAwesomeIcon icon={faShield} className="text-white text-2xl" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">Privacy Policy</h1>
          <p className="text-white/70 text-base max-w-xl mx-auto">
            We respect your privacy. Here's exactly how we handle your data.
          </p>
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mt-5 text-white/50 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            <span className="text-white/80">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Summary callout */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10">
          <p className="text-sm font-semibold text-blue-800 mb-1">Summary</p>
          <p className="text-sm text-blue-700 leading-relaxed">
            DriveEase collects only the data needed to operate our car rental platform. We never sell your personal information, we store it securely, and you can request deletion at any time. This policy was last updated on <strong>1 January 2026</strong>.
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
            { label: 'Terms & Conditions', to: '/terms' },
            { label: 'Refund Policy',      to: '/refund-policy' },
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
