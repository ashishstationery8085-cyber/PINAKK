import Link from 'next/link';

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Your wishlist</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Save favorites for later</h1>
          <p className="mt-4 text-slate-600">Add products to your wishlist and return anytime to complete the purchase. Sign in to sync across devices.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/auth/login" className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-secondary/20 transition hover:bg-orange-600">
              Sign in
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
