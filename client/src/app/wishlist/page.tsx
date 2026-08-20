'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { authHeaders } from '../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const response = await fetch(`${API_BASE}/wishlist`, { headers });
      const data = await response.json();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const headers = authHeaders();
      await fetch(`${API_BASE}/wishlist/${productId}`, {
        method: 'DELETE',
        headers,
      });
      setWishlist(wishlist.filter((item) => item.product._id !== productId));
      setMessage('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const headers = authHeaders();
      await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ product: productId, quantity: 1 }),
      });
      setMessage('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="text-center text-slate-500">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20 lg:px-8">
      <div className="mb-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-4">
          <FiArrowLeft /> Continue Shopping
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">My Wishlist</h1>
        <p className="mt-2 text-slate-600">{wishlist.length} items saved</p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <FiHeart className="mx-auto text-6xl text-slate-300 mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-600 mb-6">Save items you love by clicking the heart icon on any product.</p>
            <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-base font-semibold text-white transition hover:bg-orange-600">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <div key={item.product._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
              <div className="relative h-40 sm:h-48 bg-slate-100 rounded-lg flex items-center justify-center text-5xl sm:text-6xl mb-4">
                {item.product.image?.[0] ? (
                  <img src={item.product.image[0]} alt={item.product.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span>📦</span>
                )}
                <button
                  onClick={() => removeFromWishlist(item.product._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-50 transition"
                  title="Remove from wishlist"
                >
                  <FiTrash2 className="text-red-500" />
                </button>
              </div>
              <Link href={`/products/${item.product._id}`}>
                <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1">{item.product.name}</h3>
                <p className="text-sm text-slate-500 mb-2">{item.product.category}</p>
              </Link>
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-bold text-slate-900">₹{item.product.price}</p>
                {item.product.comparePrice && (
                  <p className="text-sm text-slate-500 line-through">₹{item.product.comparePrice}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(item.product._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <Link
                  href={`/products/${item.product._id}`}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-50 transition text-center"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
