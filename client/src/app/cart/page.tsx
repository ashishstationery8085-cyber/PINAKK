'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authHeaders } from '../../lib/auth';

const CartPage = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState<'home' | 'pickup'>('home');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const loadCart = async () => {
      try {
        const headers = authHeaders();
        const response = await fetch(`${API_BASE}/cart`, { headers: headers as HeadersInit });
        const data = await response.json();
        setCart(data.cart || { items: [] });
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + (item.total || item.price * item.quantity), 0) || 0;
  const shipping = deliveryOption === 'home' ? 49 : 0;
  const total = subtotal + shipping;

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">Loading cart...</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Your Cart</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="space-y-4">
          {/* Delivery Options */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Delivery Option</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeliveryOption('home')}
                className={`p-4 rounded-lg border-2 transition ${
                  deliveryOption === 'home'
                    ? 'border-secondary bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">🚚</div>
                <div className="font-semibold text-slate-900">Home Delivery</div>
                <div className="text-sm text-slate-600">₹49 shipping</div>
              </button>
              <button
                onClick={() => setDeliveryOption('pickup')}
                className={`p-4 rounded-lg border-2 transition ${
                  deliveryOption === 'pickup'
                    ? 'border-secondary bg-orange-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-3xl mb-2">🏪</div>
                <div className="font-semibold text-slate-900">Pickup at Store</div>
                <div className="text-sm text-slate-600">Free pickup</div>
              </button>
            </div>
          </div>

          {/* Cart Items */}
          {cart?.items?.length ? (
            cart.items.map((item: any) => (
              <div key={item._id || item.product} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.variant?.name || 'Standard'}</p>
                    <h2 className="text-xl font-semibold text-slate-900">{item.product?.name || 'Product title'}</h2>
                    <p className="mt-2 text-slate-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary">₹{item.total || item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              Your cart is empty. Add products to checkout faster.
            </div>
          )}
        </div>

        {/* Order Summary */}
        <aside className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Order Summary</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between text-slate-700">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Shipping ({deliveryOption === 'home' ? 'Home Delivery' : 'Store Pickup'})</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-slate-900 font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <Link
              href={`/checkout?delivery=${deliveryOption}`}
              className="w-full rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white text-center hover:bg-orange-600 block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
