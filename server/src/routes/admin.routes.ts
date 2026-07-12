import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { dashboardMetrics, manageUsers, manageOrders, manageProducts } from '../controllers/admin.controller';

const router = Router();

router.use(authenticate, authorize(['admin']));
router.get('/dashboard', dashboardMetrics);
router.get('/users', manageUsers);
router.get('/orders', manageOrders);
router.get('/products', manageProducts);

export default router;
