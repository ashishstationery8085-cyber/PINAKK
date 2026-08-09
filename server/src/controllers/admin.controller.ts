import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const dashboardMetrics = async (_req: Request, res: Response) => {
  try {
    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.user.count({
      where: { role: 'USER' },
    });

    res.json({
      success: true,
      dashboard: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching dashboard metrics' });
  }
};

export const manageUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        walletBalance: true,
        createdAt: true,
      },
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

export const manageOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
};

export const manageProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};
