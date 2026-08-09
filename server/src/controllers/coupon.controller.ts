import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const listCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { startDate: 'desc' },
    });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons' });
  }
};

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id: req.params.id },
    });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupon' });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = await prisma.coupon.create({
      data: req.body,
    });
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating coupon' });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        active: true,
      },
    });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    
    const now = new Date();
    if (coupon.startDate > now || coupon.expiryDate < now) {
      return res.status(400).json({ success: false, message: 'Coupon is expired or not active' });
    }
    
    const usageCount = await prisma.couponUsage.count({
      where: { couponId: coupon.id },
    });
    
    if (usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }
    
    if (cartTotal < coupon.minimumOrderValue) {
      return res.status(400).json({ success: false, message: 'Minimum order value not met' });
    }
    
    const discount = coupon.discountType === 'flat' 
      ? coupon.discountValue 
      : (cartTotal * coupon.discountValue) / 100;
    
    res.json({ success: true, coupon, discount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error validating coupon' });
  }
};
