import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">Shipping policy</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Fast and transparent delivery for every order.</h1>
          <p className="mt-4 text-lg text-slate-600">
            We aim to dispatch orders quickly and keep you informed at each stage of the delivery journey.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Standard delivery</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">3 to 7 business days for most domestic orders.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Express delivery</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Available for selected regions and urgent requirements.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Bulk orders</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">Special handling and consolidated delivery for school and office needs.</p>
          </div>
        </div>
        <div className="mt-10 rounded-[1.5rem] bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Need help with a shipment?</h2>
          <p className="mt-3 text-slate-300">Reach out to our support team anytime for tracking and update requests.</p>
          <Link href="/support" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
