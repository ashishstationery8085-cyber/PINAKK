import { Router } from 'express';
import { register, login, otpLogin, refreshToken, forgotPassword, resetPassword, profile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/otp-login', otpLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/refresh', refreshToken);
router.get('/profile', authenticate, profile);

export default router;
