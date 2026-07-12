'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    setMessage(data.message || 'Please check your email.');
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Forgot your password?</h1>
        <p className="mt-3 text-slate-600">Enter your email and we’ll send a secure password reset link.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full rounded-3xl bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-blue-900">
            Send reset link
          </button>
          {message && <p className="text-center text-sm text-slate-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
