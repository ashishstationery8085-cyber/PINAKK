'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authHeaders, getAuthToken } from '../../lib/auth';
import { FiHome, FiShoppingBag, FiPackage, FiUsers, FiSettings, FiTrendingUp, FiDollarSign, FiEye, FiClock, FiArrowRight, FiLogOut, FiBarChart, FiGrid } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const AdminPage = () => {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      
      const [dashboardRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, { headers: requestHeaders }),
        fetch(`${API_BASE}/admin/orders?limit=5`, { headers: requestHeaders }),
      ]);

      const dashboardData = await dashboardRes.json();
      const ordersData = await ordersRes.json();

      setMetrics(dashboardData.dashboard || null);
      setRecentOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('pinakk_token');
    router.push('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: FiHome },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'categories', label: 'Categories', icon: FiGrid },
    { id: 'users', label: 'Customers', icon: FiUsers },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading admin dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">PINAKK Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-slate-600 hover:text-slate-900 text-sm">
              View Site
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <nav className="bg-white rounded-xl shadow-sm overflow-hidden">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.id === 'overview' ? '/admin' : `/admin/${item.id}`}
                  className={`flex items-center gap-3 px-4 py-3 transition ${
                    activeTab === item.id || (item.id === 'overview' && !activeTab)
                      ? 'bg-orange-50 text-secondary border-l-4 border-secondary'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Today's Orders</span>
                  <span className="font-medium">{metrics?.todayOrders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Today's Revenue</span>
                  <span className="font-medium">₹{metrics?.todayRevenue || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pending Orders</span>
                  <span className="font-medium">{metrics?.pendingOrders || 0}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {/* Metrics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metrics?.totalOrders || 0}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FiTrendingUp /> +12.5%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-secondary">
                    <FiShoppingBag />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Revenue</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">₹{metrics?.totalRevenue || 0}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FiTrendingUp /> +8.2%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <FiDollarSign />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Products</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metrics?.totalProducts || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Active listings</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FiPackage />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Customers</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metrics?.totalCustomers || 0}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FiTrendingUp /> +5.1%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <FiUsers />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                <Link href="/admin/orders" className="text-secondary text-sm font-medium hover:underline flex items-center gap-1">
                  View All <FiArrowRight />
                </Link>
              </div>
              
              {recentOrders.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order: any) => (
                        <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <Link href={`/admin/orders/${order._id}`} className="text-secondary font-medium hover:underline">
                              #{order._id.slice(-8)}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{order.user?.name || 'Guest'}</td>
                          <td className="py-3 px-4 font-medium text-slate-900">₹{order.total}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">No recent orders</div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/products/new" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center text-white">
                    <FiPackage />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Add Product</p>
                    <p className="text-xs text-slate-600">Create new listing</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/orders" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    <FiShoppingBag />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Manage Orders</p>
                    <p className="text-xs text-slate-600">View all orders</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/users" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                    <FiUsers />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">View Customers</p>
                    <p className="text-xs text-slate-600">Manage users</p>
                  </div>
                </div>
              </Link>

              <Link href="/admin/analytics" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                    <FiBarChart />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">View Analytics</p>
                    <p className="text-xs text-slate-600">Sales reports</p>
                  </div>
                </div>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
