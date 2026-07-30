import { Request, Response } from 'express';
import Order from '../models/order.model';
import Cart from '../models/cart.model';

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { shippingDetails, payment, shippingMethod, items } = req.body;
  const orderItems = items || [];
  const subtotal = orderItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const total = subtotal + (shippingDetails.fee || 0) - (payment.discount || 0);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    subtotal,
    tax: payment.tax || 0,
    discount: payment.discount || 0,
    shipping: shippingDetails.fee || 0,
    total,
    status: 'pending',
    payment,
    shippingDetails,
  });

  await Cart.findOneAndUpdate({ user: userId }, { items: [] });
  res.status(201).json({ success: true, order });
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ user: (req as any).user._id });
  res.json({ success: true, orders });
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  order.status = req.body.status || order.status;
  await order.save();
  res.json({ success: true, order });
};

export const trackOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, status: order.status, tracking: order.shippingDetails?.trackingId || null });
};
