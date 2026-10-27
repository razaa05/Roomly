# Roomly — Full-Stack Hotel Booking & Management System (MERN)

A modern full-stack web application built with **React 18 (Vite)**, **Node.js (Express)**, and **MongoDB (Mongoose)**, featuring role-based authorization (Guest, Staff, Admin), room booking engine with conflict detection, live operational status management, and analytics dashboard.

---

## Features
- **Guest Experience**: Interactive room exploration, category and price filters, real-time availability search, booking management, and cancellation.
- **Staff Operations**: Real-time room status toggling (Available, Cleaning, Occupied, Maintenance) and guest check-in/check-out workflow.
- **Admin Dashboard**: Visual analytics chart with reservation trends, room inventory CRUD, user role management, and revenue metrics.
- **Security & Reliability**: JWT authentication, rate limiting, bcrypt password hashing, and clean CORS configuration for production deployments.

---

## Project Structure
```text
Roomly/
├── backend/                # Express API & MongoDB Models
│   ├── src/
│   │   ├── middleware/     # Auth & Role guards
│   │   ├── models/         # User, Room, Booking Mongoose schemas
│   │   ├── routes/         # Auth, Rooms, Bookings, Admin endpoints
│   │   ├── utils/          # Date & booking calculations
│   │   ├── seed.js         # Initial database seeder
│   │   └── server.js       # Express server entry point
│   ├── .env.example
│   └── package.json
├── frontend/               # React + Vite Client
│   ├── src/
│   │   ├── components/     # Navbar, RoomCard, ProtectedRoute
│   │   ├── context/        # AuthContext & token management
│   │   ├── pages/          # Home, Rooms, Details, Bookings, Ops, Admin
│   │   ├── api.js          # Axios API client
│   │   └── styles.css      # Custom styling
│   ├── vercel.json         # SPA rewrite routing for Vercel
│   ├── .env.example
│   └── package.json
├── package.json            # Monorepo root scripts
└── README.md
```

---

## Quick Start (Local Setup)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18 or v20+ (LTS)
- MongoDB running locally or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster

### 2. Configure & Run Backend
```bash
cd backend
npm install
npm run seed     # Populates sample rooms & demo accounts
npm run dev      # Starts API on http://localhost:5000
```

### 3. Configure & Run Frontend
```bash
cd frontend
npm install
npm run dev      # Starts Vite on http://localhost:5173
```

---

## Demo Accounts
| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@roomly.local` | `Admin123!` | `/admin` (Analytics, Rooms, Users, Bookings) |
| **Staff** | `staff@roomly.local` | `Staff123!` | `/operations` (Check-in/out, Room status) |
| **Guest** | `guest@roomly.local` | `Guest123!` | `/rooms`, `/my-bookings` |

---

## Featured Demo Rooms
| Room Name | Room # | Category | Price / Night | Capacity | Key Amenities |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Classic Comfort** | 101 | Standard | ₹2,200 | 2 guests | Wi-Fi, Air conditioning, TV, Work desk |
| **Deluxe Retreat** | 202 | Deluxe | ₹3,800 | 2 guests | Smart TV, Mini fridge, contemporary design |
| **Ocean Breeze Deluxe** | 305 | Deluxe | ₹4,200 | 2 guests | Sea View, Breakfast included, Coffee maker |
| **Urban Suite** | 301 | Suite | ₹6,200 | 3 guests | Lounge area, Mini fridge, Room service |
| **Family Haven** | 401 | Family | ₹5,100 | 4 guests | Extra beds, spacious family layout, TV |
| **Mountain View Suite** | 501 | Suite | ₹7,500 | 3 guests | Panoramic Mountain View, Private Balcony |
| **Presidential Penthouse** | 601 | Suite | ₹12,500 | 4 guests | Private Jacuzzi, Butler, Skyline View |

---

## Deployment (Live on the Internet)

### 1. Cloud Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Add Database User with username and password.
3. In Network Access, allow IP `0.0.0.0/0` (Anywhere).
4. Copy the connection string.

### 2. Backend on Render.com (Free)
1. Connect your GitHub repository on [Render](https://render.com).
2. Create a **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Set Environment Variables:
   - `MONGODB_URI`: *Your Atlas connection string*
   - `JWT_SECRET`: *Any secure random secret*
   - `CLIENT_URL`: `*` (or your Vercel frontend URL)
   - `NODE_ENV`: `production`

### 3. Frontend on Vercel.com (Free)
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-backend-url>/api`
4. Click **Deploy**.
