'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';

const CATEGORIES = [
  {
    slug: 'stationery',
    name: 'Stationery',
    description: 'Pens, pencils, notebooks, and more',
    icon: '✏️',
    color: 'from-blue-50 to-blue-100',
  },
  {
    slug: 'paper',
    name: 'Paper Products',
    description: 'Quality paper for printing and writing',
    icon: '📄',
    color: 'from-amber-50 to-amber-100',
  },
  {
    slug: 'office',
    name: 'Office Supplies',
    description: 'Desk organizers and office essentials',
    icon: '🗂️',
    color: 'from-slate-50 to-slate-100',
  },
  {
    slug: 'gifts',
    name: 'Gift Items',
    description: 'Perfect gifts for any occasion',
    icon: '🎁',
    color: 'from-pink-50 to-pink-100',
  },
  {
    slug: 'perfumes',
    name: 'Perfumes',
    description: 'Premium fragrances and colognes',
    icon: '🌸',
    color: 'from-purple-50 to-purple-100',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Fashion and lifestyle accessories',
    icon: '👜',
    color: 'from-orange-50 to-orange-100',
  },
  {
    slug: 'belts',
    name: 'Belts',
    description: 'Stylish belts for every style',
    icon: '🎀',
    color: 'from-rose-50 to-rose-100',
  },
  {
    slug: 'general',
    name: 'General Store',
    description: 'Everyday essentials and more',
    icon: '🛒',
    color: 'from-green-50 to-green-100',
  },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-slate-900">Shop by Category</h1>
        <p className="mt-4 text-lg text-slate-600">
          Explore our wide range of products across multiple categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group"
          >
            <div className={`h-full rounded-2xl bg-gradient-to-br ${category.color} p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{category.description}</p>
              <div className="mt-4 flex items-center text-primary font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Explore <FiArrowRight className="ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
        <h2 className="text-3xl font-bold">New Arrivals</h2>
        <p className="mt-2 text-blue-100">Check out our latest products added to each category</p>
        <Link href="/products" className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">
          View All Products
        </Link>
      </div>

      {/* Info Cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-bold text-slate-900">Fast Delivery</h3>
          <p className="mt-2 text-sm text-slate-600">Quick delivery to your doorstep</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-bold text-slate-900">Quality Assured</h3>
          <p className="mt-2 text-sm text-slate-600">100% authentic products guaranteed</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="font-bold text-slate-900">Customer Support</h3>
          <p className="mt-2 text-sm text-slate-600">24/7 customer service available</p>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
