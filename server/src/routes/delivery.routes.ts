import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getDeliveryDashboard,
  getOrderDetails,
  updateOrderStatus,
  updateLocation,
  getLiveLocation,
  getLocationHistory,
  updateAvailability
} from '../controllers/delivery.controller';

const router = Router();

// Middleware: Only delivery boys can access these routes
const deliveryBoyOnly = [authenticate, authorize(['delivery_boy'])];

// Delivery boy routes
router.get('/dashboard', ...deliveryBoyOnly, getDeliveryDashboard);
router.get('/order/:orderId', ...deliveryBoyOnly, getOrderDetails);
router.patch('/order/:orderId/status', ...deliveryBoyOnly, updateOrderStatus);
router.post('/location', ...deliveryBoyOnly, updateLocation);
router.get('/location/history/:orderId', ...deliveryBoyOnly, getLocationHistory);
router.patch('/availability', ...deliveryBoyOnly, updateAvailability);

// Public route - get delivery boy live location (customer can access)
router.get('/live-location/:deliveryBoyId', getLiveLocation);

export default router;
