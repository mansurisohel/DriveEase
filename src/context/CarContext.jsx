import { createContext, useContext, useState, useEffect } from 'react';
import { dummyCarData } from '../assets/assets';

const CarContext = createContext();
const STORAGE_KEY = 'driveease_cars_v3';

/**
 * Build a map from dummyCarData so we can always restore
 * imported-image references (which can't survive JSON.stringify).
 */
const BASE_IMAGE_MAP = new Map(dummyCarData.map(c => [c.id, c.image]));

/**
 * When SAVING — strip `image` from preset cars so we never persist
 * a Vite-hashed URL that could go stale between dev restarts or builds.
 * Owner-added cars store base64, which is fine to persist.
 */
const serializeCars = (cars) =>
  cars.map(car => {
    if (BASE_IMAGE_MAP.has(car.id)) {
      // Preset car — omit image; we'll restore it on load
      const { image, ...rest } = car; // eslint-disable-line no-unused-vars
      return rest;
    }
    return car; // Owner-added — keep base64 image intact
  });

/**
 * When LOADING — always inject the fresh imported image for preset cars.
 * Owner-added cars keep their own stored image.
 */
const loadCars = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // Re-attach imported images + ensure no missing preset cars
      const savedIds = new Set(parsed.map(c => c.id));

      const restored = parsed.map(car => {
        const img = BASE_IMAGE_MAP.get(car.id);
        return img ? { ...car, image: img } : car;
      });

      const missing = dummyCarData.filter(c => !savedIds.has(c.id));
      return [...restored, ...missing];
    }
  } catch (_) { }

  // Fresh start — use dummyCarData as-is (images already imported)
  return dummyCarData;
};

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState(loadCars);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    minPrice: 0,
    maxPrice: 100000,
    sortBy: 'default',
    search: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeCars(cars)));
    } catch (_) { }
  }, [cars]);

  const addCar = (car) =>
    setCars(prev => [{
      ...car,
      id: Date.now().toString(),
      rating: 4.5,
      reviewCount: 0,
      availability: true,
      isOwnerAdded: true,
    }, ...prev]);

  const deleteCar = (id) =>
    setCars(prev => prev.filter(c => c.id !== id));

  const toggleAvailability = (id) =>
    setCars(prev => prev.map(c =>
      c.id === id ? { ...c, availability: !c.availability } : c
    ));

  const updateCar = (id, data) =>
    setCars(prev => prev.map(c =>
      c.id === id ? { ...c, ...data } : c
    ));

  const getFilteredCars = () => {
    let result = [...cars];

    // Full-text search across brand, model, category, location, fuel
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        `${c.brand} ${c.model} ${c.category} ${c.location} ${c.fuelType} ${c.transmission}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (filters.location)
      result = result.filter(c =>
        c.location?.toLowerCase().includes(filters.location.toLowerCase())
      );

    if (filters.category)
      result = result.filter(c =>
        c.category?.toLowerCase() === filters.category.toLowerCase()
      );

    result = result.filter(c =>
      c.pricePerDay >= filters.minPrice && c.pricePerDay <= filters.maxPrice
    );

    if (filters.sortBy === 'price-asc') result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (filters.sortBy === 'price-desc') result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (filters.sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    // Only float unavailable cars to the bottom when the user hasn't chosen a specific sort
    if (filters.sortBy === 'default') {
      result.sort((a, b) => {
        if (a.availability === b.availability) return 0;
        return a.availability ? -1 : 1;
      });
    }

    return result;
  };

  const getCarById = (id) => cars.find(c => c.id === id);

  const categories = [...new Set(cars.map(c => c.category))].sort();

  return (
    <CarContext.Provider value={{
      cars, filters, setFilters,
      addCar, deleteCar, toggleAvailability, updateCar,
      getFilteredCars, getCarById, categories,
    }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCars = () => {
  const ctx = useContext(CarContext);
  if (!ctx) throw new Error('useCars must be used within CarProvider');
  return ctx;
};
