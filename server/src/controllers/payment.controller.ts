import { Request, Response } from 'express';
import payments from '../utils/payments';
import crypto from 'crypto';
import Order from '../models/order.model';
import Stripe from 'stripe';

export const createRazorpayCheckout = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const order = await payments.createRazorpayOrder(amount);
  res.json({ success: true, order });
};

export const createStripeIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;
  const paymentIntent = await payments.createStripePaymentIntent(amount);
  res.json({ success: true, paymentIntent });
};

export const ping = (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Payment gateway available' });
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing verification fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const generated = crypto.createHmac('sha256', secret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

    if (generated !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Find the application order linked to this razorpay order id
    const order = await Order.findOne({ 'payment.transactionId': razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = 'paid';
    order.payment.status = 'paid';
    order.payment.transactionId = razorpay_payment_id;
    order.payment.gatewayResponse = { razorpay_order_id, razorpay_payment_id, razorpay_signature };
    await order.save();

    return res.json({ success: true, order });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

    if (!sig) {
      return res.status(400).send(`Missing stripe signature`);
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const order = await Order.findOne({ 'payment.transactionId': pi.id });
      if (order) {
        order.status = 'paid';
        order.payment.status = 'paid';
        order.payment.gatewayResponse = pi;
        await order.save();
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
