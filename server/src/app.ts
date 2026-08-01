import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import couponRoutes from './routes/coupon.routes';
import searchRoutes from './routes/search.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import vendorRoutes from './routes/vendor.routes';
import paymentRoutes from './routes/payment.routes';
import mongoose from 'mongoose';
import errorHandler from './middleware/error.middleware';
import { seedDemoData } from './utils/seedDemoData';

const app = express();

app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ name: 'PINAKK API', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pinakk-server', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/health' || req.path === '/seed-demo') {
    return next();
  }

  // Allow demo mode for products even without MongoDB
  if (req.path.startsWith('/api/products')) {
    return next();
  }

  // Allow demo mode for auth even without MongoDB
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  // Allow demo mode for admin even without MongoDB
  if (req.path.startsWith('/api/admin')) {
    return next();
  }

  if (req.path.startsWith('/api/') && mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Database unavailable. Start MongoDB and retry.' });
  }

  return next();
});

app.post('/seed-demo', async (req, res) => {
  try {
    const result = await seedDemoData();
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);

export default app;
