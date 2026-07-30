'use client';

import { useEffect, useState } from 'react';
import { FiCopy, FiCheck, FiCalendar, FiTag } from 'react-icons/fi';

const coupons = [
  {
    id: 'WELCOME10',
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    minOrder: 299,
    maxDiscount: 100,
    description: 'Get 10% off on your first order',
    expiry: '2024-12-31',
    applicable: 'All products',
    used: false
  },
  {
    id: 'FLAT50',
    code: 'FLAT50',
    discount: 50,
    type: 'flat',
    minOrder: 499,
    maxDiscount: 50,
    description: 'Flat ₹50 off on orders above ₹499',
    expiry: '2024-12-31',
    applicable: 'All products',
    used: false
  },
  {
    id: 'STATIONERY20',
    code: 'STATIONERY20',
    discount: 20,
    type: 'percentage',
    minOrder: 599,
    maxDiscount: 200,
    description: '20% off on stationery items',
    expiry: '2024-12-31',
    applicable: 'Stationery category',
    used: false
  },
  {
    id: 'BULK100',
    code: 'BULK100',
    discount: 100,
    type: 'flat',
    minOrder: 999,
    maxDiscount: 100,
    description: 'Flat ₹100 off on bulk orders',
    expiry: '2024-12-31',
    applicable: 'Orders above ₹999',
    used: false
  },
  {
    id: 'FIRSTORDER',
    code: 'FIRSTORDER',
    discount: 15,
    type: 'percentage',
    minOrder: 399,
    maxDiscount: 150,
    description: '15% off for first-time users',
    expiry: '2024-12-31',
    applicable: 'New users only',
    used: true
  }
];

export default function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (expiry: string) => {
    return new Date(expiry) < new Date();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Coupons</h1>
        <p className="mt-2 text-slate-600">Apply these coupons at checkout to get discounts on your orders</p>
      </div>

      {/* Available Coupons */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Available Coupons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.filter(c => !c.used && !isExpired(c.expiry)).map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-xl border-2 border-dashed border-secondary p-6 relative overflow-hidden">
              {/* Discount Badge */}
              <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-2 rounded-bl-xl font-bold">
                {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
              </div>

              {/* Coupon Code */}
              <div className="mb-4">
                <p className="text-sm text-slate-500 mb-1">Coupon Code</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-wider">{coupon.code}</span>
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                    title="Copy code"
                  >
                    {copiedCode === coupon.code ? (
                      <FiCheck className="text-green-600" />
                    ) : (
                      <FiCopy className="text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 mb-4">{coupon.description}</p>

              {/* Details */}
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <FiTag />
                  <span>Min. Order: ₹{coupon.minOrder}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar />
                  <span>Expires: {new Date(coupon.expiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>Applicable: {coupon.applicable}</span>
                </div>
                {coupon.maxDiscount && (
                  <div className="flex items-center gap-2">
                    <span>•</span>
                    <span>Max. Discount: ₹{coupon.maxDiscount}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Used Coupons */}
      {coupons.some(c => c.used) && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Used Coupons</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.filter(c => c.used).map((coupon) => (
              <div key={coupon.id} className="bg-slate-50 rounded-xl border border-slate-200 p-6 relative opacity-60">
                <div className="absolute top-4 right-4 bg-slate-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Used
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-1">Coupon Code</p>
                  <span className="text-2xl font-bold text-slate-900 tracking-wider line-through">{coupon.code}</span>
                </div>
                <p className="text-slate-600">{coupon.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expired Coupons */}
      {coupons.some(c => isExpired(c.expiry) && !c.used) && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Expired Coupons</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.filter(c => isExpired(c.expiry) && !c.used).map((coupon) => (
              <div key={coupon.id} className="bg-slate-50 rounded-xl border border-slate-200 p-6 relative opacity-60">
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Expired
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-1">Coupon Code</p>
                  <span className="text-2xl font-bold text-slate-900 tracking-wider line-through">{coupon.code}</span>
                </div>
                <p className="text-slate-600">{coupon.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Use */}
      <div className="mt-12 rounded-xl bg-blue-50 p-6 border border-blue-200">
        <h3 className="font-semibold text-slate-900 mb-4">How to Apply Coupons</h3>
        <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
          <li>Add items to your cart</li>
          <li>Proceed to checkout</li>
          <li>Enter the coupon code in the "Apply Coupon" section</li>
          <li>Click "Apply" to see the discount reflected in your total</li>
          <li>Complete your payment with the discounted amount</li>
        </ol>
        <p className="mt-4 text-xs text-slate-500">
          Note: Coupons cannot be combined with other offers. Each coupon can be used only once per order.
        </p>
      </div>
    </div>
  );
}
