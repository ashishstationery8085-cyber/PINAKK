import Link from 'next/link';
import { FiHeadphones, FiMail, FiPhone, FiClock, FiMapPin } from 'react-icons/fi';

const supportOptions = [
  { title: 'Live Chat', description: 'Connect with our support team in real time for order and product help.', icon: FiHeadphones },
  { title: 'Email Support', description: 'Share product questions or account issues and we’ll reply promptly.', icon: FiMail },
  { title: 'Call Us', description: 'Speak with our team for urgent queries and delivery updates.', icon: FiPhone },
  { title: 'Hours', description: 'We are available Monday to Saturday from 10 AM to 8 PM.', icon: FiClock },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">Support Center</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">We’re here to help with every step of your purchase.</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              From order tracking to product recommendations, our support team is ready to guide you.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {supportOptions.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <Icon className="text-2xl text-secondary" />
                    <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-semibold">Contact PINAKK</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <FiMapPin className="mt-1 text-secondary" />
                <span>Ashish Stationary & Photocopy, Rehti, Sehore, MP 466446</span>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 text-secondary" />
                <a href="tel:+918085212103" className="hover:text-white">+91 80852 12103</a>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="mt-1 text-secondary" />
                <a href="mailto:support@pinakk.com" className="hover:text-white">support@pinakk.com</a>
              </div>
            </div>
            <Link href="/faq" className="mt-8 inline-flex rounded-full bg-secondary px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
              Read FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
