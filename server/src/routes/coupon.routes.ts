import { Router } from 'express';
import { listCoupons, getCoupon, createCoupon, validateCoupon } from '../controllers/coupon.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', listCoupons);
router.get('/:id', getCoupon);
router.post('/', authenticate, authorize(['admin']), createCoupon);
router.post('/validate', authenticate, validateCoupon);

export default router;
