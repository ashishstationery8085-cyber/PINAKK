import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        products: {
          where: { isActive: true },
          include: {
            brand: true,
          }
        }
      }
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Error fetching category' });
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

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
};
