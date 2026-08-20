'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authHeaders, getAuthToken } from '../../../../lib/auth';
import { FiPackage, FiMapPin, FiCheckCircle, FiClock, FiTruck, FiLogOut, FiAlertCircle, FiNavigation } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  user: {
    name: string;
    email: string;
    mobile?: string;
  };
  shippingAddress: any;
  items: any[];
}

const DeliveryDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [deliveryBoyInfo, setDeliveryBoyInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMap, setShowMap] = useState(false);

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
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }

      const response = await fetch(`${API_BASE}/delivery/dashboard`, {
        headers: requestHeaders
      });

      const data = await response.json();

      if (data.success) {
        setDeliveryBoyInfo(data.deliveryBoy);
        setStats(data.stats);
        setOrders(data.orders);
        setIsAvailable(data.deliveryBoy.isAvailable);
      } else {
        setMessage(data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setMessage('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }

      const response = await fetch(`${API_BASE}/delivery/availability`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({ isAvailable: !isAvailable })
      });

      const data = await response.json();
      if (data.success) {
        setIsAvailable(!isAvailable);
        setMessage(`You are now ${!isAvailable ? 'offline' : 'online'}`);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setMessage('Error updating availability');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }

      const response = await fetch(`${API_BASE}/delivery/order/${orderId}/status`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Order status updated');
        await fetchDashboard();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setMessage('Error updating order');
    }
  };

  const handleShareLocation = async (orderId: string) => {
    if (!navigator.geolocation) {
      setMessage('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const headers = authHeaders();
          const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
          if (headers.Authorization) {
            requestHeaders.Authorization = headers.Authorization;
          }

          const response = await fetch(`${API_BASE}/delivery/location`, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              orderId: orderId
            })
          });

          const data = await response.json();
          if (data.success) {
            setMessage('Location shared with customer');
          }
        } catch (error) {
          console.error('Error sharing location:', error);
          setMessage('Error sharing location');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setMessage('Unable to get your location. Please enable location services.');
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatuses = (currentStatus: string) => {
    const statusFlow: { [key: string]: string[] } = {
      'PENDING': ['CONFIRMED', 'PROCESSING'],
      'CONFIRMED': ['PROCESSING'],
      'PROCESSING': ['OUT_FOR_DELIVERY'],
      'OUT_FOR_DELIVERY': ['DELIVERED'],
      'DELIVERED': [],
      'CANCELLED': []
    };
    return statusFlow[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiTruck className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-bounce" />
          <p className="text-xl font-semibold text-gray-900">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, {deliveryBoyInfo?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleToggleAvailability}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  isAvailable
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-400 hover:bg-gray-500 text-white'
                }`}
              >
                {isAvailable ? '🟢 Online' : '🔴 Offline'}
              </button>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <FiLogOut size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg m-4">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <FiPackage className="text-blue-600 mb-2" size={24} />
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FiClock className="text-yellow-600 mb-2" size={24} />
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.pendingOrders || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FiTruck className="text-orange-600 mb-2" size={24} />
            <p className="text-gray-600 text-sm">Out for Delivery</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.outForDeliveryOrders || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <FiCheckCircle className="text-green-600 mb-2" size={24} />
            <p className="text-gray-600 text-sm">Delivered</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.deliveredOrders || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-yellow-500 text-lg mb-2">★</div>
            <p className="text-gray-600 text-sm">Rating</p>
            <p className="text-3xl font-bold text-gray-900">{deliveryBoyInfo?.rating || 0}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{order.user.name}</div>
                      <div className="text-xs text-gray-500">{order.user.mobile || order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{order.total}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleShareLocation(order.id)}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        <FiNavigation className="inline mr-1" size={16} /> Share Location
                      </button>

                      {getNextStatuses(order.status).length > 0 && (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleUpdateStatus(order.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="ml-2 px-3 py-1 rounded border border-gray-300 text-sm"
                        >
                          <option value="">Update Status</option>
                          {getNextStatuses(order.status).map((status) => (
                            <option key={status} value={status}>
                              {status.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <FiAlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
