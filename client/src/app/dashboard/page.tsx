'use client';

import { useEffect, useState } from 'react';
import { authHeaders } from '../../lib/auth';

const DashboardPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch(`${API_BASE}/auth/profile`, { headers: authHeaders() });
      const data = await response.json();
      setProfile(data.user || null);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">Loading your dashboard...</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {profile?.name || 'PINAKK Shopper'}</h1>
        <p className="mt-3 text-slate-600">Track orders, manage your wishlist, and view wallet balance.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Wallet</p>
            <p className="mt-4 text-3xl font-semibold text-primary">₹{profile?.walletBalance ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Orders</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">12</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Wishlist</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">5</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Referral</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{profile?.referralCode || 'PIN000'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
