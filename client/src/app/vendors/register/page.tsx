'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const VendorRegisterPage = () => {
  const [storeName, setStoreName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`${API_BASE}/vendors/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeName, userId: 'replace-user-id' }),
    });
    const data = await response.json();
    setMessage(data.success ? 'Vendor registration submitted.' : data.message || 'Registration failed.');
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Vendor registration</h1>
        <p className="mt-3 text-slate-600">Sign up to sell your products on PINAKK and reach millions of shoppers.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Store name</label>
            <input
              value={storeName}
              onChange={(event) => setStoreName(event.target.value)}
              placeholder="My PINAKK Store"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full rounded-3xl bg-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-900">
            Register as vendor
          </button>
          {message && <p className="text-center text-sm text-slate-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
