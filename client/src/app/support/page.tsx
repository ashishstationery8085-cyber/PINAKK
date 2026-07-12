import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="grid gap-10 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-soft sm:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Customer support</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Help is just a message away</h1>
          <p className="mt-4 text-slate-600">Need assistance with orders, returns, or your account? Our support team is ready to assist you 24/7.</p>
          <div className="mt-8 space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-semibold text-slate-900">Email</p>
              <p>support@pinakk.com</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Phone</p>
              <p>+91 98765 43210</p>
            </div>
          </div>
          <Link href="/products" className="mt-8 inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-secondary/20 transition hover:bg-orange-600">
            Browse products
          </Link>
        </div>
        <div className="rounded-[1.75rem] bg-slate-950 p-8 text-white">
          <h2 className="text-2xl font-semibold">Live support</h2>
          <p className="mt-4 text-slate-300">For order updates, returns, and vendor inquiries, we’re ready to help fast.</p>
          <ul className="mt-8 space-y-4 text-sm text-slate-300">
            <li>• Order status tracking</li>
            <li>• Shipping and delivery help</li>
            <li>• Return and refund support</li>
            <li>• Vendor partnership questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
