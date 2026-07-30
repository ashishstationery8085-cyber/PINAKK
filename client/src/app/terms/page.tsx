import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">Terms of use</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Please review these terms before using our marketplace.</h1>
          <p className="mt-4 text-lg text-slate-600">By using PINAKK, you agree to use our services honestly, lawfully, and respectfully.</p>
        </div>
        <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-sm leading-8 text-slate-600">
          <p>PINAKK provides an online platform for browsing and purchasing products. Users are responsible for providing accurate account information, honoring orders, and following all relevant laws and platform policies. Product availability, pricing, and promotions may change without prior notice.</p>
          <p className="mt-4">All content, branding, and intellectual property associated with the PINAKK experience remain the property of the platform unless stated otherwise. For detailed support or concerns, contact our support team.</p>
        </div>
        <div className="mt-10 rounded-[1.5rem] bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Questions about our policies?</h2>
          <Link href="/support" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
