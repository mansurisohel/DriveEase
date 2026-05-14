import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollTop}
      aria-label="Back to top"
      className={`fixed bottom-7 right-7 z-50 w-12 h-12 rounded-2xl flex items-center justify-center
        text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      style={{ background: 'linear-gradient(135deg, #1d4ed8, #4f46e5)' }}
    >
      <FontAwesomeIcon icon={faChevronUp} className="text-sm" />
    </button>
  );
}
