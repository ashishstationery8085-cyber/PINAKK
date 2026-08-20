'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authHeaders, getAuthToken } from '../../../lib/auth';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiRefreshCw, FiArrowLeft, FiMapPin, FiCreditCard, FiClock, FiDownload, FiCopy, FiPhone, FiMail } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }
    if (!id) return;
    loadOrder();
    loadTracking();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/orders/${id}`, { headers: requestHeaders });
      const data = await response.json();
      if (data.success) setOrder(data.order);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTracking = async () => {
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/orders/${id}/track`, { headers: requestHeaders });
      const data = await response.json();
      if (data.success) setTracking(data.tracking);
    } catch (error) {
      console.error('Error loading tracking:', error);
    }
  };

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/orders/${id}/cancel`, {
        method: 'POST',
        headers: requestHeaders,
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Order cancelled successfully');
        loadOrder();
      } else {
        setMessage(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      setMessage('Error cancelling order');
    }
  };

  const requestReturn = async () => {
    if (!confirm('Are you sure you want to request a return for this order?')) return;
    
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/orders/${id}/return`, {
        method: 'POST',
        headers: requestHeaders,
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Return request submitted successfully');
        loadOrder();
      } else {
        setMessage(data.message || 'Failed to request return');
      }
    } catch (error) {
      setMessage('Error requesting return');
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    setMessage('Order ID copied to clipboard');
    setTimeout(() => setMessage(''), 2000);
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

  const trackingSteps = [
    { id: 'placed', label: 'Order Placed', icon: FiPackage },
    { id: 'confirmed', label: 'Order Confirmed', icon: FiCheckCircle },
    { id: 'shipped', label: 'Shipped', icon: FiTruck },
    { id: 'delivered', label: 'Delivered', icon: FiCheckCircle },
  ];

  const getCurrentStep = () => {
    if (!order) return 0;
    if (order.status === 'delivered') return 4;
    if (order.status === 'shipped') return 3;
    if (order.status === 'processing') return 2;
    return 1;
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">Loading order details...</div>;
  if (!order) return <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">Order not found.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
          <FiArrowLeft /> Back to Orders
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Order #{order._id.slice(-8)}</h1>
              <button onClick={copyOrderId} className="text-slate-400 hover:text-slate-600">
                <FiCopy />
              </button>
            </div>
            <p className="mt-2 text-slate-600">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status || 'Processing'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <div className="flex gap-8">
          {['details', 'tracking', 'items'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium capitalize transition ${
                activeTab === tab 
                  ? 'text-secondary border-b-2 border-secondary' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Main Content */}
        <div>
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FiMapPin /> Shipping Address
                </h2>
                <div className="text-slate-700">
                  <p className="font-medium">{order.shippingDetails?.address?.fullName}</p>
                  <p className="mt-1">{order.shippingDetails?.address?.phone}</p>
                  <p className="mt-2">
                    {order.shippingDetails?.address?.line1}{order.shippingDetails?.address?.line2 && `, ${order.shippingDetails?.address?.line2}`}
                  </p>
                  <p>
                    {order.shippingDetails?.address?.city}, {order.shippingDetails?.address?.state} - {order.shippingDetails?.address?.postalCode}
                  </p>
                  <p>{order.shippingDetails?.address?.country}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FiCreditCard /> Payment Information
                </h2>
                <div className="space-y-3 text-slate-700">
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="font-medium capitalize">{order.payment?.method || 'Card'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-medium capitalize">{order.payment?.status || 'Pending'}</span>
                  </div>
                  {order.payment?.transactionId && (
                    <div className="flex justify-between">
                      <span>Transaction ID</span>
                      <span className="font-medium">{order.payment.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal || (order.total - (order.shipping || 0))}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Shipping</span>
                    <span>₹{order.shipping || 0}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Tax (18% GST)</span>
                    <span>₹{((order.subtotal || order.total) * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-slate-900 font-bold text-lg">
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Tracking</h2>
              
              {/* Timeline */}
              <div className="space-y-6">
                {trackingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index < getCurrentStep();
                  const isCurrent = index === getCurrentStep() - 1;
                  
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-secondary text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        <StepIcon />
                      </div>
                      <div className="flex-1 pb-6 border-l-2 pl-4">
                        <p className={`font-medium ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-slate-600 mt-1">In progress</p>
                        )}
                        {isCompleted && index < getCurrentStep() - 1 && (
                          <p className="text-sm text-green-600 mt-1">Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Estimated Delivery */}
              {tracking?.estimatedDelivery && (
                <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FiClock />
                    <span className="font-medium">Estimated Delivery</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{tracking.estimatedDelivery}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'items' && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Order Items ({order.items?.length || 0})</h2>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="h-20 w-20 bg-slate-200 rounded-lg flex items-center justify-center text-3xl">
                      📦
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.product?.name || 'Product'}</p>
                      <p className="text-sm text-slate-600 mt-1">Quantity: {item.quantity}</p>
                      <p className="text-sm text-slate-600">Price: ₹{item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{item.total || item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Actions */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {(order.status === 'processing' || order.status === 'pending') && (
                <button
                  onClick={cancelOrder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition font-medium"
                >
                  <FiXCircle /> Cancel Order
                </button>
              )}
              {order.status === 'delivered' && (
                <button
                  onClick={requestReturn}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 transition font-medium"
                >
                  <FiRefreshCw /> Request Return
                </button>
              )}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 transition font-medium">
                <FiDownload /> Download Invoice
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h2>
            <div className="space-y-3">
              <a href="tel:+919876543210" className="flex items-center gap-3 text-slate-700 hover:text-slate-900">
                <FiPhone /> +91 98765 43210
              </a>
              <a href="mailto:support@pinakk.com" className="flex items-center gap-3 text-slate-700 hover:text-slate-900">
                <FiMail /> support@pinakk.com
              </a>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Items</span>
                <span className="font-medium">{order.items?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total</span>
                <span className="font-bold">₹{order.total}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {message && (
        <div className={`mt-6 p-4 rounded-lg text-center ${
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
