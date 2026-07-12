import { Request, Response } from 'express';
import User from '../models/user.model';
import Order from '../models/order.model';
import Product from '../models/product.model';

export const dashboardMetrics = async (_req: Request, res: Response) => {
  const totalOrders = await Order.countDocuments();
  const totalSales = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
  const totalRevenue = totalSales[0]?.total || 0;
  const totalProducts = await Product.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'user' });

  res.json({
    success: true,
    dashboard: {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
    },
  });
};

export const manageUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json({ success: true, users });
};

export const manageOrders = async (_req: Request, res: Response) => {
  const orders = await Order.find().populate('user');
  res.json({ success: true, orders });
};

export const manageProducts = async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json({ success: true, products });
};
