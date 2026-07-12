import { Request, Response } from 'express';
import Product from '../models/product.model';

export const searchSuggestions = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') return res.json({ success: true, suggestions: [] });

  const suggestions = await Product.find({ $text: { $search: q } })
    .limit(12)
    .select('name brand category slug')
    .lean();

  res.json({ success: true, suggestions });
};

export const smartSearch = async (req: Request, res: Response) => {
  const { q, category, brand, minPrice, maxPrice } = req.query;
  const filters: any = { status: 'active' };

  if (q) filters.$text = { $search: q };
  if (category) filters.category = category;
  if (brand) filters.brand = brand;
  if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
  if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };

  const products = await Product.find(filters).limit(60).sort({ createdAt: -1 });
  res.json({ success: true, products });
};
