'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authHeaders, clearAuthToken, getAuthToken } from '../../lib/auth';
import { FiUser, FiMapPin, FiHeart, FiShoppingBag, FiDownload, FiBell, FiCreditCard, FiAward, FiTag, FiFileText, FiLogOut, FiSettings, FiChevronRight } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const DashboardPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      
      const [profileRes, ordersRes, wishlistRes] = await Promise.all([
        fetch(`${API_BASE}/auth/profile`, { headers: requestHeaders }),
        fetch(`${API_BASE}/orders`, { headers: requestHeaders }),
        fetch(`${API_BASE}/wishlist`, { headers: requestHeaders }),
      ]);

      const profileData = await profileRes.json();
      const ordersData = await ordersRes.json();
      const wishlistData = await wishlistRes.json();

      setProfile(profileData.user || null);
      setOrders(ordersData.orders || []);
      setWishlist(wishlistData.wishlist || []);
      setAddresses(profileData.user?.addresses || []);
      setNotifications(profileData.user?.notifications || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    router.push('/');
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">Loading your dashboard...</div>;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag, count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart, count: wishlist.length },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin, count: addresses.length },
    { id: 'wallet', label: 'Wallet', icon: FiCreditCard },
    { id: 'coupons', label: 'Coupons', icon: FiTag },
    { id: 'notifications', label: 'Notifications', icon: FiBell, count: notifications.filter((n: any) => !n.read).length },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
        <p className="mt-2 text-slate-600">Welcome back, {profile?.name || 'PINAKK Shopper'}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          {/* User Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{profile?.name || 'User'}</p>
                <p className="text-sm text-slate-600">{profile?.email || 'user@example.com'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">Wallet Balance</p>
              <p className="text-2xl font-bold text-slate-900">₹{profile?.walletBalance ?? 0}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="rounded-xl bg-white shadow-sm overflow-hidden">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-6 py-4 transition ${
                  activeTab === item.id 
                    ? 'bg-orange-50 text-secondary border-l-4 border-secondary' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition"
            >
              <FiLogOut />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-secondary mb-2">
                    <FiShoppingBag />
                    <span className="text-sm font-medium">Orders</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{orders.length}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-secondary mb-2">
                    <FiHeart />
                    <span className="text-sm font-medium">Wishlist</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{wishlist.length}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-secondary mb-2">
                    <FiMapPin />
                    <span className="text-sm font-medium">Addresses</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{addresses.length}</p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 text-secondary mb-2">
                    <FiAward />
                    <span className="text-sm font-medium">Reward Points</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{profile?.rewardPoints ?? 0}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                  <Link href="/dashboard/orders" className="text-secondary text-sm font-medium hover:underline">
                    View All
                  </Link>
                </div>
                {orders.length ? (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order: any) => (
                      <div key={order._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">Order #{order._id?.slice(-8)}</p>
                          <p className="text-sm text-slate-600">{order.items?.length || 0} items • ₹{order.total}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No orders yet</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/products" className="rounded-xl bg-secondary text-white p-6 text-center hover:bg-orange-600 transition">
                  <FiShoppingBag className="mx-auto mb-2 text-2xl" />
                  <p className="font-semibold">Start Shopping</p>
                </Link>
                <Link href="/dashboard/wishlist" className="rounded-xl bg-white border border-slate-200 p-6 text-center hover:border-slate-300 transition">
                  <FiHeart className="mx-auto mb-2 text-2xl text-secondary" />
                  <p className="font-semibold text-slate-900">View Wishlist</p>
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">My Orders</h2>
              {orders.length ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order._id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-slate-900">Order #{order._id?.slice(-8)}</p>
                          <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-slate-600">{order.items?.length || 0} items</p>
                        <p className="font-bold text-slate-900">₹{order.total}</p>
                      </div>
                      <Link href={`/orders/${order._id}`} className="mt-3 inline-flex items-center gap-2 text-secondary text-sm font-medium hover:underline">
                        View Details <FiChevronRight />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiShoppingBag className="mx-auto text-4xl text-slate-300 mb-4" />
                  <p className="text-slate-500 mb-4">No orders yet</p>
                  <Link href="/products" className="inline-flex bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">My Wishlist</h2>
              {wishlist.length ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item: any) => (
                    <div key={item._id} className="border border-slate-200 rounded-lg p-4">
                      <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-4xl mb-3">
                        📦
                      </div>
                      <p className="font-medium text-slate-900 truncate">{item.product?.name}</p>
                      <p className="text-slate-600">₹{item.product?.price}</p>
                      <button className="mt-3 w-full bg-secondary text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiHeart className="mx-auto text-4xl text-slate-300 mb-4" />
                  <p className="text-slate-500 mb-4">Your wishlist is empty</p>
                  <Link href="/products" className="inline-flex bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
                    Browse Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Saved Addresses</h2>
                <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                  Add New
                </button>
              </div>
              {addresses.length ? (
                <div className="space-y-4">
                  {addresses.map((address: any, index: number) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{address.type || 'Home'}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            {address.address}, {address.city}<br />
                            {address.state} - {address.postalCode}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">Phone: {address.phone}</p>
                        </div>
                        {address.isDefault && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Default</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiMapPin className="mx-auto text-4xl text-slate-300 mb-4" />
                  <p className="text-slate-500 mb-4">No saved addresses</p>
                  <button className="inline-flex bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
                    Add Address
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Wallet</h2>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white mb-6">
                <p className="text-sm opacity-90">Available Balance</p>
                <p className="text-4xl font-bold mt-2">₹{profile?.walletBalance ?? 0}</p>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition">
                  Add Money
                </button>
                <button className="w-full border border-slate-200 py-3 rounded-lg font-medium hover:border-slate-300 transition">
                  View Transactions
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h2>
              {notifications.length ? (
                <div className="space-y-4">
                  {notifications.map((notif: any, index: number) => (
                    <div key={index} className={`p-4 rounded-lg ${notif.read ? 'bg-slate-50' : 'bg-orange-50 border border-orange-200'}`}>
                      <p className="font-medium text-slate-900">{notif.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiBell className="mx-auto text-4xl text-slate-300 mb-4" />
                  <p className="text-slate-500">No notifications</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={profile?.name}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={profile?.email}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue={profile?.mobile}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                  />
                </div>
                <button className="bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
