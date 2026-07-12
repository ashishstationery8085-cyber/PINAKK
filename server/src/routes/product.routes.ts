import { Router } from 'express';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, authorize(['admin', 'vendor']), createProduct);
router.put('/:id', authenticate, authorize(['admin', 'vendor']), updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct);

export default router;
