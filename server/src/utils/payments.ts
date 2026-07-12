import Razorpay from 'razorpay';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export const createRazorpayOrder = async (amount: number, currency = 'INR') => {
  return await razorpay.orders.create({ amount: Math.round(amount * 100), currency, payment_capture: 1 });
};

export const createStripePaymentIntent = async (amount: number, currency = 'INR') => {
  return await stripe.paymentIntents.create({ amount: Math.round(amount * 100), currency });
};

export default {
  createRazorpayOrder,
  createStripePaymentIntent,
};
