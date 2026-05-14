import { useState } from 'react';
import StatCounter from '../../components/StatCounter';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faPlus, faPencil, faTrash, faEye,
  faXmark, faSave, faCloudArrowUp, faTag
} from '@fortawesome/free-solid-svg-icons';
import { useCars } from '../../context/CarContext';
import { cityList } from '../../assets/assets';
import toast from 'react-hot-toast';

const featureSuggestions = [
  'Apple CarPlay','Android Auto','Sunroof/Moonroof','Panoramic Sunroof',
  'Heated Seats','Ventilated Seats','Leather Seats','Reverse Camera',
  'Blind Spot Monitor','ADAS Pack','Lane Assist','Cruise Control',
  'Wireless Charging','ABS + EBD','Airbags (6)','Push-to-Start',
  '360° Camera','Heads-Up Display','Digital Cluster','Keyless Entry',
  'Premium Audio','Auto Headlights','Power Tailgate','Rain-Sensing Wipers',
];

export default function ManageCars() {
  const { cars, deleteCar, toggleAvailability, updateCar } = useCars();
  const [search, setSearch]               = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editModal, setEditModal]         = useState(null);
  const [editForm, setEditForm]           = useState({});
  const [editPreview, setEditPreview]     = useState(null);
  const [editImageData, setEditImageData] = useState('');
  const [featureInput, setFeatureInput]   = useState('');

  const filtered = cars.filter(c =>
    `${c.brand} ${c.model} ${c.location}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    deleteCar(id);
    setDeleteConfirm(null);
    toast.success('Car removed from fleet');
  };

  const openEdit = (car) => {
    setEditForm({
      brand:           car.brand         || '',
      model:           car.model         || '',
      year:            car.year          || new Date().getFullYear(),
      category:        car.category      || 'Sedan',
      seatingCapacity: car.seatingCapacity || 5,
      fuelType:        car.fuelType      || 'Petrol',
      transmission:    car.transmission  || 'Automatic',
      location:        car.location      || '',
      pricePerDay:     car.pricePerDay   || 0,
      pricePerHour:    car.pricePerHour  || '',
      description:     car.description   || '',
      availability:    car.availability  ?? true,
      features:        car.features      ? [...car.features] : [],
    });
    setEditPreview(null);
    setEditImageData('');
    setFeatureInput('');
    setEditModal(car);
  };

  const setF = (key, val) => setEditForm(f => ({ ...f, [key]: val }));

  const addEditFeature = (feat) => {
    const f = feat.trim();
    if (!f || editForm.features.includes(f) || editForm.features.length >= 12) return;
    setF('features', [...editForm.features, f]);
    setFeatureInput('');
  };
  const removeEditFeature = (f) => setF('features', editForm.features.filter(x => x !== f));

  const handleEditImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setEditPreview(reader.result); setEditImageData(reader.result); };
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    if (!editForm.brand?.trim())  { toast.error('Brand is required'); return; }
    if (!editForm.model?.trim())  { toast.error('Model is required'); return; }
    if (!editForm.pricePerDay)    { toast.error('Price per day is required'); return; }
    updateCar(editModal.id, {
      ...editForm,
      year:            Number(editForm.year),
      pricePerDay:     Number(editForm.pricePerDay),
      pricePerHour:    editForm.pricePerHour ? Number(editForm.pricePerHour) : Math.round(Number(editForm.pricePerDay) / 8),
      seatingCapacity: Number(editForm.seatingCapacity),
      ...(editImageData ? { image: editImageData } : {}),
    });
    setEditModal(null);
    toast.success('Car updated successfully');
  };

  const totalCars    = cars.length;
  const activeCars   = cars.filter(c => c.availability).length;
  const inactiveCars = cars.filter(c => !c.availability).length;
  const premiumCars  = cars.filter(c => c.pricePerDay >= 50000).length;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Manage Fleet</h1>
          <p className="text-gray-400 text-sm mt-0.5">{cars.length} vehicles in your fleet</p>
        </div>
        <Link to="/owner/add-car" className="btn-primary">
          <FontAwesomeIcon icon={faPlus} /> Add New Car
        </Link>
      </div>

      {/* Fleet stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Vehicles', value: totalCars,    color: 'text-gray-900',    accent: 'border-gray-300',    bg: 'bg-gray-50'    },
          { label: 'Active',         value: activeCars,   color: 'text-emerald-700', accent: 'border-emerald-400', bg: 'bg-emerald-50' },
          { label: 'Inactive',       value: inactiveCars, color: 'text-red-600',     accent: 'border-red-300',     bg: 'bg-red-50'     },
          { label: 'Luxury Fleet',   value: premiumCars,  color: 'text-amber-700',   accent: 'border-amber-400',   bg: 'bg-amber-50'   },
        ].map(s => (
          <div key={s.label} className={`card border-t-4 ${s.accent} p-4 sm:p-5`}>
            <p className={`font-display font-black fleet-stat-value ${s.color}`}>
              <StatCounter value={s.value} duration={900} />
            </p>
            <p className="text-gray-500 text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by brand, model, or city…" className="form-input pl-11" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto -mx-0">
          <table className="owner-table min-w-[700px] w-full">
            <thead>
              <tr>
                {['Vehicle', 'Category', 'Location', 'Price / Day', 'Status', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(car => (
                <tr key={car.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={car.image} alt={`${car.brand} ${car.model}`}
                        className="w-14 h-10 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&q=80'; }} />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{car.brand} {car.model}</p>
                        <p className="text-xs text-gray-400">{car.year} · {car.fuelType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <span className="badge bg-primary-100 text-primary-700">{car.category}</span>
                  </td>
                  <td className="text-sm text-gray-600">{car.location}</td>
                  <td className="">
                    <span className="font-bold text-gray-900">₹{car.pricePerDay.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 ml-1">/day</span>
                  </td>
                  <td className="">
                    <button onClick={() => toggleAvailability(car.id)}
                      className="flex items-center gap-2" title={car.availability ? 'Mark unavailable' : 'Mark available'}>
                      <div className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors ${car.availability ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                        <span className={`absolute w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${car.availability ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                      <span className={`text-xs font-semibold ${car.availability ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {car.availability ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className="">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(car)}
                        className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors" title="Edit">
                        <FontAwesomeIcon icon={faPencil} className="text-xs" />
                      </button>
                      <Link to={`/cars/${car.id}`} target="_blank"
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors" title="View">
                        <FontAwesomeIcon icon={faEye} className="text-xs" />
                      </Link>
                      {deleteConfirm === car.id ? (
                        <div className="flex items-center gap-1.5 ml-1">
                          <button onClick={() => handleDelete(car.id)}
                            className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">
                            Delete
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg transition-colors">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(car.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Delete">
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faSearch} className="text-gray-300 text-3xl mb-3 block mx-auto" />
            <p className="text-gray-500 font-semibold">No vehicles match your search</p>
            <button onClick={() => setSearch('')} className="text-primary-600 text-sm font-medium mt-2 hover:underline">Clear search</button>
          </div>
        )}
      </div>

      {/* ═══════════════════ Full Edit Modal ═══════════════════ */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col animate-fade-in my-auto"
               style={{ minHeight: '200px', maxHeight: 'calc(100vh - 2rem)' }}>

            {/* Modal Header — always visible, never scrolls */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 rounded-t-2xl">
              <div>
                <h3 className="font-display font-bold text-xl text-gray-900">
                  Edit {editModal.brand} {editModal.model}
                </h3>
                <p className="text-gray-400 text-sm mt-0.5">Update any detail — all fields are editable</p>
              </div>
              <button onClick={() => setEditModal(null)}
                className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">

              {/* ── Basic Info ── */}
              <div>
                <h4 className="font-display font-bold text-base text-gray-800 mb-4 pb-3 border-b border-gray-100">Basic Information</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Brand *</label>
                    <input type="text" value={editForm.brand} onChange={e => setF('brand', e.target.value)}
                      placeholder="e.g. Toyota" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model *</label>
                    <input type="text" value={editForm.model} onChange={e => setF('model', e.target.value)}
                      placeholder="e.g. Camry" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input type="number" value={editForm.year} min={2000} max={new Date().getFullYear() + 1}
                      onChange={e => setF('year', e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select value={editForm.category} onChange={e => setF('category', e.target.value)} className="form-input">
                      {['Sedan','SUV','MPV','Sports','Luxury','Electric','Van','Convertible','Pickup'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Specifications ── */}
              <div>
                <h4 className="font-display font-bold text-base text-gray-800 mb-4 pb-3 border-b border-gray-100">Specifications</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Seating Capacity</label>
                    <select value={editForm.seatingCapacity} onChange={e => setF('seatingCapacity', Number(e.target.value))} className="form-input">
                      {[2,4,5,6,7,8].map(n => <option key={n} value={n}>{n} seats</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fuel Type</label>
                    <select value={editForm.fuelType} onChange={e => setF('fuelType', e.target.value)} className="form-input">
                      {['Petrol','Diesel','CNG','Electric','Hybrid'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Transmission</label>
                    <select value={editForm.transmission} onChange={e => setF('transmission', e.target.value)} className="form-input">
                      {['Automatic','Manual','Semi-Auto'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Pricing & Location ── */}
              <div>
                <h4 className="font-display font-bold text-base text-gray-800 mb-4 pb-3 border-b border-gray-100">Pricing & Location</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Price Per Day (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                      <input type="number" value={editForm.pricePerDay} min={500}
                        onChange={e => setF('pricePerDay', e.target.value)} className="form-input pl-9" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price Per Hour (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                      <input type="number" value={editForm.pricePerHour} min={100}
                        placeholder={editForm.pricePerDay ? `~₹${Math.round(editForm.pricePerDay/8)}` : 'Auto'}
                        onChange={e => setF('pricePerHour', e.target.value)} className="form-input pl-9" />
                    </div>
                    <p className="form-hint">Leave empty to auto-calculate (daily ÷ 8)</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location *</label>
                    <select value={editForm.location} onChange={e => setF('location', e.target.value)} className="form-input">
                      <option value="">Select a city</option>
                      {cityList.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Key Features ── */}
              <div>
                <h4 className="font-display font-bold text-base text-gray-800 mb-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faTag} className="text-primary-400" /> Key Features
                </h4>
                <p className="text-gray-400 text-xs mb-3">Up to 12 features. Press Enter to add.</p>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEditFeature(featureInput); } }}
                    placeholder="e.g. Sunroof, ADAS, Heated Seats…" className="form-input flex-1" maxLength={40} />
                  <button type="button" onClick={() => addEditFeature(featureInput)}
                    disabled={!featureInput.trim() || editForm.features.length >= 12}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    Add
                  </button>
                </div>
                {editForm.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-gray-100 mb-3">
                    {editForm.features.map(f => (
                      <span key={f} className="flex items-center gap-1.5 bg-white border border-primary-200 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        {f}
                        <button type="button" onClick={() => removeEditFeature(f)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-0.5">
                          <FontAwesomeIcon icon={faXmark} className="text-[9px]" />
                        </button>
                      </span>
                    ))}
                    <span className="text-xs text-gray-400 self-center">{editForm.features.length}/12</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {featureSuggestions.filter(s => !editForm.features.includes(s)).slice(0, 12).map(s => (
                    <button key={s} type="button" onClick={() => addEditFeature(s)}
                      disabled={editForm.features.length >= 12}
                      className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 border border-gray-200 hover:border-primary-300 px-2.5 py-1 rounded-full transition-all disabled:opacity-40">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Description ── */}
              <div>
                <h4 className="font-display font-bold text-base text-gray-800 mb-4 pb-3 border-b border-gray-100">Description</h4>
                <textarea rows={3} value={editForm.description}
                  onChange={e => setF('description', e.target.value)}
                  placeholder="Describe the vehicle and its highlights…"
                  className="form-input resize-none" />
              </div>

              {/* ── Image & Availability (side by side) ── */}
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Image replace */}
                <div>
                  <h4 className="font-display font-bold text-base text-gray-800 mb-3">Vehicle Image</h4>
                  <label className="block cursor-pointer">
                    <div className={`border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                      editPreview ? 'border-primary-300' : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50/30'
                    }`}>
                      {editPreview ? (
                        <div className="relative">
                          <img src={editPreview} alt="New preview" className="w-full h-36 object-cover" />
                          <button type="button" onClick={e => { e.preventDefault(); setEditPreview(null); setEditImageData(''); }}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md">
                            <FontAwesomeIcon icon={faXmark} className="text-xs" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-36 flex flex-col items-center justify-center gap-2">
                          <img src={editModal.image} alt="" className="h-24 w-full object-cover opacity-40" 
                            onError={e => { e.target.style.display = 'none'; }} />
                          <div className="absolute flex flex-col items-center gap-1">
                            <FontAwesomeIcon icon={faCloudArrowUp} className="text-2xl text-gray-400" />
                            <p className="text-xs text-gray-500 font-semibold">Replace image</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleEditImage} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-400 mt-2 text-center">Leave unchanged to keep current photo</p>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-display font-bold text-base text-gray-800 mb-3">Availability</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-100 h-36">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Available for Booking</p>
                      <p className="text-xs text-gray-400 mt-0.5">Toggle to show/hide from customers</p>
                      <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        editForm.availability ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${editForm.availability ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {editForm.availability ? 'Listed & Active' : 'Hidden from customers'}
                      </div>
                    </div>
                    <button type="button" onClick={() => setF('availability', !editForm.availability)}
                      className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors flex-shrink-0 ${
                        editForm.availability ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}>
                      <span className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        editForm.availability ? 'translate-x-8' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer — always visible, never scrolls */}
            <div className="flex gap-3 px-6 pb-6 pt-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={saveEdit} className="btn-primary flex-1 py-3">
                <FontAwesomeIcon icon={faSave} /> Save All Changes
              </button>
              <button onClick={() => setEditModal(null)} className="btn-secondary flex-1 py-3">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
