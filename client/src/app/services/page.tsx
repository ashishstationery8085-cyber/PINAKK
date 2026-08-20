'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const categories = [
  { name: 'Stationery', icon: '📝', color: 'bg-blue-100', slug: 'stationery' },
  { name: 'Paper Products', icon: '📄', color: 'bg-slate-100', slug: 'paper' },
  { name: 'Office Supplies', icon: '📊', color: 'bg-green-100', slug: 'office' },
  { name: 'Gift Items', icon: '🎁', color: 'bg-pink-100', slug: 'gifts' },
  { name: 'Perfumes', icon: '🧴', color: 'bg-purple-100', slug: 'perfumes' },
  { name: 'Belts', icon: '🎗️', color: 'bg-amber-100', slug: 'belts' },
  { name: 'General Store', icon: '🏪', color: 'bg-orange-100', slug: 'general' },
  { name: 'Accessories', icon: '👜', color: 'bg-teal-100', slug: 'accessories' },
];

const ServicesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProductsByCategory = async (category: string) => {
    setLoading(true);
    try {
      const url = category 
        ? `${API_BASE}/products?category=${encodeURIComponent(category)}`
        : `${API_BASE}/products`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      fetchProductsByCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    router.push(`/services?category=${encodeURIComponent(category)}`);
  };

  const handleShowAll = () => {
    setSelectedCategory('');
    router.push('/services');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Our Services & Categories</h1>
        <p className="mt-2 text-slate-600">Browse through our wide range of products by category</p>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Select Category</h2>
          {selectedCategory && (
            <button onClick={handleShowAll} className="text-secondary font-semibold hover:underline">
              Show All Categories
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`bg-white rounded-xl overflow-hidden hover:shadow-lg transition border-2 ${
                selectedCategory === cat.name ? 'border-secondary' : 'border-slate-200'
              } group`}
            >
              <div className={`${cat.color} h-24 flex items-center justify-center group-hover:scale-105 transition`}>
                <span className="text-5xl">{cat.icon}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-slate-900 text-center">{cat.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">{selectedCategory} Products</h2>
            <Link href="/products" className="text-secondary font-semibold hover:underline">View All Products →</Link>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-xl bg-slate-100" />
              ))
            ) : products.length ? (
              products.map((product) => (
                <div key={product._id || product.id}>
                  <ProductCard product={{ id: product._id || product.id, name: product.name, price: product.price || 0, category: product.category?.name || product.category || selectedCategory, oldPrice: product.oldPrice, discount: product.discount }} />
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-xl bg-white p-12 text-center text-slate-500 shadow-sm">
                No products found in {selectedCategory}. Try another category.
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedCategory && (
        <div className="rounded-xl bg-white p-12 text-center text-slate-500 shadow-sm">
          <p className="text-lg">Select a category above to view products</p>
          <p className="mt-2 text-sm">Or browse all products on our <Link href="/products" className="text-secondary font-semibold hover:underline">Products page</Link></p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
