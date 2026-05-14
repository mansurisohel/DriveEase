import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faArrowRight, faCircleCheck, faCode, faRoute,
  faHandshake, faShield, faLeaf, faRocket, faBolt,
  faUserGroup, faLaptop, faLocationDot, faWrench,
  faBullseye, faGlobe, faIndianRupeeSign, faStar,
} from '@fortawesome/free-solid-svg-icons';
import Logo from '../../components/Logo';

import ceoPng     from '../../assets/images/founders/ceo-founder.png';
import ctoPng     from '../../assets/images/founders/cto.png';
import hcsPng     from '../../assets/images/founders/hcs.png';
import headOpsPng from '../../assets/images/founders/head-operations.png';

const buildItems = [
  { icon: faCode,        text: 'Full-stack booking platform with real-time availability' },
  { icon: faRoute,       text: 'One-way trip support across 8+ Indian cities' },
  { icon: faUserGroup,   text: 'Dual-role system for customers and car owners' },
  { icon: faLaptop,      text: 'Owner dashboard: manage cars, bookings & fleet' },
  { icon: faLocationDot, text: 'Pickup & drop-off address collection at booking time' },
  { icon: faWrench,      text: 'Fleet management tools for independent car owners' },
];

const values = [
  { icon: faShield,    title: 'Safety First',    border: 'border-blue-200',   color: 'text-blue-600 bg-blue-50',     desc: 'Every vehicle is inspected before any rental. Your safety is never a compromise.' },
  { icon: faHandshake, title: 'Honest Pricing',  border: 'border-emerald-200',color: 'text-emerald-600 bg-emerald-50',desc: 'No hidden charges, no confusing extras. You see the price, you pay the price.' },
  { icon: faLeaf,      title: 'Going Green',      border: 'border-teal-200',   color: 'text-teal-600 bg-teal-50',    desc: "We're growing our EV fleet. Rental shouldn't cost the planet." },
  { icon: faRocket,    title: 'Built to Scale',   border: 'border-violet-200', color: 'text-violet-600 bg-violet-50', desc: "We're building fast, learning faster, and growing daily from real feedback." },
  { icon: faBolt,      title: 'Instant Booking',  border: 'border-amber-200',  color: 'text-amber-600 bg-amber-50',  desc: 'No lengthy approval queues. Confirm a booking in under two minutes.' },
  { icon: faGlobe,     title: 'Open Platform',    border: 'border-indigo-200', color: 'text-indigo-600 bg-indigo-50', desc: 'Any verified car owner can list their vehicle — no exclusivity, no gatekeeping.' },
];

const team = [
  { name: 'Mansuri Sohel',  role: 'CEO & Founder',        img: ceoPng,     accent: 'from-blue-500 to-indigo-600',   badge: 'bg-blue-100 text-blue-700' },
  { name: 'Arjun Mehta',    role: 'CTO',                  img: ctoPng,     accent: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-700' },
  { name: 'Priya Desai',    role: 'Head of Customer Success', img: hcsPng, accent: 'from-emerald-500 to-teal-600',  badge: 'bg-emerald-100 text-emerald-700' },
  { name: 'Ravi Nair',      role: 'Head of Operations',   img: headOpsPng, accent: 'from-amber-500 to-orange-500',  badge: 'bg-amber-100 text-amber-700' },
];

const timeline = [
  { year: '2024',    side: 'left',  title: 'Idea & Research',      desc: 'Identified the fragmented car rental gap in Tier-1 Indian cities through user interviews and market analysis.' },
  { year: 'Q1 2025', side: 'right', title: 'Platform Built',       desc: 'Developed the full-stack booking platform with owner dashboard, real-time availability, and dual-role auth.' },
  { year: 'Q2 2025', side: 'left',  title: 'First Bookings',       desc: 'Went live in Ahmedabad with 5 vehicles. Processed our first 10 bookings within the first week.' },
  { year: 'Q3 2025', side: 'right', title: 'Fleet Expansion',      desc: 'Grew to 35+ vehicles across 8 cities. Added premium fleet category and payment coupon system.' },
  { year: 'Q4 2025', side: 'left',  title: 'v2 Launch',            desc: 'Launched DriveEase v2 with redesigned UI, policy pages, improved search, and owner analytics.' },
  { year: '2026',    side: 'right', title: 'Scale & Partnerships',  desc: 'Targeting 100+ vehicles, live payment gateway, KYC verification, and corporate fleet partnerships.' },
];

const roadmap = [
  { label: 'Live Payment Gateway',       desc: 'Razorpay / UPI integration replacing the demo flow.',        status: 'In Progress' },
  { label: 'Driver KYC Verification',    desc: 'Aadhaar + licence verification via DigiLocker.',              status: 'In Progress' },
  { label: 'SMS & Email Notifications',  desc: 'Real-time booking confirmations, reminders, and alerts.',     status: 'Planned' },
  { label: 'Ratings & Reviews',          desc: 'Two-way ratings for customers and owners.',                   status: 'Planned' },
  { label: 'Mobile App (Android & iOS)', desc: 'Native app for faster booking and push notifications.',       status: 'Planned' },
  { label: 'Expand to 20+ Cities',       desc: 'Roll out to Tier-1 metros and popular Tier-2 destinations.',  status: 'Planned' },
];

export default function About() {
  return (
    <div className="page-enter">

      {/* Hero */}
      <section className="hero-bg pt-28 pb-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 mb-7 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
            <Logo size="lg" variant="light" />
          </div>
          <h1 className="font-display font-black text-white text-4xl sm:text-5xl mb-5 leading-tight">
            We're building something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-orange-300">new</span>
          </h1>
          <p className="text-white/65 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            DriveEase is an early-stage car rental platform built in Ahmedabad, India — a small, focused team solving a real problem from the ground up.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/cars" className="btn-accent px-7 py-3 font-bold">
              Browse Fleet <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
            <Link to="/contact" className="border border-white/20 hover:border-white/40 hover:bg-white/10 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Honest intro */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="section-tag">Where We Are Right Now</p>
              <h2 className="section-title text-3xl md:text-4xl mb-5">Early stage. Real ambition.</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>Car rental in India is fragmented, over-complicated, and full of friction for both customers and independent car owners. We started DriveEase to change that — by building a clean, transparent platform that works equally well for the person renting a car and the person offering one.</p>
                <p>Right now, we're in active development. The platform you're using is a working product — you can browse, book, and manage rentals end to end. But we're still growing, still adding cities, still refining the experience based on what we hear from real users.</p>
                <p>We believe the best products are built in the open, iteratively, with honest communication. That's how we operate.</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-3xl p-8 border border-gray-100">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">What we've built so far</p>
              <ul className="space-y-3">
                {buildItems.map(item => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={item.icon} className="text-primary-600 text-xs" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-tag">Our Journey</p>
            <h2 className="section-title text-3xl md:text-4xl">From idea to platform</h2>
          </div>
          <div className="relative">
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-px" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <div key={i} className={`flex flex-col sm:flex-row gap-6 items-start sm:items-center ${t.side === 'right' ? 'sm:flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <div className={`card p-5 ${t.side === 'right' ? 'sm:text-right' : ''}`}>
                      <span className="inline-block text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full mb-2">{t.year}</span>
                      <h3 className="font-display font-bold text-gray-900 text-base mb-1">{t.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow flex-shrink-0 z-10" />
                  <div className="flex-1 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-tag">What We Stand For</p>
            <h2 className="section-title text-3xl md:text-4xl">Our principles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(v => (
              <div key={v.title} className={`p-6 rounded-2xl border-2 ${v.border} hover:shadow-card transition-all duration-300`}>
                <div className={`w-12 h-12 ${v.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <FontAwesomeIcon icon={v.icon} className="text-lg" />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-base mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-tag">The Team</p>
            <h2 className="section-title text-3xl md:text-4xl">The people building DriveEase</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(m => (
              <div key={m.name} className="card p-6 text-center hover:shadow-card-hover transition-all duration-300">
                <div className={`w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-4 bg-gradient-to-br ${m.accent} p-0.5`}>
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover rounded-2xl" />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-sm mb-1">{m.name}</h3>
                <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${m.badge}`}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-tag">The Roadmap</p>
            <h2 className="section-title text-3xl md:text-4xl">What we're working toward</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-3 text-sm leading-relaxed">These aren't vague promises — they're the actual features and expansions on our near-term roadmap.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roadmap.map(item => (
              <div key={item.label} className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-300">
                <FontAwesomeIcon icon={faCircleCheck} className={`text-lg flex-shrink-0 mt-0.5 ${item.status === 'In Progress' ? 'text-primary-500' : 'text-gray-300'}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-display font-bold text-gray-900 text-sm">{item.label}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'In Progress' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>{item.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Car Owners */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-card space-y-5">
              <div className="inline-flex items-center justify-center  bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
            <Logo size="lg" variant="dark" />
          </div>
              <h3 className="font-display font-bold text-xl text-gray-900">Own a car? List it.</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Independent car owners can register vehicles, set their own prices, manage availability, and accept or decline bookings — all from a dedicated owner dashboard.</p>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="text-emerald-600 text-lg flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-700 font-semibold">Potential monthly earnings</p>
                  <p className="font-display font-black text-emerald-800 text-xl">₹85,000 / month</p>
                </div>
              </div>
              <ul className="space-y-2">
                {["Set your own daily rate","Approve bookings before they're confirmed","Track revenue from your dashboard","Manage your entire fleet from one place"].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-xs flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link to="/owner-register" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Register as an owner <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </Link>
            </div>
            <div>
              <p className="section-tag">For Car Owners</p>
              <h2 className="section-title text-3xl md:text-4xl mb-4">Your car, your terms.</h2>
              <p className="text-gray-600 leading-relaxed text-sm">We built the owner side of DriveEase because there are hundreds of privately owned vehicles in every major Indian city sitting idle most of the time. We want to give those owners a professional, easy-to-use platform to put their cars to work — without the overhead of running a rental company themselves.</p>
              <p className="text-gray-600 leading-relaxed text-sm mt-4">It's early, but the tools are real and the bookings are live.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-bg py-20 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center px-6 py-3 mb-7 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
            <Logo size="md" variant="light" />
          </div>
          <h2 className="font-display font-black text-white text-4xl mb-4">Try it yourself.</h2>
          <p className="text-white/60 text-base mb-8">Browse our fleet, make a booking, and see how far we've come — and where we're headed.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/cars" className="btn-accent px-8 py-4 text-base font-bold">
              Browse Cars <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <Link to="/contact" className="border border-white/20 hover:border-white/40 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-base">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
