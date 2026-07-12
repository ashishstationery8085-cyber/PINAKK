'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authHeaders } from '../../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const response = await fetch(`${API_BASE}/products/${id}`);
      const data = await response.json();
      setProduct(data.product);
      setSelectedImage(data.product?.images?.[0] || data.product?.image || null);
      setLoading(false);
    };
    load();
  }, [id]);

  const addToCart = async () => {
    setMessage('');
    if (!product) return;
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ product: id, quantity: 1 }),
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Added to cart successfully.');
    } else {
      setMessage(data.message || 'Unable to add to cart. Please sign in.');
    }
  };

  const buyNow = async () => {
    setMessage('');
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ product: id, quantity: 1 }),
    });
    const data = await response.json();
    if (data.success) {
      router.push('/checkout');
    } else {
      setMessage(data.message || 'Please sign in before checking out.');
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Product not found</h2>
          <p className="mt-4 text-slate-600">This item may no longer be available. Explore our catalog for similar products.</p>
          <Link href="/products" className="mt-8 inline-flex rounded-full bg-secondary px-6 py-3 text-white transition hover:bg-orange-600">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] bg-slate-100 p-4">
              <div className="w-full overflow-hidden rounded-[1.5rem] bg-slate-200">
                {selectedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedImage} alt={product.name} loading="lazy" className="w-full h-[420px] object-contain" />
                ) : (
                  <div className="aspect-[4/3] rounded-[1.5rem] bg-slate-200" />
                )}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {(product.images || [product.image]).map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 overflow-hidden rounded-2xl border ${selectedImage === img ? 'border-primary' : 'border-transparent'} bg-white p-1`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`thumb-${i}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-secondary">{product.category?.name || 'General'}</p>
                    <h1 className="mt-3 text-4xl font-semibold text-slate-900">{product.name}</h1>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">{product.rating || '4.7'} ★</div>
                </div>
                <p className="mt-6 text-slate-600">{product.description || 'Premium PINAKK product description and specifications.'}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Brand: {product.brand || 'PINAKK'}</span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">Stock: {product.stock ?? 0}</span>
                </div>
              </div>
              <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Fast checkout</p>
                <p className="mt-3 text-lg font-semibold">Secure payments and same-day delivery on select orders.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                {product.oldPrice ? <span className="ml-3 text-sm line-through text-slate-500">₹{product.oldPrice}</span> : null}
              </div>
              {product.discount ? <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-white">-{product.discount}%</span> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={addToCart} className="rounded-full bg-secondary px-6 py-3 text-white transition hover:bg-orange-600">Add to Cart</button>
              <button onClick={buyNow} className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 transition hover:border-primary hover:text-primary">Buy Now</button>
            </div>
            {message && <p className="mt-4 text-sm text-primary">{message}</p>}
          </div>
        </div>

        <aside className="space-y-6 rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Why buy from PINAKK?</h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Fast delivery options</li>
              <li className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Easy returns within 7 days</li>
              <li className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Secure checkout</li>
              <li className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Dedicated support</li>
            </ul>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Still deciding?</p>
            <p className="mt-3 text-base leading-6">Check our curated collections, best sellers, and daily deals to find the perfect match.</p>
            <Link href="/products" className="mt-6 inline-flex rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Explore similar products
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
