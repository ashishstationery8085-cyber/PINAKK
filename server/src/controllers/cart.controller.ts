import { Request, Response } from 'express';
import Cart from '../models/cart.model';

export const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  res.json({ success: true, cart: cart || { items: [] } });
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { product, variant, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  const existing = cart.items.find((item: any) => item.product.toString() === product && JSON.stringify(item.variant) === JSON.stringify(variant));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product, variant, quantity });
  }
  await cart.save();
  res.json({ success: true, cart });
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  item.quantity = Math.max(1, quantity);
  await cart.save();
  res.json({ success: true, cart });
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  cart.items.id(itemId)?.remove();
  await cart.save();
  res.json({ success: true, cart });
};

export const saveForLater = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const { itemId } = req.body;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  item.savedForLater = true;
  await cart.save();
  res.json({ success: true, cart });
};
