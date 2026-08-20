'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authHeaders } from '../../../lib/auth';
import { FiHeart, FiShare2, FiStar, FiTruck, FiRefreshCw, FiShield, FiCheckCircle, FiMinus, FiPlus, FiZoomIn } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        const data = await response.json();
        setProduct(data.product);
        setSelectedImage(data.product?.images?.[0] || data.product?.image || null);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const addToCart = async () => {
    setMessage('');
    if (!product) return;
    const headers = authHeaders();
    const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (headers.Authorization) {
      requestHeaders.Authorization = headers.Authorization;
    }
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ product: id, quantity, variant: selectedVariant }),
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
    const headers = authHeaders();
    const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (headers.Authorization) {
      requestHeaders.Authorization = headers.Authorization;
    }
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ product: id, quantity, variant: selectedVariant }),
    });
    const data = await response.json();
    if (data.success) {
      router.push('/checkout');
    } else {
      setMessage(data.message || 'Please sign in before checking out.');
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
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

  const variants = product.variants || [
    { id: 1, name: 'Standard', price: product.price },
    { id: 2, name: 'Premium', price: product.price * 1.2 },
    { id: 3, name: 'Value Pack', price: product.price * 0.9 },
  ];

  const colors = product.colors || ['Black', 'Blue', 'Red', 'Green'];
  const sizes = product.sizes || ['Small', 'Medium', 'Large'];

  const reviews = product.reviews || [
    { id: 1, user: 'Rahul S.', rating: 5, comment: 'Excellent quality! Very satisfied with the purchase.', date: '2024-07-10' },
    { id: 2, user: 'Priya P.', rating: 4, comment: 'Good product, delivery was fast. Would recommend.', date: '2024-07-08' },
    { id: 3, user: 'Amit K.', rating: 5, comment: 'Best in class. Will definitely buy again.', date: '2024-07-05' },
  ];

  const relatedProducts = product.relatedProducts || [
    { id: 1, name: 'Similar Product 1', price: 299, image: '📝' },
    { id: 2, name: 'Similar Product 2', price: 399, image: '✏️' },
    { id: 3, name: 'Similar Product 3', price: 199, image: '📊' },
    { id: 4, name: 'Similar Product 4', price: 499, image: '🎁' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-slate-600">
        <Link href="/" className="hover:text-secondary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-secondary">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div 
            className="relative rounded-2xl overflow-hidden bg-slate-100 cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.name} 
                className={`w-full h-[500px] object-contain transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
              />
            ) : (
              <div className="aspect-square bg-slate-200 flex items-center justify-center text-6xl">📦</div>
            )}
            {isZoomed && (
              <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                <FiZoomIn className="text-slate-700" />
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="mt-4 grid grid-cols-5 gap-3">
            {(product.images || [product.image]).map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`h-20 overflow-hidden rounded-lg border-2 transition ${selectedImage === img ? 'border-secondary' : 'border-transparent hover:border-slate-300'}`}
              >
                <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 hover:border-slate-300 transition">
              <FiHeart /> Wishlist
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 hover:border-slate-300 transition">
              <FiShare2 /> Share
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <p className="text-sm uppercase tracking-wider text-secondary">{product.category?.name || 'General'}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>
            
            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`text-sm ${i < (product.rating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <span className="text-sm text-slate-600">{product.rating || 4.5} ({reviews.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="text-xl text-slate-500 line-through">₹{product.oldPrice}</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-4 flex items-center gap-2">
              <span className={`flex items-center gap-1 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <FiCheckCircle />
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* SKU */}
            <p className="mt-2 text-sm text-slate-500">SKU: {product.sku || 'PINAKK-' + id}</p>
            <p className="text-sm text-slate-500">Brand: {product.brand || 'PINAKK'}</p>
          </div>

          {/* Variant Selection */}
          {variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Select Variant</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedVariant?.id === variant.id 
                        ? 'border-secondary bg-orange-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {variant.name} - ₹{variant.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Color: {selectedColor || 'Select'}</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedColor === color 
                        ? 'border-secondary bg-orange-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Size: {selectedSize || 'Select'}</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedSize === size 
                        ? 'border-secondary bg-orange-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:border-slate-300 transition"
              >
                <FiMinus />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:border-slate-300 transition"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-secondary text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={product.stock === 0}
              className="flex-1 border-2 border-secondary text-secondary py-4 rounded-xl font-semibold hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {message && (
            <p className={`mb-6 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          {/* Delivery Info */}
          <div className="rounded-xl bg-slate-50 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <FiTruck className="text-secondary mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Free Delivery</p>
                <p className="text-sm text-slate-600">Orders above ₹499. Estimated delivery in 3-5 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiRefreshCw className="text-secondary mt-1" />
              <div>
                <p className="font-semibold text-slate-900">7 Days Return</p>
                <p className="text-sm text-slate-600">Easy returns and refunds within 7 days of delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiShield className="text-secondary mt-1" />
              <div>
                <p className="font-semibold text-slate-900">Secure Payment</p>
                <p className="text-sm text-slate-600">100% secure payment with multiple options.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-slate-200">
          <div className="flex gap-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold capitalize transition ${
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

        <div className="mt-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Product Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description || 'Premium quality product from PINAKK. Designed for excellence and durability. Perfect for everyday use with superior performance.'}
              </p>
              <h4 className="text-lg font-semibold text-slate-900 mt-6 mb-3">Key Features</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><FiCheckCircle className="text-secondary" /> Premium quality materials</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-secondary" /> Durable and long-lasting</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-secondary" /> Perfect for everyday use</li>
                <li className="flex items-center gap-2"><FiCheckCircle className="text-secondary" /> Value for money</li>
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Specifications</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Brand</span>
                  <span className="font-medium text-slate-900">{product.brand || 'PINAKK'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Category</span>
                  <span className="font-medium text-slate-900">{product.category?.name || 'General'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">SKU</span>
                  <span className="font-medium text-slate-900">{product.sku || 'PINAKK-' + id}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Stock</span>
                  <span className="font-medium text-slate-900">{product.stock || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Weight</span>
                  <span className="font-medium text-slate-900">{product.weight || '200g'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-600">Dimensions</span>
                  <span className="font-medium text-slate-900">{product.dimensions || '10 x 15 x 2 cm'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Customer Reviews</h3>
                <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
                  Write a Review
                </button>
              </div>
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-slate-100 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{review.user}</p>
                          <p className="text-xs text-slate-500">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Products</h2>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {relatedProducts.map((related: any) => (
            <Link key={related.id} href={`/products/${related.id}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-slate-100 flex items-center justify-center text-6xl">
                {related.image}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 truncate">{related.name}</h3>
                <p className="mt-2 font-bold text-slate-900">₹{related.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
