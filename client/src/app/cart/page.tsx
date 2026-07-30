'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authHeaders } from '../../lib/auth';
import { FiTrash2, FiPlus, FiMinus, FiHeart, FiArrowRight, FiTag } from 'react-icons/fi';

const CartPage = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState<'home' | 'pickup'>('home');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [savedItems, setSavedItems] = useState<any[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const loadCart = async () => {
      try {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = {};
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const response = await fetch(`${API_BASE}/cart`, { headers: requestHeaders });
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

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      await fetch(`${API_BASE}/cart/${itemId}`, {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify({ quantity: newQuantity }),
      });
      // Reload cart
      const response = await fetch(`${API_BASE}/cart`, { headers: requestHeaders });
      const data = await response.json();
      setCart(data.cart || { items: [] });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      await fetch(`${API_BASE}/cart/${itemId}`, {
        method: 'DELETE',
        headers: requestHeaders,
      });
      // Reload cart
      const response = await fetch(`${API_BASE}/cart`, { headers: requestHeaders });
      const data = await response.json();
      setCart(data.cart || { items: [] });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const saveForLater = (item: any) => {
    setSavedItems([...savedItems, item]);
    removeItem(item._id);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await response.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponMessage('Coupon applied successfully!');
      } else {
        setCouponMessage(data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponMessage('Error applying coupon');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage('');
  };

  const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + (item.total || item.price * item.quantity), 0) || 0;
  const shipping = deliveryOption === 'home' ? 49 : 0;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
  const tax = (subtotal + shipping - discount) * 0.18; // 18% GST
  const total = subtotal + shipping - discount + tax;

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">Loading cart...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
      <p className="mt-2 text-slate-600">{cart?.items?.length || 0} items in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Cart Items */}
        <div className="space-y-6">
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
                <div className="flex gap-4">
                  <div className="h-24 w-24 bg-slate-100 rounded-lg flex items-center justify-center text-4xl">
                    📦
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-slate-500">{item.variant?.name || 'Standard'}</p>
                        <h3 className="font-semibold text-slate-900">{item.product?.name || 'Product title'}</h3>
                        <p className="mt-1 text-sm text-slate-600">Brand: {item.product?.brand || 'PINAKK'}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-300 transition"
                        >
                          <FiMinus className="text-sm" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-slate-300 transition"
                        >
                          <FiPlus className="text-sm" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">₹{item.total || item.price * item.quantity}</p>
                        <p className="text-sm text-slate-500">₹{item.price} each</p>
                      </div>
                    </div>
                    <button
                      onClick={() => saveForLater(item)}
                      className="mt-3 flex items-center gap-2 text-sm text-secondary hover:underline"
                    >
                      <FiHeart /> Save for later
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              Your cart is empty. Add products to checkout faster.
              <Link href="/products" className="block mt-4 text-secondary font-semibold hover:underline">
                Browse Products →
              </Link>
            </div>
          )}

          {/* Saved for Later */}
          {savedItems.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Saved for Later ({savedItems.length})</h3>
              <div className="space-y-4">
                {savedItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="h-16 w-16 bg-slate-200 rounded flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.product?.name}</p>
                      <p className="text-sm text-slate-600">₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => {
                        // Move back to cart (would need API call)
                        setSavedItems(savedItems.filter((_, i) => i !== index));
                      }}
                      className="text-sm text-secondary hover:underline"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <aside className="space-y-6">
          {/* Coupon Code */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Apply Coupon</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              />
              {appliedCoupon ? (
                <button
                  onClick={removeCoupon}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Apply
                </button>
              )}
            </div>
            {couponMessage && (
              <p className={`mt-2 text-sm ${couponMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {couponMessage}
              </p>
            )}
            {appliedCoupon && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <FiTag />
                <span>{appliedCoupon.code} - {appliedCoupon.discount}% off applied!</span>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Shipping ({deliveryOption === 'home' ? 'Home Delivery' : 'Store Pickup'})</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.discount}%)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-700">
                <span>Tax (18% GST)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-slate-900 font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href={`/checkout?delivery=${deliveryOption}`}
              className="mt-6 block w-full rounded-xl bg-secondary px-5 py-3 text-center text-sm font-semibold text-white hover:bg-orange-600 transition"
            >
              Proceed to Checkout <FiArrowRight className="inline ml-2" />
            </Link>
            <Link
              href="/products"
              className="mt-3 block w-full rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:border-slate-300 transition"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Security Badge */}
          <div className="rounded-xl bg-slate-50 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <span className="text-green-600">🔒</span>
              <span>Secure Checkout</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Your payment information is safe and encrypted.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
