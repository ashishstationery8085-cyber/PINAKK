import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const searchSuggestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') return res.json({ success: true, suggestions: [] });

    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { brand: { is: { name: { contains: q } } } },
        ],
        isActive: true,
      },
      take: 12,
      select: {
        id: true,
        name: true,
        brand: true,
        slug: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching search suggestions' });
  }
};

export const smartSearch = async (req: Request, res: Response) => {
  try {
    const { q, category, brand, minPrice, maxPrice } = req.query;
    const where: any = { isActive: true };

    if (q) {
      where.OR = [
        { name: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
        { brand: { contains: q as string, mode: 'insensitive' } },
      ];
    }
    if (category) where.categoryId = category as string;
    if (brand) where.brandId = brand as string;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const products = await prisma.product.findMany({
      where,
      take: 60,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error performing search' });
  }
};
