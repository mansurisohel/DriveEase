import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faLocationDot, faPhone, faEnvelope,
  faChevronRight, faPaperPlane, faCircleCheck, faClock
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF, faTwitter, faInstagram, faLinkedinIn, faYoutube, faWhatsapp
} from '@fortawesome/free-brands-svg-icons';
import { menuLinks } from '../assets/assets';
import toast from 'react-hot-toast';

const social = [
  { icon: faFacebookF,  href: '#', label: 'Facebook',  color: 'hover:bg-blue-600' },
  { icon: faInstagram,  href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: faTwitter,    href: '#', label: 'Twitter',   color: 'hover:bg-sky-500' },
  { icon: faWhatsapp,   href: '#', label: 'WhatsApp',  color: 'hover:bg-green-600' },
  { icon: faYoutube,    href: '#', label: 'YouTube',   color: 'hover:bg-red-600' },
];

const services = [
  'Self-Drive Rental',
  'Airport Transfer',
  'Long-Term Rental',
  'Corporate Fleet',
  'Wedding Cars',
  'Electric Vehicles',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed! Welcome to DriveEase updates.');
    setEmail('');
  };

  return (
    <footer className="bg-[#0a1628] text-gray-400">

      {/* ── Top CTA ── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-black text-white text-2xl mb-1">Ready to Hit the Road?</h3>
              <p className="text-gray-400 text-sm">Serving 120+ happy customers across 8+ Indian cities.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/cars" className="btn-primary">
                <FontAwesomeIcon icon={faCar} />
                Browse Fleet
              </Link>
              <Link to="/contact"
                className="border border-white/15 text-gray-300 hover:text-white hover:border-white/30
                  hover:bg-white/5 font-semibold px-6 py-3 rounded-xl transition-all duration-200
                  inline-flex items-center gap-2">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-3">
              <Logo size="lg" variant="light" />
            </Link>
            <p className="text-xs text-primary-400 font-semibold tracking-wide mb-4">
              India's Premium Car Rental Platform
            </p>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Offering premium vehicles, transparent pricing, and a booking experience
              that actually feels good — across 8+ Indian cities.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available 24×7 across India
            </div>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {social.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className={`w-9 h-9 bg-white/6 ${s.color} border border-white/8
                    rounded-lg flex items-center justify-center text-gray-500
                    hover:text-white transition-all duration-200 hover:border-transparent`}>
                  <FontAwesomeIcon icon={s.icon} className="text-xs" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5">
              {[...menuLinks, { label: 'My Bookings', path: '/my-bookings' }, { label: 'Owner Portal', path: '/owner-login' }].map(link => (
                <li key={link.path}>
                  <Link to={link.path}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white group transition-colors duration-200">
                    <FontAwesomeIcon icon={faChevronRight}
                      className="text-[10px] text-gray-700 group-hover:text-primary-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm tracking-wide">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map(s => (
                <li key={s}>
                  <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white group transition-colors duration-200">
                    <FontAwesomeIcon icon={faChevronRight}
                      className="text-[10px] text-gray-700 group-hover:text-primary-400 transition-colors" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm tracking-wide">Get in Touch</h4>
            <ul className="space-y-3 mb-7">
              {[
                { icon: faLocationDot, content: '325/15, Bhairavnath Road, Maniangar Ahmadabad-380028' },
                { icon: faPhone,    content: '+91 931364 34177', href: 'tel:+93164 34177' },
                { icon: faEnvelope, content: 'support@driveease.in', href: 'mailto:support@driveease.in' },
                { icon: faClock,    content: 'Mon–Sun: 8AM–10PM IST\nRoadside: 24×7 Emergency' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-white/8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={item.icon} className="text-primary-400" style={{ fontSize: '11px' }} />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-gray-500 hover:text-white transition-colors whitespace-pre-line leading-snug">
                      {item.content}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500 whitespace-pre-line leading-snug">{item.content}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-semibold text-white mb-2.5">Get Updates & Deals</p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm py-2">
                  <FontAwesomeIcon icon={faCircleCheck} />
                  <span>You're subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-white/6 border border-white/10 text-white text-sm px-3.5 py-2.5
                      rounded-l-xl focus:outline-none focus:border-primary-500 placeholder-gray-600
                      transition-colors min-w-0" />
                  <button type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3.5 py-2.5
                      rounded-r-xl transition-colors flex-shrink-0">
                    <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                  </button>
                </form>
              )}
              <p className="text-gray-600 text-xs mt-2">No spam · Unsubscribe anytime</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} DriveEase Pvt. Ltd. All rights reserved. · Made with love in India
            </p>
            <div className="flex flex-wrap items-center gap-5">
              {[
                { label: 'Privacy Policy',  to: '/privacy-policy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Refund Policy',   to: '/refund-policy' },
                { label: 'Sitemap',         to: '/sitemap' },
              ].map(item => (
                <Link key={item.to} to={item.to} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
