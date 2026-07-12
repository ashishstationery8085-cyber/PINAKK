'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const VendorProductCreatePage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        name,
        description,
        category,
        price: Number(price),
        stock: Number(stock),
        status: 'active',
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (data.success) {
      setMessage('Product created successfully.');
      router.push('/vendors/products');
    } else {
      setMessage(data.message || 'Unable to create product.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Add new product</h1>
        <p className="mt-3 text-slate-600">Create a product listing for your PINAKK vendor store.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Product name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                placeholder="Product title"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Category</span>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                placeholder="Category"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={4}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
              placeholder="Describe the product features"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Price (₹)</span>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                placeholder="0"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Stock</span>
              <input
                type="number"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary"
                placeholder="Inventory count"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-3xl bg-secondary px-6 py-4 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create product'}
          </button>
          {message && <p className="text-sm text-primary">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VendorProductCreatePage;
