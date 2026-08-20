import Razorpay from 'razorpay';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const razorpayKey = process.env.RAZORPAY_KEY || process.env.RAZORPAY_KEY_ID || '';
const razorpaySecret = process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET || '';
const stripeSecret = process.env.STRIPE_SECRET || process.env.STRIPE_SECRET_KEY || '';

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2023-10-16' }) : null;

const getRazorpay = () => {
  if (!razorpayKey || !razorpaySecret) return null;
  return new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecret });
};

export const createRazorpayOrder = async (amount: number, currency = 'INR') => {
  const razorpay = getRazorpay();
  if (!razorpay) {
    throw new Error('Razorpay keys are not configured. Set RAZORPAY_KEY and RAZORPAY_SECRET.');
  }
  return await razorpay.orders.create({ amount: Math.round(amount * 100), currency, payment_capture: true });
};

export const createStripePaymentIntent = async (amount: number, currency = 'INR') => {
  if (!stripe) {
    throw new Error('Stripe secret key is not configured. Set STRIPE_SECRET.');
  }
  return await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency });
};

export default {
  createRazorpayOrder,
  createStripePaymentIntent,
};
