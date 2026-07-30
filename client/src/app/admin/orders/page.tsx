'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authHeaders, getAuthToken } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFilter, FiEye, FiEdit, FiTruck, FiCheckCircle, FiXCircle, FiRefreshCw, FiDownload, FiArrowRight } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AdminOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/admin/orders`, { headers: requestHeaders });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        loadOrders();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'returned': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus;
    const matchesSearch = searchQuery === '' || 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">
              <FiArrowRight className="rotate-180" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">
              <FiDownload /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterStatus === status 
                      ? 'bg-secondary text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by ID, customer name, email..."
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary w-full lg:w-80"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading orders...</div>
          ) : filteredOrders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Payment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order._id}`} className="text-secondary font-medium hover:underline">
                          #{order._id.slice(-8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{order.user?.name || 'Guest'}</p>
                          <p className="text-sm text-slate-600">{order.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{order.items?.length || 0}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">₹{order.total}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700 capitalize">{order.payment?.method || 'Card'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            title="View Details"
                          >
                            <FiEye />
                          </Link>
                          {order.status === 'processing' && (
                            <button
                              onClick={() => updateOrderStatus(order._id, 'shipped')}
                              className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                              title="Mark as Shipped"
                            >
                              <FiTruck />
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              className="p-2 rounded-lg hover:bg-green-100 text-green-600"
                              title="Mark as Delivered"
                            >
                              <FiCheckCircle />
                            </button>
                          )}
                          {(order.status === 'processing' || order.status === 'pending') && (
                            <button
                              onClick={() => updateOrderStatus(order._id, 'cancelled')}
                              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                              title="Cancel Order"
                            >
                              <FiXCircle />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              No orders found matching your filters
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
