# MySQL Database Setup Guide for PINAKK Marketplace

## Current Status
✅ MongoDB to MySQL migration completed
✅ All code converted to use Prisma + MySQL
✅ Database schema designed and implemented
✅ Seed script created with demo data
❌ MySQL database not yet connected

## Next Steps to Complete Setup

### Option 1: Use PlanetScale (Recommended - Free Tier)

1. **Create PlanetScale Account**
   - Go to [planetscale.com](https://planetscale.com)
   - Sign up for a free account

2. **Create Database**
   - Click "Create database"
   - Name it `pinakk`
   - Select region closest to you
   - Click "Create database"

3. **Get Connection String**
   - Go to your database dashboard
   - Click "Connect"
   - Select "Prisma" as the connection method
   - Copy the connection string

4. **Update .env File**
   ```bash
   DATABASE_URL="mysql://your_user:your_password@aws.connect.psdb.cloud/pinakk?sslaccept=strict"
   ```

5. **Run Migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed Database**
   ```bash
   npm run seed
   ```

### Option 2: Use Railway (Free Tier)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up for a free account

2. **Create MySQL Database**
   - Click "New Project"
   - Select "Database"
   - Choose "MySQL"
   - Click "Add MySQL"

3. **Get Connection String**
   - Go to your MySQL database
   - Click "Variables" tab
   - Copy the `DATABASE_URL` value

4. **Update .env File**
   - Paste the Railway connection string

5. **Run Migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed Database**
   ```bash
   npm run seed
   ```

### Option 3: Use Neon (PostgreSQL Alternative)

If you prefer PostgreSQL instead of MySQL, you can use Neon:

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create Database**
   - Create a new PostgreSQL database
   - Copy the connection string

3. **Update Prisma Schema**
   - Change `provider = "mysql"` to `provider = "postgresql"` in `prisma/schema.prisma`

4. **Update .env File**
   - Paste the Neon connection string

5. **Run Migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed Database**
   ```bash
   npm run seed
   ```

### Option 4: Install MySQL Locally

If you prefer to run MySQL locally:

1. **Download MySQL**
   - Go to [dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
   - Download MySQL Community Server
   - Install with default settings

2. **Create Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE pinakk;
   EXIT;
   ```

3. **Update .env File**
   ```bash
   DATABASE_URL="mysql://root:your_password@localhost:3306/pinakk"
   ```

4. **Run Migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed Database**
   ```bash
   npm run seed
   ```

## After Database Setup

Once you have a working MySQL database:

1. **Test Connection**
   ```bash
   npm run dev
   ```
   The server should connect to MySQL successfully.

2. **Test Authentication**
   - Register: `POST /api/auth/register`
   - Login: `POST /api/auth/login`
   - Admin credentials: `admin@pinakk.com` / `admin123`
   - User credentials: `user@pinakk.com` / `user123`

3. **Test API Endpoints**
   - Products: `GET /api/products`
   - Categories: `GET /api/categories`
   - Cart: `GET /api/cart`
   - Orders: `GET /api/orders`

## Database Schema

The following tables are created:

- `User` - Users with roles (USER, ADMIN, VENDOR)
- `Address` - User addresses
- `Category` - Product categories with hierarchy
- `Brand` - Product brands
- `Product` - Products with variants
- `ProductVariant` - Product size/color variants
- `ProductRelation` - Related products
- `Cart` - Shopping carts
- `CartItem` - Items in cart
- `Wishlist` - User wishlists
- `WishlistItem` - Wishlist items
- `Order` - Orders with status tracking
- `OrderItem` - Items in orders
- `Payment` - Payment records
- `Coupon` - Discount coupons
- `CouponUsage` - Coupon usage tracking
- `Review` - Product reviews
- `FavoriteProduct` - User favorite products
- `Banner` - Homepage banners
- `Settings` - Application settings

## Seed Data

The seed script creates:

- 2 users (1 admin, 1 regular user)
- 6 categories (Notebooks, Pens, Art Supplies, Desk Essentials, Sketchbooks, Stationery Sets)
- 1 brand (PINAKK)
- 10 products with various features
- 2 product variants
- 2 coupons (WELCOME10, FLAT50)
- 2 banners
- 3 settings

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL is correct in .env
- Check if database server is running
- Ensure firewall allows connections
- Verify SSL settings in connection string

### Migration Issues
- Delete `prisma/migrations` folder and run `npm run prisma:migrate` again
- Check Prisma schema for syntax errors
- Ensure database exists before running migrations

### Seed Issues
- Ensure migrations have been run first
- Check seed script for data conflicts
- Verify database permissions

## Production Deployment

For production deployment:

1. **Use Production Database**
   - Create production database in PlanetScale/Railway
   - Update DATABASE_URL with production connection string

2. **Environment Variables**
   - Set all required environment variables
   - Never commit .env file

3. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

## Support

If you encounter issues:
- Check Prisma documentation: [prisma.io/docs](https://www.prisma.io/docs)
- Check PlanetScale documentation: [planetscale.com/docs](https://planetscale.com/docs)
- Check Railway documentation: [railway.app/docs](https://railway.app/docs)
