'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiTruck, FiRefreshCw, FiShield, FiMapPin, FiTag, FiHeadphones, FiCheckCircle, FiLock, FiStar, FiHeart, FiShoppingCart, FiArrowRight, FiSearch } from 'react-icons/fi';
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

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    let mounted = true;

    const loadFeaturedProducts = async () => {
      try {
        const productsResponse = await api.get('/products?limit=8');
        
        if (!mounted) return;

        const apiProducts = Array.isArray(productsResponse?.data?.products) ? productsResponse.data.products : [];

        if (apiProducts.length > 0) {
          setFeaturedProducts(
            apiProducts.map((product: any) => ({
              _id: product.id || product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || product.image,
              brand: product.brand,
              description: product.description,
              discount: product.discount,
            }))
          );
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch {
        if (!mounted) return;
        setApiStatus('offline');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFeaturedProducts();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 sm:pt-32 lg:pt-40 pb-20 sm:pb-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-16 lg:grid-cols-2 items-center lg:gap-12">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-xl px-4 py-2.5 rounded-full border border-orange-500/30 w-fit">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-orange-200">✨ Premium Shopping Destination</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight bg-gradient-to-r from-white via-orange-200 to-amber-300 bg-clip-text text-transparent">
                  Your Complete Marketplace
                </h1>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                  Discover premium stationery, office supplies, gifts, and everything you need. One platform. Infinite possibilities.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative flex items-center gap-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-4 hover:border-orange-500/30 transition duration-300">
                  <FiSearch className="text-orange-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search products, categories, brands..."
                    className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/products" className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl shadow-orange-500/50">
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 group-hover:translate-x-full transition duration-500"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Explore Products
                    <FiArrowRight className="group-hover:translate-x-1 transition duration-300" />
                  </span>
                </Link>
                <Link href="/categories" className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-slate-800/50 backdrop-blur-xl border border-slate-700 hover:border-orange-500/50 hover:bg-slate-800/80 transition duration-300">
                  Browse Categories
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700/50">
                {[
                  { number: '50K+', label: 'Products' },
                  { number: '100K+', label: 'Happy Customers' },
                  { number: '24/7', label: 'Support' },
                ].map((stat, idx) => (
                  <div key={idx} className="group">
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-amber-400 transition duration-300">{stat.number}</div>
                    <div className="text-sm text-slate-400 group-hover:text-slate-300 transition duration-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative h-full">
              <div className="relative h-96 sm:h-[500px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {[
                    { delay: 0, offset: -40 },
                    { delay: 1, offset: 0 },
                    { delay: 2, offset: 40 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="absolute w-64 h-80 rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition duration-500"
                      style={{
                        animation: `float ${3 + item.delay}s ease-in-out infinite`,
                        animationDelay: `${item.delay * 0.2}s`,
                        transform: `translateX(${item.offset}px)`,
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-xl border border-orange-500/30 flex items-center justify-center">
                        <div className="text-8xl opacity-50">📦</div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                    </div>
                  ))}
                </div>

                <div className="absolute top-1/4 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Service Features Bar */}
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

      {/* Shop by Category */}
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
              { name: 'Stationery', slug: 'stationery', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400', color: 'from-blue-500 to-blue-600' },
              { name: 'Paper Products', slug: 'paper', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400', color: 'from-green-500 to-green-600' },
              { name: 'Office Supplies', slug: 'office', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400', color: 'from-purple-500 to-purple-600' },
              { name: 'Gift Items', slug: 'gifts', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400', color: 'from-pink-500 to-pink-600' },
              { name: 'Perfumes', slug: 'perfumes', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', color: 'from-amber-500 to-amber-600' },
              { name: 'Belts', slug: 'belts', image: 'https://images.unsplash.com/photo-1551028919-ac66c5f8b4b8?w=400', color: 'from-red-500 to-red-600' },
              { name: 'General Store', slug: 'general', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400', color: 'from-cyan-500 to-cyan-600' },
              { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', color: 'from-indigo-500 to-indigo-600' },
            ].map((cat, idx) => (
              <Link key={idx} href={`/categories/${cat.slug}`} className="group">
                <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-orange-300">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300 overflow-hidden`}>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
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
            {featuredProducts.length > 0 ? featuredProducts.map((product, index) => {
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
            }) : (
              <div className="w-full text-center py-12 text-slate-500">
                <p>No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
    </main>
  );
}
