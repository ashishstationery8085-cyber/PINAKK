'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTruck, FiRefreshCw, FiShield, FiMapPin, FiTag, FiHeadphones, FiCheckCircle, FiLock, FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';
import api from '../lib/api';

type FeaturedProduct = {
  _id?: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  brand?: string;
  description?: string;
  discount?: number;
};

const fallbackProducts: FeaturedProduct[] = [
  { name: 'A4 Paper Pack', price: 210, image: '📄', discount: 20 },
  { name: 'Parker Pen', price: 340, image: '✏️', discount: 15 },
  { name: 'Notebook Set', price: 299, image: '📓', discount: 15 },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(fallbackProducts);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiMessage, setApiMessage] = useState('Connecting to marketplace API...');

  useEffect(() => {
    let mounted = true;

    const loadFeaturedProducts = async () => {
      try {
        const [healthResponse, productsResponse] = await Promise.all([
          api.get('/health').catch(() => ({ data: { status: 'offline' } })),
          api.get('/products?limit=3').catch(() => ({ data: { products: [] } })),
        ]);

        if (!mounted) return;

        const backendOnline = healthResponse?.data?.status === 'ok';
        const apiProducts = Array.isArray(productsResponse?.data?.products) ? productsResponse.data.products : [];

        setApiStatus(backendOnline ? 'online' : 'offline');
        setApiMessage(backendOnline ? 'Live API connected and serving products.' : 'API unavailable — showing curated demo products.');

        if (apiProducts.length > 0) {
          setFeaturedProducts(
            apiProducts.slice(0, 3).map((product: any) => ({
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || product.image,
              brand: product.brand,
              description: product.description,
              discount: product.discount,
            }))
          );
        } else {
          setFeaturedProducts(fallbackProducts);
        }
      } catch {
        if (!mounted) return;
        setApiStatus('offline');
        setApiMessage('API unavailable — showing curated demo products.');
        setFeaturedProducts(fallbackProducts);
      }
    };

    loadFeaturedProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-slate-900 py-3 text-sm text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4">
          <span className="font-medium">PINAKK marketplace status</span>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${apiStatus === 'online' ? 'bg-emerald-500/20 text-emerald-300' : apiStatus === 'offline' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-400' : apiStatus === 'offline' ? 'bg-amber-400' : 'bg-slate-400'}`} />
              {apiStatus === 'checking' ? 'Checking API' : apiStatus === 'online' ? 'Live API online' : 'Demo mode'}
            </span>
            <span className="text-slate-400">{apiMessage}</span>
          </div>
        </div>
      </section>

      {/* Hero Section - Modern Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <FiStar className="text-yellow-300" />
                <span>Premium Stationery & Office Supplies</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                One Stop Shop For All Your Needs
              </h1>
              <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-xl">
                Stationery • Office Supplies • Gifts • Perfumes • Accessories & All General Items
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services" className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-slate-100 transition transform hover:scale-105 shadow-lg">
                  <FiShoppingCart />
                  <span>SHOP NOW</span>
                </Link>
                <Link href="/categories" className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition border border-white/30">
                  <span>EXPLORE CATEGORIES</span>
                </Link>
              </div>
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiCheckCircle className="text-xl" />
                  </div>
                  <div>
                    <span className="block font-semibold text-sm">Best Quality</span>
                    <span className="text-xs opacity-80">Premium Products</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiTag className="text-xl" />
                  </div>
                  <div>
                    <span className="block font-semibold text-sm">Best Price</span>
                    <span className="text-xs opacity-80">Everyday Deals</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FiTruck className="text-xl" />
                  </div>
                  <div>
                    <span className="block font-semibold text-sm">Fast Delivery</span>
                    <span className="text-xs opacity-80">Reliable Service</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl blur-3xl"></div>
                <div className="relative grid grid-cols-3 gap-4">
                  {[
                    { emoji: '🧴', rotate: '-6deg' },
                    { emoji: '🎗️', rotate: '4deg' },
                    { emoji: '📊', rotate: '-3deg' },
                    { emoji: '✏️', rotate: '5deg' },
                    { emoji: '📄', rotate: '-4deg' },
                    { emoji: '🎁', rotate: '3deg' },
                  ].map((item, idx) => (
                    <div key={idx} className={`bg-white/40 backdrop-blur-md rounded-2xl p-6 flex items-center justify-center h-32 shadow-xl transform hover:scale-110 transition duration-300`} style={{ transform: `rotate(${item.rotate})` }}>
                      <div className="text-6xl drop-shadow-lg">{item.emoji}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features Bar - Modern Design */}
      <section className="bg-gradient-to-r from-slate-50 to-white py-6 sm:py-8 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {[
              { icon: FiTruck, title: 'Free Delivery', desc: 'Orders above ₹499', color: 'text-blue-600' },
              { icon: FiRefreshCw, title: 'Easy Returns', desc: '7 days return policy', color: 'text-green-600' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% trusted checkout', color: 'text-purple-600' },
              { icon: FiMapPin, title: 'Store Pickup', desc: 'Pick from store', color: 'text-orange-600' },
              { icon: FiTag, title: 'Best Deals', desc: 'Exclusive offers', color: 'text-red-600' },
              { icon: FiHeadphones, title: '24/7 Support', desc: 'We are here to help', color: 'text-cyan-600' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition group">
                <div className={`p-3 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300 transition`}>
                  <item.icon className={`text-2xl ${item.color}`} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Shop by Category</h2>
              <p className="text-slate-600 mt-2">Browse our wide range of products</p>
            </div>
            <Link href="/categories" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition transform hover:scale-105 shadow-lg">
              View All Categories
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {[
              { name: 'Stationery', slug: 'stationery', img: '📝', color: 'from-blue-500 to-blue-600' },
              { name: 'Paper Products', slug: 'paper', img: '📄', color: 'from-green-500 to-green-600' },
              { name: 'Office Supplies', slug: 'office', img: '📊', color: 'from-purple-500 to-purple-600' },
              { name: 'Gift Items', slug: 'gifts', img: '🎁', color: 'from-pink-500 to-pink-600' },
              { name: 'Perfumes', slug: 'perfumes', img: '🧴', color: 'from-amber-500 to-amber-600' },
              { name: 'Belts', slug: 'belts', img: '🎗️', color: 'from-red-500 to-red-600' },
              { name: 'General Store', slug: 'general', img: '🏪', color: 'from-cyan-500 to-cyan-600' },
              { name: 'Accessories', slug: 'accessories', img: '👜', color: 'from-indigo-500 to-indigo-600' },
            ].map((cat, idx) => (
              <Link key={idx} href={`/categories/${cat.slug}`} className="group">
                <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-orange-300">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300`}>
                    <span className="text-3xl sm:text-4xl">{cat.img}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners - Modern Design */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                gradient: 'from-orange-500 via-orange-600 to-amber-500', 
                badge: 'DEALS OF THE DAY', 
                title: 'UP TO 60% OFF', 
                subtitle: 'Limited time offer',
                link: '/products',
                icon: '🔥'
              },
              { 
                gradient: 'from-slate-900 via-slate-800 to-slate-900', 
                badge: 'NEW ARRIVALS', 
                title: 'Check Out What\'s New', 
                subtitle: 'Fresh collection',
                link: '/products',
                icon: '✨'
              },
              { 
                gradient: 'from-green-500 via-emerald-600 to-green-600', 
                badge: 'SAME DAY DELIVERY', 
                title: 'Fast Delivery', 
                subtitle: 'At your doorstep',
                link: '/products',
                icon: '🚚'
              },
              { 
                gradient: 'from-blue-500 via-indigo-600 to-blue-600', 
                badge: 'BIG SAVINGS', 
                title: 'Bulk Orders', 
                subtitle: 'Contact us',
                link: '/contact',
                icon: '💰'
              },
            ].map((banner, idx) => (
              <div key={idx} className={`relative overflow-hidden bg-gradient-to-br ${banner.gradient} rounded-2xl p-6 sm:p-8 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition duration-500"></div>
                <div className="relative">
                  <div className="text-3xl mb-2">{banner.icon}</div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-3">
                    {banner.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{banner.subtitle}</p>
                  <Link href={banner.link} className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-2 underline-offset-4 hover:decoration-orange-300 transition">
                    Shop Now <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Best Sellers</h2>
              <p className="text-slate-600 mt-2">Our most popular products</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition transform hover:scale-105 shadow-lg">
              View All Products
              <span>→</span>
            </Link>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6">
            {featuredProducts.map((product, index) => {
              const fallbackIndex = index % 3;
              const bg = fallbackIndex === 0 ? 'bg-gradient-to-br from-slate-100 to-slate-200' : fallbackIndex === 1 ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gradient-to-br from-amber-100 to-amber-200';
              const emoji = product.image && typeof product.image === 'string' && !product.image.startsWith('http') ? product.image : ['📄', '✏️', '📓'][fallbackIndex];

              return (
                <div key={product._id || `${product.name}-${index}`} className="min-w-[240px] sm:min-w-[280px] bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="relative">
                    {product.discount && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg z-10">
                        -{product.discount}%
                      </span>
                    )}
                    <div className={`h-48 sm:h-56 ${bg} flex items-center justify-center relative overflow-hidden`}>
                      {product.image && typeof product.image === 'string' && product.image.startsWith('http') ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
                      ) : (
                        <span className="text-7xl sm:text-8xl">{emoji}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    </div>
                    <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 hover:bg-white shadow-lg">
                      <FiHeart className="text-slate-600 hover:text-red-500 transition" />
                    </button>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-base sm:text-lg text-slate-900 truncate">{product.name}</h3>
                    {product.brand && <p className="mt-1 text-sm text-slate-500">{product.brand}</p>}
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-slate-300'}`} />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">(4.7)</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-slate-900">₹{product.price}</span>
                      {product.discount && (
                        <span className="text-sm text-slate-500 line-through">₹{Math.round(product.price / (1 - product.discount / 100))}</span>
                      )}
                    </div>
                    <button className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition flex items-center justify-center gap-2 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105">
                      <FiShoppingCart className="text-base sm:text-lg" /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose PINAKK - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Choose PINAKK?</h2>
            <p className="text-slate-600 mt-2">Your trusted partner for quality stationery</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: FiCheckCircle, title: '100% Original Products', color: 'text-green-600' },
              { icon: FiLock, title: 'Secure Payments', color: 'text-blue-600' },
              { icon: FiRefreshCw, title: 'Easy Returns', color: 'text-purple-600' },
              { icon: FiStar, title: 'Customer Satisfaction', color: 'text-yellow-600' },
              { icon: FiTag, title: 'Wide Range of Products', color: 'text-red-600' },
              { icon: FiShield, title: 'Best Prices Everyday', color: 'text-cyan-600' },
              { icon: FiTruck, title: 'Fast & Reliable Delivery', color: 'text-orange-600' },
              { icon: FiHeadphones, title: '24/7 Support', color: 'text-indigo-600' },
            ].map((item, idx) => (
              <div key={idx} className="group text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:scale-110 transition duration-300`}>
                  <item.icon className={`text-3xl ${item.color}`} />
                </div>
                <p className="font-semibold text-sm sm:text-base text-slate-900">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FiStar className="text-yellow-300" />
            <span>Stay Updated</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">Get exclusive offers, new arrivals, and updates delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition transform hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Customer Reviews - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Our Customers Say</h2>
            <p className="text-slate-600 mt-2">Real reviews from satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { name: 'Rahul Sharma', rating: 5, review: 'Excellent quality products and fast delivery. Highly recommended for all stationery needs!', avatar: 'RS', color: 'from-blue-500 to-blue-600' },
              { name: 'Priya Patel', rating: 5, review: 'Best prices in the market. I always order my office supplies from PINAKK. Great service!', avatar: 'PP', color: 'from-pink-500 to-pink-600' },
              { name: 'Amit Kumar', rating: 4, review: 'Wide variety of products. The customer support team is very helpful. Will definitely order again.', avatar: 'AK', color: 'from-green-500 to-green-600' },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${review.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-base text-slate-900">{review.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Follow Us on Instagram</h2>
            <p className="text-slate-600 mt-2">@pinakk for daily updates and inspiration</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {[
              { emoji: '📝', color: 'from-blue-400 to-blue-500' },
              { emoji: '🎨', color: 'from-pink-400 to-pink-500' },
              { emoji: '✏️', color: 'from-purple-400 to-purple-500' },
              { emoji: '📊', color: 'from-green-400 to-green-500' },
              { emoji: '🎁', color: 'from-orange-400 to-orange-500' },
              { emoji: '🧴', color: 'from-cyan-400 to-cyan-500' },
            ].map((item, idx) => (
              <div key={idx} className={`aspect-square bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-5xl sm:text-7xl hover:scale-105 transition cursor-pointer shadow-lg hover:shadow-2xl transform hover:-translate-y-1`}>
                {item.emoji}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="https://instagram.com/pinakk" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition transform hover:scale-105 shadow-lg">
              @pinakk <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 mt-2">Find answers to common questions</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'What is your return policy?', a: 'We offer a 7-day return policy for most products. Items must be in their original condition with tags attached.' },
              { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for select locations with 1-2 day delivery.' },
              { q: 'Do you offer bulk discounts?', a: 'Yes! We offer special discounts on bulk orders. Contact our sales team for custom quotes on large orders.' },
              { q: 'What payment methods do you accept?', a: 'We accept UPI, Credit/Debit Cards, Net Banking, Razorpay, and Cash on Delivery for eligible orders.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition">
                    <span className="font-semibold text-base text-slate-900">{faq.q}</span>
                    <span className="text-orange-600 group-open:rotate-180 transition text-lg">▼</span>
                  </summary>
                  <div className="p-5 sm:p-6 text-slate-600 text-sm leading-relaxed bg-white">
                    {faq.a}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview - Modern Design */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Latest from Our Blog</h2>
              <p className="text-slate-600 mt-2">Tips, guides, and inspiration</p>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition transform hover:scale-105 shadow-lg">
              View All Posts
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: 'Top 10 Stationery Essentials for Students', excerpt: 'Discover the must-have stationery items every student needs for a successful academic year.', date: 'July 10, 2024', color: 'from-blue-400 to-blue-500', icon: '📝' },
              { title: 'How to Organize Your Office Desk', excerpt: 'Tips and tricks to create a productive and organized workspace that boosts efficiency.', date: 'July 5, 2024', color: 'from-green-400 to-green-500', icon: '📊' },
              { title: 'Sustainable Stationery Choices', excerpt: 'Learn about eco-friendly stationery options that help reduce your environmental footprint.', date: 'June 28, 2024', color: 'from-emerald-400 to-emerald-500', icon: '🌱' },
            ].map((post, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className={`h-48 sm:h-56 bg-gradient-to-br ${post.color} flex items-center justify-center text-6xl sm:text-8xl relative overflow-hidden`}>
                  <span className="transform group-hover:scale-110 transition duration-500">{post.icon}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-slate-500 mb-2 font-medium">{post.date}</p>
                  <h3 className="font-semibold text-lg text-slate-900 mb-3 group-hover:text-orange-600 transition">{post.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                  <Link href="/blog" className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm hover:underline">
                    Read More <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}