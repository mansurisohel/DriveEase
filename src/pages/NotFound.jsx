import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCar, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg animate-fade-in">
        {/* Visual */}
        <div className="relative inline-block mb-10">
          <div className="text-[9rem] font-display font-black text-gray-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center shadow-lg rotate-3">
              <FontAwesomeIcon icon={faCar} className="text-primary-600 text-3xl -rotate-3" />
            </div>
          </div>
        </div>

        <h1 className="font-display font-black text-3xl text-gray-900 mb-3">
          Wrong Turn Taken!
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed max-w-sm mx-auto">
          Looks like you've driven off the map. The page you're looking for doesn't exist
          or has been moved to a new location.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary px-8 py-3.5">
            <FontAwesomeIcon icon={faHome} />
            Back to Home
          </Link>
          <Link to="/cars" className="btn-secondary px-8 py-3.5">
            <FontAwesomeIcon icon={faSearch} />
            Browse Cars
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm mb-4">Try one of these pages instead:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { to: '/cars',       label: 'Cars' },
              { to: '/about',      label: 'About' },
              { to: '/contact',    label: 'Contact' },
              { to: '/my-bookings',label: 'My Bookings' },
            ].map(link => (
              <Link key={link.to} to={link.to}
                className="px-4 py-1.5 bg-white border border-gray-200 hover:border-primary-300
                  hover:text-primary-600 text-gray-600 rounded-lg text-sm font-medium
                  transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
