'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authHeaders, getAuthToken } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiRefreshCw, FiArrowRight, FiFilter, FiSearch } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      const response = await fetch(`${API_BASE}/orders`, { headers: requestHeaders });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setMessage(data.message || 'Unable to load orders. Please sign in.');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setMessage('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: requestHeaders,
      });
      const data = await response.json();
      if (data.success) {
        loadOrders();
      } else {
        setMessage(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      setMessage('Error cancelling order');
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return FiCheckCircle;
      case 'shipped': return FiTruck;
      case 'processing': return FiPackage;
      case 'cancelled': return FiXCircle;
      case 'returned': return FiRefreshCw;
      default: return FiPackage;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus;
    const matchesSearch = searchQuery === '' || 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some((item: any) => item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="mt-2 text-slate-600">Track, manage, and view your order history</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['all', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === status 
                  ? 'bg-secondary text-white' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
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
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-12 text-center text-slate-500 shadow-sm">Loading orders...</div>
      ) : message ? (
        <div className="rounded-xl bg-red-50 p-8 text-slate-700 shadow-sm">{message}</div>
      ) : filteredOrders.length ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div key={order._id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/orders/${order._id}`} className="text-sm font-semibold text-secondary hover:underline">
                        Order #{order._id.slice(-8)}
                      </Link>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        <StatusIcon className="inline mr-1" />
                        {order.status || 'Processing'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="text-slate-700">
                        <strong>{order.items?.length || 0}</strong> items
                      </span>
                      <span className="text-slate-700">
                        Total: <strong>₹{order.total}</strong>
                      </span>
                      <span className="text-slate-700 capitalize">
                        {order.payment?.method || 'Card'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 transition text-sm font-medium"
                    >
                      View Details <FiArrowRight />
                    </Link>
                    {(order.status === 'processing' || order.status === 'pending') && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex gap-3 overflow-x-auto">
                    {order.items?.slice(0, 4).map((item: any, idx: number) => (
                      <div key={idx} className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                        📦
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-medium text-slate-600">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <FiPackage className="mx-auto text-4xl text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">
            {searchQuery || filterStatus !== 'all' ? 'No orders match your filters' : "You don't have any orders yet"}
          </p>
          <Link href="/products" className="inline-flex bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
