'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import SearchBar from '../../../components/SearchBar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  // Category slugs to display names mapping
  const categoryNames: Record<string, string> = {
    stationery: 'Stationery',
    paper: 'Paper Products',
    office: 'Office Supplies',
    gifts: 'Gift Items',
    perfumes: 'Perfumes',
    accessories: 'Accessories',
    belts: 'Belts',
    general: 'General Store',
  };

  const categoryDescriptions: Record<string, string> = {
    stationery: 'Premium stationery items for students, professionals, and office use.',
    paper: 'High-quality paper products including notebooks, notepads, and printing paper.',
    office: 'Essential office supplies and organizational tools for your workspace.',
    gifts: 'Unique and thoughtful gift items for every occasion.',
    perfumes: 'Premium fragrances and perfumes from leading brands.',
    accessories: 'Fashion and lifestyle accessories to complement your style.',
    belts: 'Stylish belts in various materials and designs.',
    general: 'General store items and everyday essentials.',
  };

  useEffect(() => {
    if (!slug) return;

    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const categorySlug = Array.isArray(slug) ? slug[0] : slug;
        
        // Fetch products filtered by category
        const response = await fetch(`${API_BASE}/products?category=${categorySlug}`);
        const data = await response.json();
        
        setProducts(data.products || []);
        setCategory({
          name: categoryNames[categorySlug] || categorySlug,
          description: categoryDescriptions[categorySlug] || `Browse our ${categorySlug} collection`,
          slug: categorySlug,
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  const handleSearch = (query: string) => {
    const destination = query?.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : '/products';
    router.push(destination);
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
      default:
        return sorted;
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 rounded-3xl bg-slate-200" />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-60 rounded-3xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">{category?.name}</h1>
            <p className="mt-2 text-slate-600">{category?.description}</p>
            <p className="mt-1 text-sm text-slate-500">
              {products.length} {products.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
          <div className="w-full sm:w-[420px]">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing {Math.min(products.length, 12)} of {products.length} items
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {getSortedProducts().map((product) => (
            <div key={product._id || product.id}>
              <ProductCard
                product={{
                  id: product._id || product.id,
                  name: product.name,
                  price: product.price || 0,
                  category: product.category?.name || category?.name || 'General',
                  oldPrice: product.oldPrice,
                  discount: product.discount,
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-slate-900">No products found</h2>
          <p className="mt-2 text-slate-600">This category is currently empty. Check back soon!</p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 text-white transition hover:bg-orange-600">
            Browse all products
          </Link>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white text-center">
        <h2 className="text-2xl font-bold">Don't see what you're looking for?</h2>
        <p className="mt-2 text-slate-300">Use our search feature to find specific products or explore other categories.</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Search Products
          </Link>
          <Link href="/" className="rounded-full border-2 border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-slate-900">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
