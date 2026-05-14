import { Link } from 'react-router-dom';
import { useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faGasPump, faGear, faUserGroup,
  faLocationDot, faArrowRight, faCircle, faCrown
} from '@fortawesome/free-solid-svg-icons';

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <FontAwesomeIcon key={s} icon={faStar}
          className={`text-xs ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
    <span className="text-xs text-gray-500 font-medium">
      {rating} <span className="text-gray-300 font-normal">({count})</span>
    </span>
  </div>
);

const Spec = ({ icon, label, border }) => (
  <div className={`flex flex-col items-center gap-1 text-center ${border ? 'border-x border-gray-100 px-1' : ''}`}>
    <FontAwesomeIcon icon={icon} className="text-primary-400 text-sm" />
    <span className="text-xs text-gray-600 font-medium leading-tight">{label}</span>
  </div>
);

export default function CarCard({ car }) {
  const isPremium = car.isPremium || car.pricePerDay >= 50000;
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * -6;
    const rotateY = ((x - midX) / midX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }, []);

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`card group overflow-hidden flex flex-col cursor-pointer
        ${isPremium ? 'ring-1 ring-amber-200/60' : ''}`}
      style={{ transition: 'transform 0.15s ease-out, box-shadow 0.3s ease', willChange: 'transform' }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden h-48 flex-shrink-0 bg-gray-100">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80'; }}
        />

        {/* Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isPremium ? 'from-amber-900/30 via-black/20' : 'from-black/40 via-transparent'} to-transparent`} />

        {/* Category badge — top left */}
        <span className={`absolute top-3 left-3 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm ${
          isPremium
            ? 'text-white'
            : 'bg-primary-600/95'
        }`} style={isPremium ? { background: 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(234,88,12,0.95))' } : {}}>
          {isPremium && <FontAwesomeIcon icon={faCrown} className="mr-1 text-[10px]" />}
          {car.category}
        </span>

        {/* "New" badge for owner-added cars */}
        {car.isOwnerAdded && (
          <span className="absolute top-10 left-3 mt-1 bg-amber-400 text-amber-900
            text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wide">
            NEW
          </span>
        )}

        {/* Availability — top right */}
        <span className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-bold
          px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-sm
          ${car.availability ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          <FontAwesomeIcon icon={faCircle} className="text-[5px]" />
          {car.availability ? 'Available' : 'Unavailable'}
        </span>

        {/* Year pill — bottom left */}
        <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white/90
          text-xs font-medium px-2 py-0.5 rounded-md">
          {car.year}
        </span>

        {/* Premium indicator bottom right */}
        {isPremium && (
          <span className="absolute bottom-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-md"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: 'white' }}>
            LUXURY
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="min-w-0">
            <h3 className="font-display font-bold text-gray-900 text-lg leading-tight truncate">
              {car.brand} {car.model}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <FontAwesomeIcon icon={faLocationDot} className="text-gray-300 text-xs" />
              <span className="text-xs text-gray-400 truncate">{car.location}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-xl font-display font-extrabold leading-none ${isPremium ? 'text-amber-600' : 'text-primary-600'}`}>
              {`₹${car.pricePerDay.toLocaleString('en-IN')}`}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">/ day</p>
            {isPremium && car.pricePerHour && (
              <p className="text-[10px] text-amber-500 font-semibold mt-0.5">₹{car.pricePerHour.toLocaleString()} / hr</p>
            )}
          </div>
        </div>

        {/* Rating */}
        <StarRating rating={car.rating} count={car.reviewCount} />

        {/* Divider */}
        <div className="my-4 border-t border-dashed border-gray-100" />

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Spec icon={faGasPump}    label={car.fuelType} />
          <Spec icon={faGear}       label={car.transmission} border />
          <Spec icon={faUserGroup}  label={`${car.seatingCapacity} Seats`} />
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link to={`/cars/${car.id}`}
            className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
              font-semibold text-sm transition-all duration-200 group/btn border hover:shadow-md ${
              isPremium
                ? 'bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white border-amber-200 hover:border-amber-500'
                : 'bg-primary-50 hover:bg-primary-600 text-primary-600 hover:text-white border-primary-100 hover:border-primary-600'
            }`}>
            View Details
            <FontAwesomeIcon icon={faArrowRight}
              className="text-xs group-hover/btn:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}
