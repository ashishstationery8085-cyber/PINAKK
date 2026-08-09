import { Request, Response } from 'express';
import prisma from '../lib/prisma';

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
    const product = await prisma.product.create({
      data: req.body,
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        category: true,
        subcategory: true,
        brand: true,
      },
    });
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Error updating product' });
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
