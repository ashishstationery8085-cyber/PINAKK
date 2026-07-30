# PINAKK Marketplace - Deployment Steps

## Quick Deployment via Vercel Dashboard

### Step 1: Push Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create repository on GitHub
3. Push code:
   ```bash
   git remote add origin https://github.com/your-username/pinakk-marketplace.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Client to Vercel

1. Go to [Vercel](https://vercel.com/) and login
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**

### Step 3: Configure Environment Variables

After deployment, add environment variables in Vercel Dashboard:

1. Go to Project → Settings → Environment Variables
2. Add the following variables:

**For Demo Mode (No Server Required):**
```env
NEXT_PUBLIC_API_URL=https://your-deployed-server-url.com/api
# Or use local server for testing:
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://your-server-url.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
NEXT_PUBLIC_CLOUDINARY_BASE=https://res.cloudinary.com/your-cloud-name
```

### Step 4: Deploy Server (Optional)

If you want to deploy the backend:

**Option A: Railway**
1. Go to [Railway](https://railway.app/)
2. Click **"New Project"**
3. Connect GitHub repository
4. Select `server` directory
5. Add environment variables from `server/.env`
6. Deploy

**Option B: Render**
1. Go to [Render](https://render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

### Step 5: Update Client API URL

After deploying server:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your deployed server URL
3. Redeploy client

## Testing Deployment

1. Open your deployed Vercel URL
2. Check if products are loading
3. Test navigation
4. Test cart functionality

## Current Demo Mode Status

The application is currently running in **demo mode**:
- Server: `http://localhost:4000`
- Client: `http://localhost:3000`
- Demo Products: 2 (Signature Notebook, Precision Gel Pen)
- MongoDB: Not required

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check build logs in Vercel dashboard

### Products Not Loading
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check if server is running
- Check browser console for errors

### Environment Variables Not Working
- Ensure variables are added in Vercel dashboard
- Restart deployment after adding variables
- Check variable names match exactly

## Next Steps

1. Push code to GitHub
2. Deploy to Vercel via dashboard
3. Configure environment variables
4. Test deployed application
5. (Optional) Deploy server to Railway/Render
6. Update client API URL
