'use client';

import { useEffect, useState } from 'react';
import { authHeaders } from '../../lib/auth';

const AdminPage = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await fetch(`${API_BASE}/admin/dashboard`, { headers: authHeaders() });
      const data = await response.json();
      setMetrics(data.dashboard || null);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">Loading admin dashboard...</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-3 text-slate-600">Monitor sales, inventory, and customer behavior in one place.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total Orders</p>
            <p className="mt-4 text-3xl font-semibold text-primary">{metrics?.totalOrders ?? '—'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Revenue</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">₹{metrics?.totalRevenue ?? '—'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Products</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{metrics?.totalProducts ?? '—'}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Customers</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{metrics?.totalCustomers ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
