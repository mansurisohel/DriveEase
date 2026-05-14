# 🚗 DriveEase - Premium Car Rental Website

A modern, full-featured car rental web application built with React.js (Vite) and React Router v6.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) to view in browser.

---

## 🔐 Demo Login Credentials

### User Account
- **Email:** alex@driveease.com
- **Password:** password (any)
- **Role:** User

### Owner Account
- **Email:** owner@driveease.com
- **Password:** password (any)
- **Role:** Owner → redirects to /owner dashboard

To switch roles, select the toggle on the Login page.

---

## 📂 Project Structure

```
src/
├── assets/
│   └── assets.js          # All data, images, icons, and mock data
├── components/
│   ├── Navbar.jsx          # Responsive navbar with auth state
│   ├── Footer.jsx          # Site footer with links
│   ├── CarCard.jsx         # Reusable car card component
│   └── Skeleton.jsx        # Loading skeleton components
├── context/
│   ├── AuthContext.jsx     # Authentication (fake login system)
│   ├── CarContext.jsx      # Car state + filters + CRUD
│   └── BookingContext.jsx  # Booking state management
├── layouts/
│   ├── UserLayout.jsx      # Layout with Navbar + Footer
│   └── OwnerLayout.jsx     # Owner dashboard layout with sidebar
├── pages/
│   ├── user/
│   │   ├── Home.jsx        # Landing page with hero, search, features
│   │   ├── Cars.jsx        # Car listing with filters + sort
│   │   ├── CarDetails.jsx  # Individual car page + booking form
│   │   ├── MyBookings.jsx  # User booking management
│   │   └── Login.jsx       # Auth page (user + owner login)
│   ├── owner/
│   │   ├── Dashboard.jsx   # Stats dashboard
│   │   ├── AddCar.jsx      # Add new vehicle form
│   │   ├── ManageCars.jsx  # CRUD for cars + availability toggle
│   │   └── ManageBookings.jsx # Approve/reject/manage bookings
│   └── NotFound.jsx        # 404 page
├── App.jsx                 # Route configuration
└── main.jsx                # Entry point
```

---

## 🌐 Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Home | Public |
| `/cars` | Car Listing | Public |
| `/cars/:id` | Car Details | Public |
| `/my-bookings` | My Bookings | User (login required) |
| `/login` | Login | Public |
| `/owner` | Dashboard | Owner only |
| `/owner/add-car` | Add Car | Owner only |
| `/owner/manage-cars` | Manage Cars | Owner only |
| `/owner/manage-bookings` | Manage Bookings | Owner only |

---

## 🎨 Tech Stack

- **React 18** + Vite
- **React Router v6** — File-system-like routing
- **Context API** — Global state (Auth, Cars, Bookings)
- **Tailwind CSS** — Utility-first styling
- **Google Fonts** — Syne (display) + DM Sans (body)
- **No backend** — All data from `assets.js` + local state

---

## ✨ Features

- ✅ Responsive design (mobile-first)
- ✅ Protected owner routes
- ✅ Fake login with role-based redirect
- ✅ Car filtering (city, category, price)
- ✅ Booking with price calculation
- ✅ Loading skeleton animations
- ✅ Image upload preview (base64)
- ✅ Availability toggle
- ✅ Booking status management (approve/reject/complete)
- ✅ Cancel booking with confirmation
- ✅ 404 page
- ✅ Star ratings
- ✅ Smooth hover animations
