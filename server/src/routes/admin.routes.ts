import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { dashboardMetrics, manageUsers, manageOrders, manageProducts } from '../controllers/admin.controller';
import { createProduct, getProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = Router();

router.use(authenticate, authorize(['admin']));
router.get('/dashboard', dashboardMetrics);
router.get('/users', manageUsers);
router.get('/orders', manageOrders);
router.get('/products', manageProducts);
router.post('/products', createProduct);
router.get('/products/:id', getProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
