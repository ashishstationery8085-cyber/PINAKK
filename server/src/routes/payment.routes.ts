import express from 'express';
import { Router } from 'express';
import { createRazorpayCheckout, createStripeIntent, ping, verifyRazorpayPayment, stripeWebhook } from '../controllers/payment.controller';

const router = Router();

router.get('/ping', ping);
router.post('/razorpay/create-order', createRazorpayCheckout);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/stripe/create-intent', createStripeIntent);
// Stripe webhook expects raw body for signature verification
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
