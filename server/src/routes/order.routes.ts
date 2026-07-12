import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createOrder, getOrders, getOrderById, updateOrderStatus, trackOrder } from '../controllers/order.controller';

const router = Router();

router.use(authenticate);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', authorize(['admin', 'vendor']), updateOrderStatus);
router.get('/:id/track', trackOrder);

export default router;
