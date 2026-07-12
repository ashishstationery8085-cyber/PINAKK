'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const ProductsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    const url = query ? `${API_BASE}/search?q=${encodeURIComponent(query)}` : `${API_BASE}/products`;
    const response = await fetch(url);
    const data = await response.json();
    setProducts(data.products || data.suggestions || []);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    const destination = query?.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : '/products';
    router.push(destination);
  };

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Shop Products</h1>
            <p className="mt-2 text-slate-600">Search and filter across stationery, fashion, gifts, and everyday essentials.</p>
          </div>
          <div className="w-full sm:w-[420px]">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        {searchQuery ? (
          <p className="mt-6 text-sm text-slate-500">
            Showing results for <span className="font-semibold text-slate-900">{searchQuery}</span>
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-60 animate-pulse rounded-3xl bg-slate-100" />
          ))
        ) : products.length ? (
          products.map((product) => (
            <div key={product._id || product.id}>
              <ProductCard
                product={{
                  id: product._id || product.id,
                  name: product.name,
                  price: product.price || 0,
                  category: product.category?.name || product.category || 'General',
                  oldPrice: product.oldPrice,
                  discount: product.discount,
                }}
              />
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">
            No products found. Try another search or category.
          </div>
        )}
      </div>

      <div className="mt-10 text-center text-sm text-slate-500">
        <Link href="/auth/register" className="font-semibold text-primary underline">
          Create an account
        </Link>{' '}
        and enjoy fast checkout, wishlists, and loyalty rewards.
      </div>
    </div>
  );
};

const ProductsPage = () => (
  <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">Loading products...</div>}>
    <ProductsPageContent />
  </Suspense>
);

export default ProductsPage;
