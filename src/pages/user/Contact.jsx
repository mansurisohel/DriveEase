import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot, faPhone, faEnvelope, faClock,
  faHeadset, faChevronDown, faCommentDots, faPaperPlane,
  faCheckCircle, faShield, faCar, faRocket, faUser, faTag,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import toast from 'react-hot-toast';
import { useContact } from '../../context/ContactContext';

const contactInfo = [
  { icon: faLocationDot, label: 'Headquarters', value: '325/15, Bhairavnath Road, Maniangar\nAhmadabad-380028', color: 'text-blue-600 bg-blue-50' },
  { icon: faPhone, label: 'Phone / WhatsApp', value: '+91 93164 34177', href: 'tel:+919316434177', color: 'text-emerald-600 bg-emerald-50' },
  { icon: faEnvelope, label: 'Email', value: 'support@driveease.in', href: 'mailto:support@driveease.in', color: 'text-violet-600 bg-violet-50' },
  { icon: faClock, label: 'Support Hours', value: 'Mon – Sun: 8AM – 10PM IST\nRoadside: 24×7 Emergency', color: 'text-amber-600 bg-amber-50' },
];

const faqs = [
  { q: 'How do I book a car on DriveEase?', a: 'Browse our fleet, select a vehicle, choose your pickup & return dates, and confirm your booking in under 2 minutes. UPI, cards, and net banking accepted.' },
  { q: 'Is there a minimum rental period?', a: 'Our minimum rental is 1 day (24 hours). Weekly and monthly packages are available at discounted rates.' },
  { q: "What documents do I need to rent?", a: "You'll need a valid Aadhaar/PAN card for identity, a valid Indian driving licence, and a selfie at pickup. No extra paperwork." },
  { q: 'Can I cancel or modify my booking?', a: 'Yes — free cancellation up to 24 hours before pickup. Modifications are free anytime before the rental starts.' },
  { q: 'Is fuel included in the rental price?', a: 'Cars are delivered with a full tank. Please return with a full tank, or a refuelling fee (actuals) will be charged.' },
  { q: 'Are the cars insured?', a: 'All our cars carry comprehensive insurance. Optional add-on zero-deductible coverage is available at booking for ₹199/day.' },
];

const subjects = ['Booking Support', 'Payment Issue', 'Vehicle Damage', 'Refund Request', 'Partnership Enquiry', 'Other'];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors duration-200 ${open ? 'border-primary-200 bg-primary-50/30' : 'border-gray-100 bg-white'}`}>
      <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" onClick={() => setOpen(!open)}>
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        <FontAwesomeIcon icon={faChevronDown} className={`text-gray-400 text-xs flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-primary-600' : ''}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{a}</div>}
    </div>
  );
};

function FloatingInput({ label, type = 'text', value, onChange, error, placeholder, icon }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isActive = focused || hasValue;
  const inputId = `fi-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="relative">
      {icon && (
        <div className={`absolute left-4 pointer-events-none transition-colors duration-200 z-10 ${isActive ? 'text-primary-500' : 'text-gray-300'}`}
          style={{ top: isActive ? '1.625rem' : '50%', transform: isActive ? 'none' : 'translateY(-50%)' }}>
          <FontAwesomeIcon icon={icon} className="text-sm" />
        </div>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={isActive ? (placeholder || '') : ''}
        className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 pt-7 pb-2 rounded-xl border-2 text-sm font-medium text-gray-900
          bg-white outline-none transition-all duration-200
          ${error ? 'border-red-300 bg-red-50/30 focus:border-red-400'
            : focused ? 'border-primary-400 shadow-[0_0_0_4px_rgba(59,130,246,0.08)]'
            : hasValue ? 'border-gray-300' : 'border-gray-200 hover:border-gray-300'}`}
      />
      <label
        htmlFor={inputId}
        className={`absolute pointer-events-none transition-all duration-200 select-none
          ${isActive
            ? `top-2 text-[10px] font-bold tracking-wider uppercase ${error ? 'text-red-500' : 'text-primary-600'}`
            : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 font-normal'}`}
        style={{ left: icon ? '2.75rem' : '1rem' }}>
        {label}
      </label>
      {error && <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500 inline-block flex-shrink-0" />{error}</p>}
    </div>
  );
}

export default function ContactPage() {
  const { addContactMessage } = useContact();
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [msgFocused, setMsgFocused] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Please enter your full name (min. 2 chars).';
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/))       e.email = 'Enter a valid email address.';
    if (!form.subject)                                      e.subject = 'Please select a subject.';
    if (form.message.trim().length < 20)                   e.message = 'Message must be at least 20 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    addContactMessage(form);
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const msgProgress = Math.min(100, (form.message.length / 20) * 100);
  const ticketId = `DRV-${Date.now().toString().slice(-6)}`;

  return (
    <div className="page-enter">

      {/* Hero */}
      <section className="hero-bg pt-16 pb-20 relative overflow-hidden mt-10">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <FontAwesomeIcon icon={faHeadset} className="text-accent-400 text-xs" />
            We're Here to Help
          </div>
          <h1 className="font-display font-black text-white text-5xl md:text-6xl mb-5">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-orange-300">Touch</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question about a booking, need help with your rental, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map(info => (
              <div key={info.label} className="card p-6 hover:shadow-card-hover transition-all duration-300 group">
                <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={info.icon} className="text-base" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{info.label}</p>
                {info.href
                  ? <a href={info.href} className="text-gray-900 font-semibold text-sm hover:text-primary-600 transition-colors">{info.value}</a>
                  : <p className="text-gray-900 font-semibold text-sm whitespace-pre-line">{info.value}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-8 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            {[
              { icon: faRocket,      label: 'Avg Response',    value: '< 5 min' },
              { icon: faShield,      label: 'Support Hours',   value: '8AM–10PM' },
              { icon: faCar,         label: 'Emergency Line',  value: '24×7' },
              { icon: faCheckCircle, label: 'Issues Resolved', value: '98.4%' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3 px-4 sm:px-6 py-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={s.icon} className="text-white text-sm" />
                </div>
                <div>
                  <p className="font-display font-extrabold text-white text-lg leading-none">{s.value}</p>
                  <p className="text-blue-200 text-[10px] mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Contact Form */}
            <div>
              <p className="section-tag">Send a Message</p>
              <h2 className="section-title text-2xl md:text-3xl mb-2">How Can We Help You?</h2>
              <p className="text-gray-500 text-sm mb-8">Fill in the form and our team will reply within 24 hours.</p>

              {submitted ? (
                <div className="card p-10 text-center animate-fade-in">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-white text-3xl" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm mb-3">We've received your message and will reply within 24 hours.</p>
                  <p className="text-xs text-primary-600 font-bold bg-primary-50 border border-primary-100 rounded-lg px-4 py-2 inline-block mb-8">
                    Ticket ID: {ticketId}
                  </p>
                  <br />
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card overflow-hidden shadow-card">
                  {/* Form header */}
                  <div className="px-6 pt-6 pb-5 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-blue-50/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-primary-100 flex-shrink-0">
                        <FontAwesomeIcon icon={faPaperPlane} className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-gray-900 text-base">New Support Request</h3>
                        <p className="text-xs text-gray-400">Avg. response in 5 min · Mon–Sun, 8AM–10PM IST</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FloatingInput
                        label="Full Name" value={form.name}
                        onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                        error={errors.name} placeholder="e.g. Sohel Khan" icon={faUser}
                      />
                      <FloatingInput
                        label="Email Address" type="email" value={form.email}
                        onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                        error={errors.email} placeholder="you@example.com" icon={faEnvelope}
                      />
                    </div>

                    {/* Subject select */}
                    <div className="relative">
                      <div className={`absolute left-4 pointer-events-none transition-colors duration-200 z-10 ${subjectFocused || form.subject ? 'text-primary-500' : 'text-gray-300'}`}
                        style={{ top: subjectFocused || form.subject ? '1.625rem' : '50%', transform: subjectFocused || form.subject ? 'none' : 'translateY(-50%)' }}>
                        <FontAwesomeIcon icon={faTag} className="text-sm" />
                      </div>
                      <select
                        value={form.subject}
                        onChange={e => { setForm({ ...form, subject: e.target.value }); setErrors({ ...errors, subject: '' }); }}
                        onFocus={() => setSubjectFocused(true)}
                        onBlur={() => setSubjectFocused(false)}
                        className={`w-full pl-11 pr-9 pt-7 pb-2 rounded-xl border-2 text-sm font-medium
                          bg-white outline-none appearance-none cursor-pointer transition-all duration-200
                          ${form.subject ? 'text-gray-900' : 'text-transparent'}
                          ${errors.subject ? 'border-red-300 bg-red-50/30'
                            : subjectFocused ? 'border-primary-400 shadow-[0_0_0_4px_rgba(59,130,246,0.08)]'
                            : form.subject ? 'border-gray-300' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <option value="" disabled>Choose a subject…</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <label htmlFor="contact-subject" className={`absolute pointer-events-none transition-all duration-200 select-none
                        ${subjectFocused || form.subject
                          ? `top-2 text-[10px] font-bold tracking-wider uppercase ${errors.subject ? 'text-red-500' : 'text-primary-600'}`
                          : 'top-1/2 -translate-y-1/2 text-sm text-gray-400 font-normal'}`}
                        style={{ left: '2.75rem' }}>
                        Subject
                      </label>
                      {form.subject && (
                        <span className="absolute pointer-events-none text-sm font-medium text-gray-900"
                          style={{ left: '2.75rem', top: '1.625rem' }}>{form.subject}</span>
                      )}
                      <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs pointer-events-none" />
                      {errors.subject && <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full inline-block" />{errors.subject}</p>}
                    </div>

                    {/* Message textarea */}
                    <div className="relative">
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                        onFocus={() => setMsgFocused(true)}
                        onBlur={() => setMsgFocused(false)}
                        placeholder={msgFocused || form.message ? 'Describe your issue in detail…' : ''}
                        className={`w-full pl-4 pr-4 pt-8 pb-3 rounded-xl border-2 text-sm font-medium text-gray-900
                          bg-white outline-none resize-none transition-all duration-200
                          ${errors.message ? 'border-red-300 bg-red-50/30'
                            : msgFocused ? 'border-primary-400 shadow-[0_0_0_4px_rgba(59,130,246,0.08)]'
                            : form.message ? 'border-gray-300' : 'border-gray-200 hover:border-gray-300'}`}
                      />
                      <label htmlFor="contact-message" className={`absolute left-4 pointer-events-none transition-all duration-200 select-none
                        ${msgFocused || form.message
                          ? `top-2 text-[10px] font-bold tracking-wider uppercase ${errors.message ? 'text-red-500' : 'text-primary-600'}`
                          : 'top-4 text-sm text-gray-400 font-normal'}`}>
                        Your Message
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${msgProgress}%`, background: msgProgress >= 100 ? '#10b981' : '#93c5fd' }} />
                        </div>
                        <span className={`text-xs font-bold ${form.message.length >= 20 ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {form.message.length}/20 min
                        </span>
                      </div>
                      {errors.message && <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full inline-block" />{errors.message}</p>}
                    </div>

                    {/* Submit button */}
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5
                        transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <><FontAwesomeIcon icon={faPaperPlane} /> Send Message</>
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs text-gray-400 font-medium">or reach us directly</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <a href="https://wa.me/919316434177" target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl font-semibold text-sm
                        border-2 border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200">
                      <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                      Chat on WhatsApp Instead
                    </a>
                  </form>
                </div>
              )}
            </div>

            {/* FAQ */}
            <div>
              <p className="section-tag">FAQ</p>
              <h2 className="section-title text-2xl md:text-3xl mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-sm mb-8">Quick answers to our most common questions.</p>
              <div className="space-y-3 bg-white rounded-2xl p-1 shadow-card mb-6">
                {faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
              </div>
              <div className="card p-5 mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Our City Offices</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Ahmadabad', 'Surat', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'].map(city => (
                    <div key={city} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />{city}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 card border-l-4 border-l-primary-500">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faCommentDots} className="text-primary-600 text-sm" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Still have questions?</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">Our team is available 24/7 on WhatsApp and email. Average response time: 5 minutes.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <p className="section-tag">Find Us</p>
              <h2 className="font-display font-bold text-2xl text-gray-900">Our Headquarters</h2>
            </div>
            <a href="https://maps.google.com/?q=325/15+Bhairavnath+Road+Maninagar+Ahmedabad+380028"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex-shrink-0">
              <FontAwesomeIcon icon={faLocationDot} /> Get Directions
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card border border-gray-100" style={{ height: '400px' }}>
            <iframe title="DriveEase HQ"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.5816%2C22.9881%2C72.6216%2C23.0131&layer=mapnik&marker=22.9981%2C72.6016"
              width="100%" height="100%" style={{ border: 0, display: 'block' }} loading="lazy" allowFullScreen />
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            <FontAwesomeIcon icon={faLocationDot} className="text-primary-600 text-lg" /> 325/15, Bhairavnath Road, Maninagar, Ahmedabad — 380028
          </p>
        </div>
      </section>

    </div>
  );
}
