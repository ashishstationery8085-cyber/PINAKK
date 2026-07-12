# PINAKK Marketplace

**PINAKK** is a modern enterprise-grade, mobile-first commerce marketplace built with Next.js, React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB.

## Brand
- Name: PINAKK
- Tagline: Shop Smart, Live Better
- Theme: Premium, Clean, Modern

## Core Capabilities
- Multi-category marketplace
- User accounts, wallets, referrals, loyalty
- Product catalog with variants, reviews, Q&A, recommendations
- Search, filters, voice search, smart suggestions
- Cart, checkout, home delivery, store pickup
- Razorpay, Stripe, UPI, wallets, COD
- Admin panel, vendor system, inventory, analytics
- SEO-ready, PWA support, image optimization, mobile-first
- Docker production-ready deployment

## Folder Structure
- `client/` — Frontend Next.js application
- `server/` — Backend Express API with MongoDB
- `docker-compose.yml` — Local development and production containers
- `.env.example` — Environment variables sample

## Installation
1. Clone the repository.
2. Create `.env` for server and `client/.env.local` for frontend.
3. Run `docker compose up --build`.
4. Open frontend at `http://localhost:3000` and API at `http://localhost:4000`.

## Features Included
- Authentication: email/password, mobile OTP, social login hooks, JWT, RBAC
- Product management: categories, brands, variants, gallery, video, review, related items
- Order management: processing, shipping, tracking, returns, reports
- Vendor system: registration, dashboard, product catalog, earnings
- Admin tools: coupons, banners, inventory, analytics, SEO management
- Marketing: flash sales, deals, affiliate, loyalty, gift cards
- Security: CSRF, XSS-safe headers, SQL injection-safe by design, SSL-ready by deployment
- Performance: lazy loading, CDN-friendly images, PWA manifest, mobile-ready API

## Development
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

### Deployment with Docker
```powershell
docker compose up --build
```

## Documentation
- `API_DOCUMENTATION.md` — Full backend endpoint reference
- `INSTALLATION_GUIDE.md` — Local setup, Docker, and production deployment instructions

## API Documentation
See `server/src/routes` and `server/src/controllers` for route definitions.

### Example API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/otp-login`
- `POST /api/auth/forgot-password`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `POST /api/cart`
- `POST /api/orders`
- `GET /api/admin/dashboard`
- `POST /api/vendors/register`

## Production Notes
- Use managed MongoDB Atlas or self-hosted MongoDB
- Configure Cloudinary API keys for image storage
- Integrate Razorpay, Stripe, Paytm, PhonePe via env variables
- Use HTTPS, a CDN, and a static asset host for frontend
- Set `NEXT_PUBLIC_API_URL` and server `MONGO_URI` before launch

Deployment with Docker (recommended)
- Copy `.env.production.example` to `.env` (or create `server/.env` and `client/.env.production`) and fill values.
- Build and run with Docker Compose (multi-stage Dockerfiles produce lean production images):

```powershell
docker compose up --build -d
```

Notes:
- Ensure `NEXT_PUBLIC_API_URL` points to the server service (for docker-compose use `http://server:4000/api`).
- For Stripe webhooks in production, configure your webhook endpoint in the Stripe dashboard to `https://your-domain.com/api/payments/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.
- Keep secrets out of version control; use a secrets manager for production values.

I added a `scripts/deploy_prod.sh` helper, a `docker-compose.prod.yml`, an example `deploy/nginx.conf`, and a systemd unit example at `deploy/pinakk.service`.

Quick deploy steps (example):

1. Copy production env files to the server (or store them at `/opt/pinakk/server/.env` and `/opt/pinakk/client/.env.production`).

2. Run the deploy script from your machine:

```bash
./scripts/deploy_prod.sh user@your-server.example.com /opt/pinakk
```

3. On the server, enable systemd unit (optional):

```bash
sudo mv deploy/pinakk.service /etc/systemd/system/pinakk.service
sudo systemctl daemon-reload
sudo systemctl enable --now pinakk.service
```

Security notes: Keep TLS private keys and env secrets outside the repo and mounted into the server/container at runtime. Use a secrets manager or cloud provider secret store for production.

If you want, I can add a GitHub Actions deploy job that uses an SSH deploy key and runs this script automatically on `main`.

CI / CD & Deployment
- Build and push images: The repository includes a sample GitHub Actions workflow at `.github/workflows/ci.yml` that builds and pushes `pinakk-server` and `pinakk-client` images to GitHub Container Registry (GHCR). It requires `GITHUB_TOKEN` (provided by Actions) and repo permissions to publish packages.
- Deploy options:
	- Docker Compose: pull images on the target host and run `docker compose up -d` with service-specific env files.
	- Kubernetes: use the built images in a Deployment manifest and configure an Ingress + TLS.
	- SSH deploy: use an action to SSH and run docker-compose or scripts on your host.

Reverse proxy (Nginx) example for production
```nginx
server {
	listen 80;
	server_name example.com;

	location / {
		proxy_pass http://127.0.0.1:3000; # Next.js client
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location /api/ {
		proxy_pass http://127.0.0.1:4000/api/;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

TLS / HTTPS
- Use Certbot with Nginx to obtain Let’s Encrypt certificates or provision TLS at your load balancer / CDN.

Healthchecks & monitoring
- Keep Docker `HEALTHCHECK` for the server and use process managers or container orchestrators for automatic restarts and observability.

Support
- If you want, I can add a deploy action that SSHs to a host and runs `docker compose pull && docker compose up -d`, or create Kubernetes manifests for a simple deployment.
