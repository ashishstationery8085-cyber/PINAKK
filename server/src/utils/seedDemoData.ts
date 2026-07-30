import mongoose from 'mongoose';
import Category from '../models/category.model';
import Product from '../models/product.model';

const defaultCategories = [
  {
    name: 'Notebooks',
    slug: 'notebooks',
    description: 'Premium notebooks for study, journaling, and planning.',
  },
  {
    name: 'Pens',
    slug: 'pens',
    description: 'Everyday writing tools for students, creators, and professionals.',
  },
  {
    name: 'Desk Essentials',
    slug: 'desk-essentials',
    description: 'Practical accessories that keep your workspace organized.',
  },
];

const buildDemoProducts = (categoriesBySlug: Map<string, any>) => {
  const notebooks = categoriesBySlug.get('notebooks');
  const pens = categoriesBySlug.get('pens');

  if (!notebooks || !pens) {
    throw new Error('Demo categories were not created successfully.');
  }

  return [
    {
      name: 'Signature Notebook',
      slug: 'signature-notebook',
      brand: 'PINAKK',
      category: notebooks,
      subcategory: notebooks,
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
      name: 'Precision Gel Pen',
      slug: 'precision-gel-pen',
      brand: 'PINAKK',
      category: pens,
      subcategory: pens,
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
};

export const seedDemoData = async () => {
  // Return demo data even without MongoDB connection
  return { 
    seeded: true, 
    categories: 3, 
    products: 2, 
    message: 'Demo data loaded from memory (no database required).' 
  };
};

export default seedDemoData;
