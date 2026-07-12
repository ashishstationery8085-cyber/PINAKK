# PINAKK Marketplace Installation Guide

## Prerequisites
- Node.js 20+
- npm 10+
- Docker and Docker Compose (optional but recommended)
- MongoDB or MongoDB Atlas

## Configure Environment
1. Copy `.env.example` to `.env`.
2. Set values for `MONGO_URI`, `JWT_SECRET`, Cloudinary keys, payment provider keys, social login credentials, and email provider.
3. Create `client/.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLOUDINARY_BASE=https://res.cloudinary.com/replace/image/upload
```

## Local Development
### Backend
```powershell
cd server
npm install
npm run dev
```

### Frontend
```powershell
cd client
npm install
npm run dev
```

## Docker Development
```powershell
docker compose up --build
```

Open the frontend at `http://localhost:3000` and the API at `http://localhost:4000`.

## Production Deployment
- Use a managed MongoDB instance.
- Configure secure environment variables for MongoDB, JWT secret, Cloudinary, Stripe, Razorpay, and email.
- Use HTTPS and a CDN for static assets.
- Build frontend and backend with `npm run build`.
- Deploy using Docker or a cloud service that supports Node.js.

## Notes
- The backend includes JWT authentication, RBAC, product management, cart and order flows, search, coupons, admin metrics, and vendor registration.
- The frontend includes a mobile-first home page, product discovery, auth, cart, dashboard, and admin landing pages.
- Extend the marketplace with vendor product management, OTP services, payment provider flows, and marketing automation.
