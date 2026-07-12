'use client';

import { useEffect, useState } from 'react';
import { authHeaders } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() });
      const data = await response.json();
      setOrders(data.orders || []);
      setLoading(false);
    };
    loadOrders();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Order management</h1>
      <p className="mt-3 text-slate-600">Monitor new orders, shipping status, cancellations, and returns.</p>
      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">Loading orders...</td>
              </tr>
            ) : orders.length ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 text-sm text-slate-700">{order._id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{order.user?.name || 'Guest'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">₹{order.total}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 capitalize">{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-sm text-slate-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
