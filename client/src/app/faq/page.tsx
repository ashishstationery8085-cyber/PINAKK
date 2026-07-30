import Link from 'next/link';

const faqs = [
  { question: 'How do I place an order?', answer: 'Browse products, add them to your cart, and proceed to checkout with your preferred shipping and payment method.' },
  { question: 'Do you offer returns?', answer: 'Yes. Eligible items can be returned within the stated return window for a refund or replacement.' },
  { question: 'How long does delivery take?', answer: 'Most orders are delivered within 3 to 7 business days depending on the location and product type.' },
  { question: 'Can I bulk order for school or office?', answer: 'Absolutely. PINAKK supports bulk orders and can help with business, school, and office supply requirements.' },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-sm lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">Frequently asked questions</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">Everything you need to know before you shop.</h1>
          <p className="mt-4 text-lg text-slate-600">Browse the most common questions about orders, delivery, returns, and account support.</p>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">{faq.question}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-[1.5rem] bg-slate-900 p-8 text-white">
          <h2 className="text-2xl font-semibold">Still need help?</h2>
          <p className="mt-3 text-slate-300">Our support team is ready to answer your questions quickly and clearly.</p>
          <Link href="/support" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
