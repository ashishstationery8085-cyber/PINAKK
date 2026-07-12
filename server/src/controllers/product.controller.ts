import { Request, Response } from 'express';
import Product from '../models/product.model';
import Category from '../models/category.model';

export const listProducts = async (req: Request, res: Response) => {
  const { search, category, brand, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
  const filters: any = { status: 'active' };

  if (search) filters.$text = { $search: search };
  if (category) filters.category = category;
  if (brand) filters.brand = brand;
  if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
  if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };

  const products = await Product.find(filters)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort(sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 });

  const count = await Product.countDocuments(filters);
  res.json({ success: true, products, total: count });
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category subcategory relatedProducts');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

export const createProduct = async (req: Request, res: Response) => {
  const productData = req.body;
  const created = await Product.create(productData);
  res.status(201).json({ success: true, product: created });
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Product deleted successfully' });
};

export const createCategory = async (req: Request, res: Response) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
};
