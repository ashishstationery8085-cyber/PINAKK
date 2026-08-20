import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `product-${Date.now()}`;

const normalizeProductPayload = async (payload: any) => {
  const {
    images,
    features,
    tags,
    category,
    brand,
    status,
    featured,
    comparePrice,
    ...rest
  } = payload;

  const categoryName = typeof category === 'string' ? category : category?.name;
  const categoryRecord = categoryName
    ? await prisma.category.findFirst({ where: { name: categoryName } })
    : null;

  const brandName = typeof brand === 'string' ? brand : brand?.name;
  const brandRecord = brandName
    ? await prisma.brand.findFirst({ where: { name: brandName } })
    : null;

  const name = String(rest.name || 'Untitled Product').trim();
  const description = String(rest.description || '').trim();
  const price = Number(rest.price ?? 0);
  const stock = Number(rest.stock ?? 0);
  const normalizedImages = Array.isArray(images) ? images : images ? [images] : [];
  const normalizedFeatures = Array.isArray(features)
    ? features
    : features
      ? [features]
      : Array.isArray(tags)
        ? tags
        : [];

  if (!categoryRecord) {
    throw new Error('Category not found');
  }

  return {
    ...rest,
    name,
    description,
    slug: rest.slug || slugify(name),
    sku: rest.sku || `PIN-${Date.now()}`,
    price,
    stock,
    images: JSON.stringify(normalizedImages),
    features: JSON.stringify(normalizedFeatures),
    categoryId: categoryRecord.id,
    brandId: brandRecord?.id ?? undefined,
    discountPrice: comparePrice ? Number(comparePrice) : undefined,
    isActive: status === 'inactive' ? false : true,
    isFeatured: Boolean(featured),
  };
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const filters: any = { isActive: true };

    if (category) filters.categoryId = category;
    if (brand) filters.brandId = brand;
    if (minPrice) filters.price = { ...filters.price, gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, lte: Number(maxPrice) };

    const products = await prisma.product.findMany({
      where: filters,
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
      orderBy: sort ? { [sort as string]: 'asc' } : { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    const count = await prisma.product.count({ where: filters });
    res.json({ success: true, products, total: count });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        subcategory: true,
        brand: true,
        variants: true,
        reviews: {
          include: { user: true },
          where: { isApproved: true }
        },
      },
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = await normalizeProductPayload(req.body);

    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
    });
    res.status(201).json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    const message = error?.message === 'Category not found'
      ? 'Category not found. Select a valid category before creating the product.'
      : 'Error creating product';
    res.status(400).json({ success: false, message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productData = await normalizeProductPayload({ ...req.body, slug: req.body.slug || undefined, sku: req.body.sku || undefined });
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: productData,
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
    });
    res.json({ success: true, product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    const message = error?.message === 'Category not found'
      ? 'Category not found. Select a valid category before updating the product.'
      : 'Error updating product';
    res.status(400).json({ success: false, message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.create({
      data: req.body,
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Error creating category' });
  }
};
