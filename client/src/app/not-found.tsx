'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 rounded-full bg-orange-100 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
        404 • Page not found
      </div>
      <h1 className="text-4xl font-bold text-slate-900">The page you’re looking for is unavailable.</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        It may have moved, been removed, or the URL might be incorrect. You can return home or browse our catalog.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
          Back to home
        </Link>
        <Link href="/products" className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-400">
          Browse products
        </Link>
      </div>
    </div>
  );
}
