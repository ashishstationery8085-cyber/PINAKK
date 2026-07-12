import { Request, Response } from 'express';
import Vendor from '../models/vendor.model';
import User from '../models/user.model';
import Order from '../models/order.model';
import Product from '../models/product.model';

export const registerVendor = async (req: Request, res: Response) => {
  const { userId, storeName, payoutAccount } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.role !== 'vendor') user.role = 'vendor';
  await user.save();

  const vendor = await Vendor.create({ user: user._id, storeName, payoutAccount });
  res.status(201).json({ success: true, vendor });
};

export const getVendorDashboard = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const vendor = await Vendor.findOne({ user: userId }).populate('products orders');
  if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile missing' });
  const totalEarnings = vendor.earnings;
  const sales = await Order.countDocuments({ vendor: vendor._id });
  res.json({ success: true, vendor: { ...vendor.toObject(), totalEarnings, sales } });
};

export const listVendorProducts = async (req: Request, res: Response) => {
  const userId = (req as any).user._id;
  const vendor = await Vendor.findOne({ user: userId });
  if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile missing' });
  const products = await Product.find({ _id: { $in: vendor.products } });
  res.json({ success: true, products });
};
