import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const registerVendor = async (req: Request, res: Response) => {
  try {
    const { userId, storeName, payoutAccount } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user.role !== 'VENDOR') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'VENDOR' },
      });
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId,
        storeName,
        payoutAccount,
      },
    });
    res.status(201).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering vendor' });
  }
};

export const getVendorDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const vendor = await prisma.vendor.findFirst({
      where: { userId },
      include: {
        products: true,
        orders: true,
      },
    });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile missing' });
    
    const totalEarnings = vendor.earnings;
    const sales = await prisma.order.count({
      where: { vendorId: vendor.id },
    });
    
    res.json({ success: true, vendor: { ...vendor, totalEarnings, sales } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching vendor dashboard' });
  }
};

export const listVendorProducts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const vendor = await prisma.vendor.findFirst({
      where: { userId },
    });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile missing' });
    
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
    });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching vendor products' });
  }
};
