'use client';

import { useEffect, useState } from 'react';
import { authHeaders } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetch(`${API_BASE}/admin/products`, { headers: authHeaders() });
      const data = await response.json();
      setProducts(data.products || []);
      setLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Product management</h1>
      <p className="mt-3 text-slate-600">Review inventory, pricing, and product status across categories.</p>
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">Loading products...</td>
              </tr>
            ) : products.length ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 text-sm text-slate-700">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{product.category?.name || 'General'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">₹{product.price}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 capitalize">{product.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
