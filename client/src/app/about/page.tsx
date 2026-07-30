import Link from 'next/link';
import { FiTruck, FiShield, FiStar, FiGift } from 'react-icons/fi';

const highlights = [
  { title: 'Premium quality', description: 'Curated products from trusted stationery and office brands.', icon: FiGift },
  { title: 'Fast delivery', description: 'Reliable shipping across India for everyday essentials and bulk order needs.', icon: FiTruck },
  { title: 'Secure shopping', description: 'Protected payments and easy returns for a stress-free experience.', icon: FiShield },
  { title: 'Loved by customers', description: 'Consistently high ratings from students, professionals, and growing businesses.', icon: FiStar },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">About PINAKK</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">A premium marketplace built for learning, working, and growing.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            PINAKK brings together premium stationery, office essentials, art supplies, and everyday lifestyle products under one modern storefront. We focus on quality, clarity, and convenience for students, professionals, and business buyers alike.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <Icon className="text-2xl text-secondary" />
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 rounded-[1.5rem] bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Why customers choose us</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            We deliver a polished shopping experience with curated collections, dependable support, and a fast path from discovery to checkout.
          </p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Explore products
          </Link>
        </div>
      </div>
    </div>
  );
}
