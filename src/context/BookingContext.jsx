import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { dummyOwnerBookingsData } from '../assets/assets';
import toast from 'react-hot-toast';

const BookingContext = createContext();

const STORAGE_KEY = 'driveease_bookings_v5';
const SEEDED_KEY  = 'driveease_bookings_seeded_v2';

/* ── Booking ID like DE-YYYYMMDD-XXXXX ── */
function generateBookingId() {
  const now  = new Date();
  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `DE-${date}-${suffix}`;
}

function loadStore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Object.keys(parsed).length > 0) return parsed;
    }
  } catch (_) { /* corrupt data — fall through to seed */ }

  /* ── First launch: seed with realistic dummy bookings ── */
  if (!localStorage.getItem(SEEDED_KEY)) {
    try {
      localStorage.setItem(SEEDED_KEY, '1');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyOwnerBookingsData));
    } catch (_) { /* storage quota */ }
    return dummyOwnerBookingsData;
  }

  return {};
}

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();
  const [bookingsByUser, setBookingsByUser] = useState(loadStore);
  const userId = user?.id ?? null;

  /* ── Persist on every change ── */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingsByUser)); } catch (_) {}
  }, [bookingsByUser]);

  /* ── Bookings for the current user ── */
  const bookings = useMemo(
    () => (userId ? (bookingsByUser[userId] ?? []) : []),
    [bookingsByUser, userId],
  );

  /* ── All bookings for the owner view ── */
  const allBookings = useMemo(
    () =>
      Object.values(bookingsByUser)
        .flat()
        .sort((a, b) => new Date(b.bookedAt ?? 0) - new Date(a.bookedAt ?? 0)),
    [bookingsByUser],
  );

  /* ── Helpers ── */
  const mutate = (fn) => {
    if (!userId) return;
    setBookingsByUser(prev => ({ ...prev, [userId]: fn(prev[userId] ?? []) }));
  };

  /** Walk every user's list to find and mutate a booking by id. */
  const mutateAny = (id, fn) => {
    setBookingsByUser(prev => {
      const next = { ...prev };
      for (const uid of Object.keys(next)) {
        if (next[uid].some(b => b.id === id)) {
          next[uid] = next[uid].map(b => (b.id === id ? fn(b) : b));
          break;
        }
      }
      return next;
    });
  };

  /* ══════════════════════════════════════════════════════
     USER ACTIONS
     ══════════════════════════════════════════════════════ */

  const addBooking = (booking) => {
    const b = {
      ...booking,
      id:            generateBookingId(),
      status:        'pending',
      bookedAt:      new Date().toISOString(),
      customerName:  booking.customerName  || booking.customerInfo?.fullName  || 'Customer',
      customerEmail: booking.customerEmail || booking.customerInfo?.email     || '',
      customerPhone: booking.customerPhone || booking.customerInfo?.phone     || '',
    };
    mutate(list => [b, ...list]);
    toast.success('Booking placed! The owner will confirm shortly.');
    return b;
  };

  const confirmPickup = (id) => {
    mutate(list =>
      list.map(b =>
        b.id === id ? { ...b, status: 'active', pickedUpAt: new Date().toISOString() } : b,
      ),
    );
    toast.success('Pickup confirmed — enjoy your ride!');
  };

  const requestReturn = (id, { condition = '', notes = '' } = {}) => {
    mutate(list =>
      list.map(b =>
        b.id === id
          ? { ...b, returnRequested: true, returnRequestedAt: new Date().toISOString(), returnCondition: condition, returnNotes: notes }
          : b,
      ),
    );
    toast.success('Return request submitted. Awaiting owner confirmation.');
  };

  const cancelBooking = (id, reason = '') => {
    mutate(list =>
      list.map(b =>
        b.id === id
          ? { ...b, status: 'cancelled', cancelReason: reason, cancelledBy: 'user', cancelledAt: new Date().toISOString() }
          : b,
      ),
    );
    toast.success('Booking cancelled.');
  };

  const removeBooking = (id) => {
    mutate(list => list.filter(b => b.id !== id));
    toast.success('Booking removed from history.');
  };

  const clearUserHistory = () => {
    mutate(list => list.filter(b => b.status !== 'completed' && b.status !== 'cancelled'));
    toast.success('Past bookings cleared from your history.');
  };

  /* ══════════════════════════════════════════════════════
     OWNER ACTIONS
     ══════════════════════════════════════════════════════ */

  const approveBooking = (id) => {
    mutateAny(id, b => ({ ...b, status: 'confirmed', approvedAt: new Date().toISOString() }));
    toast.success('Booking approved!');
  };

  const rejectBooking = (id, reason = '') => {
    mutateAny(id, b => ({
      ...b,
      status: 'cancelled',
      cancelReason: reason || 'Rejected by owner.',
      cancelledBy: 'owner',
      cancelledAt: new Date().toISOString(),
    }));
    toast.error('Booking rejected.');
  };

  const markHandedOver = (id) => {
    mutateAny(id, b => ({ ...b, status: 'active', handedOverAt: new Date().toISOString() }));
    toast.success('Car marked as handed over. Booking is now active.');
  };

  const completeReturn = (id, { notes = '' } = {}) => {
    mutateAny(id, b => ({
      ...b,
      status: 'completed',
      completedAt: new Date().toISOString(),
      returnCompletedNotes: notes,
      returnRequested: false,
    }));
    toast.success('Return confirmed — booking completed!');
  };

  const ownerCancelBooking = (id, reason = '') => {
    mutateAny(id, b => ({
      ...b,
      status: 'cancelled',
      cancelReason: reason,
      cancelledBy: 'owner',
      cancelledAt: new Date().toISOString(),
    }));
    toast.success('Booking cancelled and customer notified.');
  };

  const updateStatus = (id, status) => {
    mutateAny(id, b => ({ ...b, status }));
    toast.success(`Status updated to "${status}".`);
  };

  const clearOwnerHistory = () => {
    setBookingsByUser(prev => {
      const next = {};
      for (const uid of Object.keys(prev)) {
        next[uid] = prev[uid].filter(
          b => b.status !== 'completed' && b.status !== 'cancelled',
        );
      }
      return next;
    });
    toast.success('All past bookings cleared from the system.');
  };

  const ownerRemoveBooking = (id) => {
    setBookingsByUser(prev => {
      const next = { ...prev };
      for (const uid of Object.keys(next)) {
        if (next[uid].some(b => b.id === id)) {
          next[uid] = next[uid].filter(b => b.id !== id);
          break;
        }
      }
      return next;
    });
    toast.success('Booking removed.');
  };

  /* ── Bulk status update for owner ── */
  const bulkUpdateStatus = (ids, status) => {
    setBookingsByUser(prev => {
      const next = { ...prev };
      for (const uid of Object.keys(next)) {
        next[uid] = next[uid].map(b =>
          ids.includes(b.id) ? { ...b, status, updatedAt: new Date().toISOString() } : b,
        );
      }
      return next;
    });
    toast.success(`${ids.length} booking${ids.length > 1 ? 's' : ''} updated to "${status}".`);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        allBookings,
        /* user */
        addBooking, confirmPickup, requestReturn, cancelBooking, removeBooking, clearUserHistory,
        /* owner */
        approveBooking, rejectBooking, markHandedOver, completeReturn,
        ownerCancelBooking, updateStatus, clearOwnerHistory, ownerRemoveBooking, bulkUpdateStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
};
