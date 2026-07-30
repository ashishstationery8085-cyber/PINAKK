import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">Privacy policy</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Your privacy matters to us.</h1>
          <p className="mt-4 text-lg text-slate-600">We use your data only to provide secure, reliable shopping and account services.</p>
        </div>
        <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-sm leading-8 text-slate-600">
          <p>PINAKK collects account details, order details, and payment information necessary to process requests and improve the user experience. This data is protected and used only for service delivery, fraud prevention, customer support, and analytics. We never sell personal information to third parties for marketing purposes.</p>
          <p className="mt-4">If you have questions about your personal data, reach out through our support channels and we will be happy to help.</p>
        </div>
        <div className="mt-10 rounded-[1.5rem] bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Questions about privacy?</h2>
          <Link href="/support" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
