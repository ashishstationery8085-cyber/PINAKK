'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

export default function ComparePage() {
  const [compareList, setCompareList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompareList();
  }, []);

  const loadCompareList = () => {
    const stored = localStorage.getItem('pinakk_compare');
    if (stored) {
      setCompareList(JSON.parse(stored));
    }
    setLoading(false);
  };

  const removeFromCompare = (productId: string) => {
    const updated = compareList.filter((item) => item._id !== productId);
    setCompareList(updated);
    localStorage.setItem('pinakk_compare', JSON.stringify(updated));
  };

  const clearAll = () => {
    setCompareList([]);
    localStorage.removeItem('pinakk_compare');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center text-slate-500">Loading compare list...</div>
      </div>
    );
  }

  if (compareList.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8">
          <FiArrowLeft /> Continue Shopping
        </Link>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No products to compare</h2>
          <p className="text-slate-600 mb-6">Add products to compare them side by side.</p>
          <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const attributes = [
    { key: 'price', label: 'Price', format: (val: any) => `₹${val}` },
    { key: 'category', label: 'Category', format: (val: any) => val },
    { key: 'brand', label: 'Brand', format: (val: any) => val || 'N/A' },
    { key: 'stock', label: 'Stock', format: (val: any) => val > 0 ? `${val} available` : 'Out of Stock' },
    { key: 'rating', label: 'Rating', format: (val: any) => val ? `${val}/5` : 'N/A' },
    { key: 'description', label: 'Description', format: (val: any) => val?.substring(0, 100) + '...' || 'N/A' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-2">
            <FiArrowLeft /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Compare Products</h1>
          <p className="text-slate-600">{compareList.length} products selected</p>
        </div>
        <button
          onClick={clearAll}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
        >
          <FiTrash2 /> Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left font-semibold text-slate-900 bg-slate-50 min-w-[200px]">Feature</th>
              {compareList.map((product) => (
                <th key={product._id} className="p-4 text-center bg-slate-50 min-w-[250px]">
                  <button
                    onClick={() => removeFromCompare(product._id)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                  <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-5xl mb-3">
                    {product.image?.[0] ? (
                      <img src={product.image[0]} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                  <Link href={`/products/${product._id}`} className="font-semibold text-slate-900 hover:text-primary block">
                    {product.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr) => (
              <tr key={attr.key} className="border-t border-slate-200">
                <td className="p-4 font-semibold text-slate-900 bg-slate-50">{attr.label}</td>
                {compareList.map((product) => (
                  <td key={product._id} className="p-4 text-center">
                    {attr.key === 'stock' ? (
                      product[attr.key] > 0 ? (
                        <span className="flex items-center justify-center gap-2 text-green-600">
                          <FiCheck /> {attr.format(product[attr.key])}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2 text-red-600">
                          <FiX /> Out of Stock
                        </span>
                      )
                    ) : (
                      <span className="text-slate-700">{attr.format(product[attr.key])}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-slate-200">
              <td className="p-4 font-semibold text-slate-900 bg-slate-50">Action</td>
              {compareList.map((product) => (
                <td key={product._id} className="p-4 text-center">
                  <Link
                    href={`/products/${product._id}`}
                    className="inline-flex items-center justify-center rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
