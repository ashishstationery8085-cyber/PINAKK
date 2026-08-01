# PINAKK Marketplace - Deployment Guide

This guide covers deploying the PINAKK Marketplace e-commerce platform to Vercel or Netlify with MongoDB Atlas database.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account with a cluster (optional - demo mode available)
- Vercel or Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Start - Demo Mode (No MongoDB Required)

The application can run in **demo mode** without MongoDB connection:
- Demo products are served from memory
- Admin login works with demo credentials
- Product add functionality works in demo mode
- Perfect for testing and development

**Demo Admin Credentials:**
- Email: `admin@pinakk.com`
- Password: `admin123`

**MongoDB Credentials (for production):**
- User: `ashishstationery8085_db_user`
- Password: `campMjluWRgS63nm`
- Cluster: `cluster0.r2xqgoj.mongodb.net`

## Environment Variables

### Client Environment Variables

Create `.env.local` in the `client` directory:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_CLOUDINARY_BASE=https://res.cloudinary.com/your-cloud-name/image/upload
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Server Environment Variables

Create `.env` in the `server` directory:

```env
MONGO_URI=mongodb+srv://ashishstationery8085_db_user:campMjluWRgS63nm@cluster0.r2xqgoj.mongodb.net/?appName=Cluster0
JWT_SECRET=pinakk_jwt_secret_key_2024
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=production
PORT=4000
```

**Important:** For MongoDB Atlas, ensure:
- No port number in `mongodb+srv://` URIs
- Special characters in passwords are URL-encoded (e.g., `#` → `%23`)
- Your IP is whitelisted in MongoDB Atlas Network Access

## Database Setup

### Demo Mode (No MongoDB Required)

The application now supports **demo mode** without MongoDB. Demo products are served from memory for testing and development. This is perfect for:
- Quick testing and development
- Client-only deployments
- Situations where MongoDB is not available

Demo mode is automatically enabled when MongoDB is not configured or unavailable.

### 1. MongoDB Atlas Configuration (Optional)

For production deployments with persistent database:

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Go to **Network Access** → **IP Whitelist**
3. Add your IP address or select **Allow Access from Anywhere** (0.0.0.0/0)
4. Go to **Database Access** → Create a database user
5. Note the username and password for your connection string

### 2. Seed Database with Demo Products (Optional)

After setting up MongoDB, run the seed script:

```bash
cd server
npm run seed
```

This will populate your database with:
- 16 categories (Stationery, Notebooks, Pens, Art Supplies, etc.)
- 140+ demo products with images, descriptions, and variants

**Note:** If MongoDB is not available, the application will automatically use demo mode with 2 sample products.

## Deployment Options

### Option 1: Deploy to Vercel

#### Deploy Client (Frontend)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and click **New Project**
3. Import your repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables in Vercel dashboard
6. Click **Deploy**

#### Deploy Server (Backend)

Option A: Deploy to Railway/Render (Recommended)

1. Go to [Railway](https://railway.app/) or [Render](https://render.com/)
2. Create a new project
3. Connect your GitHub repository
4. Select the `server` directory
5. Add environment variables
6. Deploy

Option B: Deploy to Vercel Serverless Functions

1. Create an `api` directory in `client`
2. Move server routes to Vercel serverless functions
3. Update API URLs in client

### Option 2: Deploy to Netlify

#### Deploy Client (Frontend)

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com/) and click **Add new site**
3. Import your repository
4. Configure build settings:
   - **Build command**: `cd client && npm run build`
   - **Publish directory**: `client/.next`
5. Add environment variables in Netlify dashboard
6. Click **Deploy site**

#### Deploy Server (Backend)

Same as Vercel - use Railway, Render, or convert to Netlify Functions.

## Post-Deployment Steps

### 1. Update API URL

After deploying your backend, update the client's `NEXT_PUBLIC_API_URL` to point to your deployed backend URL.

### 2. Configure Payment Gateways

- **Stripe**: Update webhook endpoint in Stripe dashboard
- **Razorpay**: Update callback URLs in Razorpay settings

### 3. Test the Application

- Test user registration and login
- Test product browsing and search
- Test cart and checkout flow
- Test payment integration
- Test admin panel functionality

### 4. Set Up Custom Domain

- Add custom domain in Vercel/Netlify dashboard
- Configure DNS records with your domain provider
- Enable SSL (automatic on Vercel/Netlify)

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoParseError: mongodb+srv URI cannot have port number`

**Solution**: Remove `:27017` from your MongoDB URI. Use:
```
mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0
```

**Error**: `Could not connect to any servers in your MongoDB Atlas cluster`

**Solution**: Whitelist your IP in MongoDB Atlas Network Access settings.

### Build Errors

**Error**: Module not found

**Solution**: Run `npm install` in both `client` and `server` directories.

### Environment Variables Not Loading

**Solution**: Ensure all environment variables are added in the deployment platform's dashboard, not just in `.env` files.

## Performance Optimization

The application is already optimized with:
- Image optimization (Next.js Image component)
- Code splitting (automatic in Next.js)
- Caching headers (configured in next.config.js)
- Lazy loading (implemented for images and components)

For additional optimization:
- Enable CDN for static assets
- Use Redis for session caching
- Implement database indexing for frequently queried fields

## Security Checklist

- [ ] Change default JWT secret
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set up CORS properly for API
- [ ] Enable rate limiting on API endpoints
- [ ] Use environment variables for sensitive data
- [ ] Regular security updates for dependencies
- [ ] Enable MongoDB Atlas network access whitelist
- [ ] Set up monitoring and error tracking (Sentry, LogRocket)

## Monitoring

Recommended tools:
- **Vercel Analytics** (built-in for Vercel deployments)
- **Netlify Analytics** (built-in for Netlify deployments)
- **MongoDB Atlas** (database monitoring)
- **Sentry** (error tracking)
- **Google Analytics** (user analytics)

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review MongoDB Atlas [documentation](https://docs.atlas.mongodb.com/)
- Check Vercel [deployment docs](https://vercel.com/docs)
- Check Netlify [deployment docs](https://docs.netlify.com/)
