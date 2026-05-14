import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSitemap, faChevronRight, faHome, faCar, faInfoCircle,
  faEnvelope, faUser, faClipboardList, faGear,
  faTachometerAlt, faPlus, faList, faCalendarCheck,
  faUserShield, faShield, faFileContract, faRotateLeft,
  faLock, faSignIn,
} from '@fortawesome/free-solid-svg-icons';

const groups = [
  {
    title: 'Main Pages',
    color: 'border-blue-200 bg-blue-50/40',
    headerColor: 'text-blue-700',
    iconBg: 'bg-blue-100 text-blue-600',
    links: [
      { icon: faHome,        label: 'Home',        to: '/',        desc: 'Discover DriveEase and browse featured vehicles.' },
      { icon: faCar,         label: 'Cars',         to: '/cars',    desc: 'Browse our full fleet and filter by type, fuel, and more.' },
      { icon: faInfoCircle,  label: 'About',        to: '/about',   desc: 'Learn about our story, team, and roadmap.' },
      { icon: faEnvelope,    label: 'Contact',      to: '/contact', desc: 'Get in touch with our support team.' },
    ],
  },
  {
    title: 'User Account',
    color: 'border-violet-200 bg-violet-50/40',
    headerColor: 'text-violet-700',
    iconBg: 'bg-violet-100 text-violet-600',
    links: [
      { icon: faSignIn,       label: 'Login',          to: '/login',           desc: 'Sign in to your DriveEase account.' },
      { icon: faUser,         label: 'Register',        to: '/register',        desc: 'Create a new user account.' },
      { icon: faClipboardList, label: 'My Bookings',    to: '/my-bookings',     desc: 'View, manage, and track your bookings.', auth: true },
      { icon: faGear,         label: 'Manage Account',  to: '/manage-account',  desc: 'Update profile, password, and linked accounts.', auth: true },
    ],
  },
  {
    title: 'Owner Portal',
    color: 'border-emerald-200 bg-emerald-50/40',
    headerColor: 'text-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-600',
    links: [
      { icon: faSignIn,       label: 'Owner Login',      to: '/owner-login',           desc: 'Sign in to the owner dashboard.' },
      { icon: faUser,         label: 'Owner Register',   to: '/owner-register',        desc: 'List your vehicles and start earning.' },
      { icon: faTachometerAlt, label: 'Dashboard',       to: '/owner',                 desc: 'Overview of bookings, revenue, and fleet.', auth: true, owner: true },
      { icon: faPlus,         label: 'Add Car',           to: '/owner/add-car',         desc: 'List a new vehicle on the platform.', auth: true, owner: true },
      { icon: faList,         label: 'Manage Cars',       to: '/owner/manage-cars',     desc: 'Edit, remove, or update your vehicle listings.', auth: true, owner: true },
      { icon: faCalendarCheck, label: 'Manage Bookings',  to: '/owner/manage-bookings', desc: 'Accept, reject, and track all bookings.', auth: true, owner: true },
      { icon: faUserShield,   label: 'Manage Admins',     to: '/owner/manage-admins',   desc: 'Add and control admin accounts.', auth: true, owner: true },
    ],
  },
  {
    title: 'Legal & Policies',
    color: 'border-gray-200 bg-gray-50/40',
    headerColor: 'text-gray-700',
    iconBg: 'bg-gray-100 text-gray-600',
    links: [
      { icon: faShield,       label: 'Privacy Policy',    to: '/privacy-policy', desc: 'How we collect, use, and protect your data.' },
      { icon: faFileContract, label: 'Terms & Conditions', to: '/terms',          desc: 'Rules and agreements for using DriveEase.' },
      { icon: faRotateLeft,   label: 'Refund Policy',     to: '/refund-policy',  desc: 'Cancellation timelines and refund rules.' },
      { icon: faSitemap,      label: 'Sitemap',            to: '/sitemap',        desc: 'You\'re here — overview of all pages.' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="hero-bg py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-5">
            <FontAwesomeIcon icon={faSitemap} className="text-white text-2xl" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-3">Sitemap</h1>
          <p className="text-white/70 text-base max-w-xl mx-auto">
            Every page on DriveEase, organised for easy navigation.
          </p>
          <div className="flex items-center justify-center gap-2 mt-5 text-white/50 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            <span className="text-white/80">Sitemap</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {groups.map(g => (
            <div key={g.title} className={`rounded-2xl border p-6 ${g.color}`}>
              <h2 className={`font-display font-bold text-lg mb-5 ${g.headerColor}`}>{g.title}</h2>
              <ul className="space-y-3">
                {g.links.map(l => (
                  <li key={l.to}>
                    <Link to={l.to}
                      className="flex items-start gap-3 group hover:bg-white/60 rounded-xl p-2 -mx-2 transition-all">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${g.iconBg}`}>
                        <FontAwesomeIcon icon={l.icon} className="text-xs" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                            {l.label}
                          </span>
                          {l.owner && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              <FontAwesomeIcon icon={faUserShield} className="text-[8px]" /> Owner
                            </span>
                          )}
                          {l.auth && !l.owner && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              <FontAwesomeIcon icon={faLock} className="text-[8px]" /> Login required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{l.desc}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
