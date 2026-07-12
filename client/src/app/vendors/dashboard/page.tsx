'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authHeaders } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const VendorDashboardPage = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      const response = await fetch(`${API_BASE}/vendors/dashboard`, { headers: authHeaders() });
      const data = await response.json();
      setVendor(data.vendor || null);
      setLoading(false);
    };
    loadVendor();
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">Loading vendor dashboard...</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="rounded-[2rem] bg-white p-10 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Vendor dashboard</h1>
            <p className="mt-3 text-slate-600">Manage your PINAKK store, track earnings, and view orders.</p>
          </div>
          <Link href="/vendors/products/new" className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-secondary/20 transition hover:bg-orange-600">
            Add new product
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Store</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{vendor?.storeName || 'My Store'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Verified</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{vendor?.verified ? 'Yes' : 'Pending'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Earnings</p>
            <p className="mt-4 text-2xl font-semibold text-primary">₹{vendor?.totalEarnings ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Products</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{vendor?.products?.length ?? 0}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              <li>• Manage listings and inventory</li>
              <li>• Review recent orders</li>
              <li>• Update store profile</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Top performance</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{vendor?.topProduct?.name || 'No top product yet'}</p>
            <p className="mt-3 text-sm text-slate-600">{vendor?.topProduct?.sales ? `${vendor.topProduct.sales} sales this month` : 'Start listing products to track performance.'}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Store status</p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{vendor?.status || 'Active'}</p>
            <p className="mt-3 text-sm text-slate-600">{vendor?.statusMessage || 'Your vendor account is ready to sell.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
