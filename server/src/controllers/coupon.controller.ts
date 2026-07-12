import { Request, Response } from 'express';
import Coupon from '../models/coupon.model';

export const listCoupons = async (_req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ startDate: -1 });
  res.json({ success: true, coupons });
};

export const getCoupon = async (req: Request, res: Response) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  res.json({ success: true, coupon });
};

export const createCoupon = async (req: Request, res: Response) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
};

export const validateCoupon = async (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  const now = new Date();
  if (coupon.startDate > now || coupon.expiryDate < now) {
    return res.status(400).json({ success: false, message: 'Coupon is expired or not active' });
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  }
  if (cartTotal < coupon.minimumOrderValue) {
    return res.status(400).json({ success: false, message: 'Minimum order value not met' });
  }
  const discount = coupon.discountType === 'flat' ? coupon.discountValue : (cartTotal * coupon.discountValue) / 100;
  res.json({ success: true, coupon, discount });
};
