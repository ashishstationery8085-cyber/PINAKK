'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authHeaders } from '../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      const response = await fetch(`${API_BASE}/orders`, { headers: authHeaders() });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setMessage(data.message || 'Unable to load orders. Please sign in.');
      }
      setLoading(false);
    };
    loadOrders();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Your Orders</h1>
        <p className="mt-2 text-slate-600">Track the status of your recent purchases and view order details.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">Loading order history...</div>
      ) : message ? (
        <div className="rounded-3xl bg-rose-50 p-8 text-slate-700 shadow-sm">{message}</div>
      ) : orders.length ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/orders/${order._id}`} className="text-sm uppercase tracking-[0.2em] text-primary hover:underline">Order #{order._id.slice(-8)}</Link>
                  <p className="mt-2 text-lg font-semibold text-slate-900">₹{order.total}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase text-slate-700">{order.status}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">Items</p>
                  <p className="mt-2 text-slate-900">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Payment</p>
                  <p className="mt-2 text-slate-900 capitalize">{order.payment?.method || 'Stripe'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Delivery</p>
                  <p className="mt-2 text-slate-900">{order.shippingDetails?.method || 'Standard'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">You don’t have any orders yet. Browse products to start shopping.</div>
      )}
    </div>
  );
};

export default OrdersPage;
