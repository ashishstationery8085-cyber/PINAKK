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
import errorHandler from './middleware/error.middleware';

const app = express();

app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ name: 'PINAKK API', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pinakk-server', database: 'connected' });
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
