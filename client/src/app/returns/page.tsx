import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">Return policy</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Simple and fair returns for your peace of mind.</h1>
          <p className="mt-4 text-lg text-slate-600">Eligible items can be returned within the specified window if they are unused, unopened, and in their original condition.</p>
        </div>
        <div className="mt-10 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-xl font-semibold text-slate-900">How returns work</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <li>• Contact support within the return window to request a return or replacement.</li>
            <li>• Keep the item in original packaging and include proof of purchase where requested.</li>
            <li>• Once approved, we will arrange pickup or provide the next steps.</li>
          </ul>
        </div>
        <div className="mt-10 rounded-[1.5rem] bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Need help with a return?</h2>
          <p className="mt-3 text-slate-300">Our support team can guide you through the process quickly and clearly.</p>
          <Link href="/support" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
