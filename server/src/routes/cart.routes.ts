import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getCart, addToCart, updateCartItem, removeFromCart, saveForLater } from '../controllers/cart.controller';

const router = Router();

router.use(authenticate);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);
router.post('/save-for-later', saveForLater);

export default router;
