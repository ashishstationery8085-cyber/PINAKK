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
  {
    _id: 'demo-3',
    name: 'Premium Sketchbook',
    slug: 'premium-sketchbook',
    brand: 'PINAKK',
    category: 'notebooks',
    subcategory: 'notebooks',
    description: 'Professional-grade sketchbook with acid-free paper for artists.',
    features: ['100 sheets', 'Acid-free paper', 'Spiral binding'],
    price: 299,
    stock: 85,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888c57?w=900'],
    rating: 4.9,
    status: 'active',
  },
  {
    _id: 'demo-4',
    name: 'Executive Ballpoint Pen',
    slug: 'executive-ballpoint-pen',
    brand: 'PINAKK',
    category: 'pens',
    subcategory: 'pens',
    description: 'Luxury ballpoint pen with metal finish and smooth ink flow.',
    features: ['Metal body', 'Smooth ink', 'Premium finish'],
    price: 199,
    stock: 150,
    discount: 20,
    images: ['https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=900'],
    rating: 4.6,
    status: 'active',
  },
  {
    _id: 'demo-5',
    name: 'Art Canvas Set',
    slug: 'art-canvas-set',
    brand: 'PINAKK',
    category: 'art-supplies',
    subcategory: 'art-supplies',
    description: 'Professional canvas set for painting and artwork.',
    features: ['5 canvases', 'Stretched cotton', 'Primed surface'],
    price: 599,
    stock: 45,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900'],
    rating: 4.8,
    status: 'active',
  },
  {
    _id: 'demo-6',
    name: 'Brush Collection Set',
    slug: 'brush-collection-set',
    brand: 'PINAKK',
    category: 'art-supplies',
    subcategory: 'brushes',
    description: 'Complete brush set for various painting techniques.',
    features: ['12 brushes', 'Natural hair', 'Wooden handles'],
    price: 449,
    stock: 60,
    discount: 12,
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900'],
    rating: 4.7,
    status: 'active',
  },
  {
    _id: 'demo-7',
    name: 'Desk Organizer',
    slug: 'desk-organizer',
    brand: 'PINAKK',
    category: 'desk-essentials',
    subcategory: 'desk-essentials',
    description: 'Modern desk organizer for keeping your workspace tidy.',
    features: ['Multiple compartments', 'Wooden finish', 'Compact design'],
    price: 349,
    stock: 90,
    discount: 8,
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900'],
    rating: 4.5,
    status: 'active',
  },
  {
    _id: 'demo-8',
    name: 'LED Desk Lamp',
    slug: 'led-desk-lamp',
    brand: 'PINAKK',
    category: 'desk-essentials',
    subcategory: 'desk-essentials',
    description: 'Adjustable LED desk lamp with multiple brightness levels.',
    features: ['Touch control', 'USB charging', 'Flexible neck'],
    price: 599,
    stock: 70,
    discount: 15,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900'],
    rating: 4.6,
    status: 'active',
  },
  {
    _id: 'demo-9',
    name: 'Watercolor Paint Set',
    slug: 'watercolor-paint-set',
    brand: 'PINAKK',
    category: 'art-supplies',
    subcategory: 'colors',
    description: 'Professional watercolor paint set with 24 vibrant colors.',
    features: ['24 colors', 'High pigment', 'Portable case'],
    price: 399,
    stock: 55,
    discount: 18,
    images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=900'],
    rating: 4.8,
    status: 'active',
  },
  {
    _id: 'demo-10',
    name: 'Journal Notebook',
    slug: 'journal-notebook',
    brand: 'PINAKK',
    category: 'notebooks',
    subcategory: 'notebooks',
    description: 'Elegant journal notebook for daily reflections and planning.',
    features: ['Leather cover', 'Lined pages', 'Bookmark ribbon'],
    price: 249,
    stock: 100,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=900'],
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
  try {
    const productData = req.body;
    const created = await Product.create(productData);
    res.status(201).json({ success: true, product: created });
  } catch (error) {
    // Add to demo products if MongoDB is not available
    console.log('MongoDB unavailable, adding to demo products');
    const newProduct = {
      _id: `demo-${Date.now()}`,
      ...req.body,
      status: 'active',
    };
    demoProducts.push(newProduct);
    res.status(201).json({ success: true, product: newProduct, demo: true });
  }
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
