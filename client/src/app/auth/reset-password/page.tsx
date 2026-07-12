'use client';

import type { FormEvent } from 'react';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const ResetPasswordPageContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await response.json();
    setMessage(data.message || 'Your password has been reset.');
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-16 lg:px-8">
      <div className="rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Reset your password</h1>
        <p className="mt-3 text-slate-600">Set a new password for your PINAKK account.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">New password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full rounded-3xl bg-secondary px-6 py-3 text-base font-semibold text-white hover:bg-orange-600">
            Reset password
          </button>
          {message && <p className="text-center text-sm text-slate-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => (
  <Suspense fallback={<div className="mx-auto max-w-xl px-6 py-16 lg:px-8">Loading reset password form...</div>}>
    <ResetPasswordPageContent />
  </Suspense>
);

export default ResetPasswordPage;
