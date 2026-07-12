'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authHeaders } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const loadOrder = async () => {
      const response = await fetch(`${API_BASE}/orders/${id}`, { headers: authHeaders() });
      const data = await response.json();
      if (data.success) setOrder(data.order);
      setLoading(false);
    };
    loadOrder();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const loadTracking = async () => {
      const response = await fetch(`${API_BASE}/orders/${id}/track`, { headers: authHeaders() });
      const data = await response.json();
      if (data.success) setTracking(data.tracking);
    };
    loadTracking();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">Loading order details...</div>;
  if (!order) return <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">Order not found.</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Order #{order._id.slice(-8)}</h1>
          <p className="mt-2 text-slate-600">Details for your purchase and delivery status.</p>
        </div>
        <Link href="/orders" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Back to orders
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Status</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{order.status}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total</p>
              <p className="mt-2 text-xl font-semibold text-primary">₹{order.total}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Shipping</h2>
              <p className="mt-3 text-slate-600">{order.shippingDetails?.address?.line1}</p>
              <p className="text-slate-600">{order.shippingDetails?.address?.city}, {order.shippingDetails?.address?.postalCode}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-slate-500">Method</p>
              <p className="text-slate-700">{order.shippingDetails?.method}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Payment</h2>
              <p className="mt-3 text-slate-600">Method: {order.payment?.method || 'Stripe'}</p>
              <p className="text-slate-600">Provider: {order.payment?.provider}</p>
              <p className="text-slate-600">Transaction ID: {order.payment?.transactionId}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Items</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item: any) => (
                <div key={item._id || item.product} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.product?.name || 'Product'}</p>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-slate-900">₹{item.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Tracking</h2>
              <p className="mt-3 text-slate-600">Status: {tracking?.status || order.status}</p>
              <p className="text-slate-600">ETA: {tracking?.estimatedDelivery || '2-3 business days'}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
              <div className="mt-4 space-y-3 text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>₹{order.shipping}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
