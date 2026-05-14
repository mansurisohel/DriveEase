import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CarProvider } from './context/CarContext';
import { BookingProvider } from './context/BookingContext';
import { ContactProvider } from './context/ContactContext';
import { useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';

import UserLayout from './layouts/UserLayout';
import OwnerLayout from './layouts/OwnerLayout';

import Home         from './pages/user/Home';
import Cars         from './pages/user/Cars';
import CarDetails   from './pages/user/CarDetails';
import MyBookings   from './pages/user/MyBookings';
import Login        from './pages/user/Login';
import Register     from './pages/user/Register';
import About        from './pages/user/About';
import Contact      from './pages/user/Contact';
import Payment      from './pages/user/Payment';
import ManageAccount from './pages/user/ManageAccount';

import OwnerLogin    from './pages/owner/OwnerLogin';
import OwnerRegister from './pages/owner/OwnerRegister';
import Dashboard     from './pages/owner/Dashboard';
import AddCar        from './pages/owner/AddCar';
import ManageCars    from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import ManageAdmins  from './pages/owner/ManageAdmins';
import Analytics      from './pages/owner/Analytics';

import NotFound from './pages/NotFound';

const PrivacyPolicy   = lazy(() => import('./pages/user/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/user/TermsConditions'));
const RefundPolicy    = lazy(() => import('./pages/user/RefundPolicy'));
const SitemapPage     = lazy(() => import('./pages/user/Sitemap'));

function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function RequireOwner({ children }) {
  const { isLoggedIn, isOwner } = useAuth();
  const location = useLocation();
  // Not logged in at all — send to owner login
  if (!isLoggedIn) return <Navigate to="/owner-login" state={{ from: location.pathname }} replace />;
  // Logged in as a regular user, not owner — send to owner login with a hint
  if (!isOwner) return <Navigate to="/owner-login" state={{ from: location.pathname, hint: 'owner-only' }} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Toaster OUTSIDE providers so it's always mounted at root */}
      <Toaster
        position="top-right"
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            borderRadius: '14px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
            maxWidth: '400px',
          },
          success: {
            style: { background: '#fff', border: '1px solid #d1fae5', color: '#065f46' },
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            style: { background: '#fff', border: '1px solid #fee2e2', color: '#991b1b' },
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <AuthProvider>
        <CarProvider>
          <BookingProvider>
            <ContactProvider>
            <Routes>
              <Route element={<UserLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cars" element={<Cars />} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/my-bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
                <Route path="/manage-account" element={<RequireAuth><ManageAccount /></RequireAuth>} />
                <Route path="/privacy-policy" element={<Suspense fallback={null}><PrivacyPolicy /></Suspense>} />
                <Route path="/terms"          element={<Suspense fallback={null}><TermsConditions /></Suspense>} />
                <Route path="/refund-policy"  element={<Suspense fallback={null}><RefundPolicy /></Suspense>} />
                <Route path="/sitemap"        element={<Suspense fallback={null}><SitemapPage /></Suspense>} />
              </Route>
              <Route path="/login"          element={<Login />} />
              <Route path="/register"       element={<Register />} />
              <Route path="/owner-login"    element={<OwnerLogin />} />
              <Route path="/owner-register" element={<OwnerRegister />} />
              <Route path="/owner" element={<RequireOwner><OwnerLayout /></RequireOwner>}>
                <Route index              element={<Dashboard />} />
                <Route path="add-car"     element={<AddCar />} />
                <Route path="manage-cars" element={<ManageCars />} />
                <Route path="manage-bookings" element={<ManageBookings />} />
                <Route path="manage-admins"   element={<ManageAdmins />} />
                <Route path="analytics"       element={<Analytics />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ContactProvider>
          </BookingProvider>
        </CarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
