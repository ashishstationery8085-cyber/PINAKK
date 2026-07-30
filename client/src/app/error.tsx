'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
        Something went wrong
      </div>
      <h2 className="text-3xl font-bold text-slate-900">We hit a snag while loading this page.</h2>
      <p className="mt-3 text-slate-600">
        Please try again. If the issue persists, contact our support team for assistance.
      </p>
      <button onClick={() => reset()} className="mt-6 rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
        Try again
      </button>
    </div>
  );
}
