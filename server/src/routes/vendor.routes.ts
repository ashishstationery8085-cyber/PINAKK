import { Router } from 'express';
import { registerVendor, getVendorDashboard, listVendorProducts } from '../controllers/vendor.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerVendor);
router.get('/dashboard', authenticate, authorize(['vendor']), getVendorDashboard);
router.get('/products', authenticate, authorize(['vendor']), listVendorProducts);

export default router;
