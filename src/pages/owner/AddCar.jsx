import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudArrowUp, faCircleCheck, faXmark, faPlus, faTag
} from '@fortawesome/free-solid-svg-icons';
import { useCars } from '../../context/CarContext';
import { cityList } from '../../assets/assets';
import toast from 'react-hot-toast';

// Preset feature suggestions
const featureSuggestions = [
  'Apple CarPlay', 'Android Auto', 'Sunroof/Moonroof', 'Panoramic Sunroof',
  'Heated Seats', 'Ventilated Seats', 'Leather Seats', 'Reverse Camera',
  'Blind Spot Monitor', 'ADAS Pack', 'Lane Assist', 'Cruise Control',
  'Wireless Charging', 'ABS + EBD', 'Airbags (6)', 'Push-to-Start',
  'Auto Headlights', 'Rain-Sensing Wipers', 'Power Tailgate', 'Keyless Entry',
  'Premium Audio', 'Heads-Up Display', 'Digital Cluster', '360° Camera',
];

export default function AddCar() {
  const { addCar } = useCars();
  const navigate = useNavigate();
  const [preview, setPreview]     = useState(null);
  const [imageData, setImageData] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [features, setFeatures]   = useState([]);
  const [featureInput, setFeatureInput] = useState('');

  const {
    register, handleSubmit, watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      category: 'Sedan',
      seatingCapacity: 5,
      fuelType: 'Petrol',
      transmission: 'Automatic',
    },
  });

  const [brand, model, price, fuel, hourlyPrice] = watch(['brand', 'model', 'pricePerDay', 'fuelType', 'pricePerHour']);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setImageData(reader.result); };
    reader.readAsDataURL(file);
  };

  const addFeature = (feat) => {
    const f = feat.trim();
    if (!f || features.includes(f) || features.length >= 12) return;
    setFeatures(prev => [...prev, f]);
    setFeatureInput('');
  };

  const removeFeature = (f) => setFeatures(prev => prev.filter(x => x !== f));

  const handleFeatureKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addFeature(featureInput); }
  };

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 600));
    addCar({
      ...data,
      year: Number(data.year),
      pricePerDay: Number(data.pricePerDay),
      pricePerHour: data.pricePerHour ? Number(data.pricePerHour) : Math.round(Number(data.pricePerDay) / 8),
      seatingCapacity: Number(data.seatingCapacity),
      features,
      image: imageData || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80',
    });
    setSubmitted(true);
    setTimeout(() => navigate('/owner/manage-cars'), 1800);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600 text-3xl" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-1">Car Added!</h2>
          <p className="text-gray-400">Redirecting to fleet management…</p>
        </div>
      </div>
    );
  }

  const fi = (name) => (errors[name] ? 'form-input form-input-error' : 'form-input');

  return (
    <div className="animate-fade-in max-w-10xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-gray-900">Add New Car</h1>
        <p className="text-gray-400 text-sm mt-1">Fill in the vehicle details to add it to your fleet.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid xl:grid-cols-3 gap-5 xl:gap-6">
          {/* ── Form columns ── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Basic info */}
            <div className="card p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-5 pb-4 border-b border-gray-100">Basic Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Brand *</label>
                  <input type="text" placeholder="e.g. Toyota" className={fi('brand')}
                    {...register('brand', { required: 'Brand is required', minLength: { value: 2, message: 'Too short' } })} />
                  {errors.brand && <p className="form-error">{errors.brand.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Model *</label>
                  <input type="text" placeholder="e.g. Camry" className={fi('model')}
                    {...register('model', { required: 'Model is required', minLength: { value: 1, message: 'Too short' } })} />
                  {errors.model && <p className="form-error">{errors.model.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Year *</label>
                  <input type="number" className={fi('year')}
                    {...register('year', {
                      required: 'Year is required',
                      min: { value: 2000, message: 'Min year 2000' },
                      max: { value: new Date().getFullYear() + 1, message: 'Future year not allowed' },
                    })} />
                  {errors.year && <p className="form-error">{errors.year.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" {...register('category', { required: true })}>
                    {['Sedan', 'SUV', 'MPV', 'Sports', 'Luxury', 'Electric', 'Van', 'Convertible', 'Pickup'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="card p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-5 pb-4 border-b border-gray-100">Specifications</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Seating Capacity</label>
                  <select className="form-input" {...register('seatingCapacity')}>
                    {[2,4,5,6,7,8].map(n => <option key={n} value={n}>{n} seats</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <select className="form-input" {...register('fuelType')}>
                    {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Transmission</label>
                  <select className="form-input" {...register('transmission')}>
                    {['Automatic', 'Manual', 'Semi-Auto'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Location */}
            <div className="card p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-5 pb-4 border-b border-gray-100">Pricing & Location</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">Price Per Day (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input type="number" placeholder="0" min="500" className={`${fi('pricePerDay')} pl-9`}
                      {...register('pricePerDay', {
                        required: 'Price is required',
                        min: { value: 500, message: 'Minimum ₹500/day' },
                      })} />
                  </div>
                  {errors.pricePerDay && <p className="form-error">{errors.pricePerDay.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Price Per Hour (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input type="number" placeholder="Auto-calc if empty" min="100" className={`${fi('pricePerHour')} pl-9`}
                      {...register('pricePerHour', {
                        min: { value: 100, message: 'Minimum ₹100/hr' },
                      })} />
                  </div>
                  <p className="form-hint">Leave empty to auto-calculate (daily ÷ 8)</p>
                  {errors.pricePerHour && <p className="form-error">{errors.pricePerHour.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <select className={fi('location')} {...register('location', { required: 'Location is required' })}>
                    <option value="">Select a city</option>
                    {cityList.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.location && <p className="form-error">{errors.location.message}</p>}
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="card p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faTag} className="text-primary-400 text-base" />
                Key Features
              </h2>
              <p className="text-gray-400 text-xs mb-5">Add up to 12 features. Type and press Enter, or click a suggestion below.</p>

              {/* Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={featureInput}
                  onChange={e => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  placeholder="e.g. Sunroof, ADAS, Heated Seats…"
                  className="form-input flex-1"
                  maxLength={40}
                />
                <button
                  type="button"
                  onClick={() => addFeature(featureInput)}
                  disabled={!featureInput.trim() || features.length >= 12}
                  className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add
                </button>
              </div>

              {/* Added features chips */}
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-gray-100">
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-1.5 bg-white border border-primary-200 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-[10px]" />
                      {f}
                      <button type="button" onClick={() => removeFeature(f)}
                        className="ml-1 text-gray-400 hover:text-red-500 transition-colors">
                        <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                      </button>
                    </div>
                  ))}
                  <span className="text-xs text-gray-400 self-center ml-1">{features.length}/12</span>
                </div>
              )}

              {/* Suggestions */}
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Quick Add Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {featureSuggestions.filter(s => !features.includes(s)).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addFeature(s)}
                      disabled={features.length >= 12}
                      className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 border border-gray-200 hover:border-primary-300 px-3 py-1.5 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-5 pb-4 border-b border-gray-100">Description</h2>
              <textarea rows={4} placeholder="Describe the vehicle, its highlights, and what makes it special for renters..."
                className={`${fi('description')} resize-none`}
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 30, message: 'At least 30 characters' },
                })} />
              {errors.description && <p className="form-error">{errors.description.message}</p>}
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">
            {/* Image upload */}
            <div className="card p-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-5 pb-4 border-b border-gray-100">Vehicle Image</h2>
              <label className="block cursor-pointer">
                <div className={`border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                  preview ? 'border-primary-300' : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50/30'
                }`}>
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="w-full h-44 object-cover" />
                      <button type="button" onClick={e => { e.preventDefault(); setPreview(null); setImageData(''); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md">
                        <FontAwesomeIcon icon={faXmark} className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-44 flex flex-col items-center justify-center text-gray-400 gap-2">
                      <FontAwesomeIcon icon={faCloudArrowUp} className="text-3xl text-gray-300" />
                      <p className="text-sm font-semibold text-gray-500">Upload car image</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>

            {/* Quick Preview */}
            <div className="card p-5 shadow-sm">
              <h3 className="font-display font-semibold text-gray-900 mb-4 text-sm">Quick Preview</h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
                <p className="font-display font-bold text-gray-900">{brand || 'Brand'} {model || 'Model'}</p>
                <p className="text-gray-400 text-xs mt-0.5">{fuel || 'Fuel Type'}</p>
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Per day</span>
                    <span className="font-display font-extrabold text-primary-600">
                      {price ? `₹${Number(price).toLocaleString()}` : '₹0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Per hour</span>
                    <span className="font-bold text-amber-600 text-sm">
                      {hourlyPrice
                        ? `₹${Number(hourlyPrice).toLocaleString()}`
                        : price
                          ? `₹${Math.round(Number(price)/8).toLocaleString()} (auto)`
                          : '₹0'}
                    </span>
                  </div>
                </div>
                {features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-2">Features ({features.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {features.slice(0,4).map(f => (
                        <span key={f} className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">{f}</span>
                      ))}
                      {features.length > 4 && <span className="text-[10px] text-gray-400">+{features.length-4} more</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-base font-bold">
              {isSubmitting ? 'Adding to Fleet…' : 'Add Car to Fleet'}
            </button>
            <button type="button" onClick={() => navigate('/owner/manage-cars')} className="btn-secondary w-full py-3">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
