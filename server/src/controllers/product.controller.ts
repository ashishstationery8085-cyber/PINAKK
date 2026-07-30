import { Request, Response } from 'express';
import Product from '../models/product.model';
import Category from '../models/category.model';

const demoProducts = [
  {
    _id: 'demo-1',
    name: 'Signature Notebook',
    slug: 'signature-notebook',
    brand: 'PINAKK',
    category: 'notebooks',
    subcategory: 'notebooks',
    description: 'A premium A4 notebook designed for focused work and daily planning.',
    features: ['200 ruled pages', 'Durable covers', 'Smooth paper finish'],
    price: 149,
    stock: 120,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=900'],
    rating: 4.8,
    status: 'active',
  },
  {
    _id: 'demo-2',
    name: 'Precision Gel Pen',
    slug: 'precision-gel-pen',
    brand: 'PINAKK',
    category: 'pens',
    subcategory: 'pens',
    description: 'A smooth-writing gel pen with a comfortable grip for long sessions.',
    features: ['0.7mm tip', 'Fast-drying ink', 'Ergonomic grip'],
    price: 49,
    stock: 240,
    discount: 5,
    images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900'],
    rating: 4.7,
    status: 'active',
  },
];

export const listProducts = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    // Return demo products if MongoDB is not available
    console.log('MongoDB unavailable, returning demo products');
    res.json({ success: true, products: demoProducts, total: demoProducts.length, demo: true });
  }
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
