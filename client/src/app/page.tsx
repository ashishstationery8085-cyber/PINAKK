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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4">One Stop Shop For All Your Needs</h1>
              <p className="text-sm sm:text-base lg:text-lg mb-6 opacity-90">Stationery • Office Supplies • Gifts • Perfumes • Accessories & All General Items</p>
              <Link href="/services" className="inline-block bg-white text-orange-600 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-slate-100 transition text-sm sm:text-base">
                SHOP NOW
              </Link>
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-lg sm:text-xl" />
                  <span className="text-xs sm:text-sm">Best Quality Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTag className="text-lg sm:text-xl" />
                  <span className="text-xs sm:text-sm">Best Price Everyday</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-lg sm:text-xl" />
                  <span className="text-xs sm:text-sm">Fast & Reliable Delivery</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-24 sm:h-32">
                    <div className="text-4xl sm:text-6xl">🧴</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-24 sm:h-32">
                    <div className="text-4xl sm:text-6xl">🎗️</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-24 sm:h-32">
                    <div className="text-4xl sm:text-6xl">📊</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-24 sm:h-32">
                    <div className="text-4xl sm:text-6xl">✏️</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-24 sm:h-32">
                    <div className="text-4xl sm:text-6xl">📄</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-24 sm:h-32">
                    <div className="text-4xl sm:text-6xl">🎁</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features Bar */}
      <section className="bg-white py-4 sm:py-6 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
            {[
              { icon: FiTruck, title: 'Free Delivery', desc: 'Orders above ₹499' },
              { icon: FiRefreshCw, title: 'Easy Returns', desc: '7 days return policy' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% trusted checkout' },
              { icon: FiMapPin, title: 'Store Pickup', desc: 'Pick from store' },
              { icon: FiTag, title: 'Best Deals', desc: 'Exclusive offers' },
              { icon: FiHeadphones, title: '24/7 Support', desc: 'We are here to help' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <item.icon className="text-xl sm:text-2xl text-secondary" />
                <p className="font-semibold text-xs sm:text-sm text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Shop by Category</h2>
            <Link href="/categories" className="text-secondary font-semibold hover:underline text-sm sm:text-base">View All Categories →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {[
              { name: 'Stationery', slug: 'stationery', img: '📝' },
              { name: 'Paper Products', slug: 'paper', img: '📄' },
              { name: 'Office Supplies', slug: 'office', img: '📊' },
              { name: 'Gift Items', slug: 'gifts', img: '🎁' },
              { name: 'Perfumes', slug: 'perfumes', img: '🧴' },
              { name: 'Belts', slug: 'belts', img: '🎗️' },
              { name: 'General Store', slug: 'general', img: '🏪' },
              { name: 'Accessories', slug: 'accessories', img: '👜' },
            ].map((cat, idx) => (
              <Link key={idx} href={`/categories/${cat.slug}`} className="bg-white rounded-xl p-3 sm:p-4 text-center hover:shadow-lg transition border border-slate-200">
                <div className="text-3xl sm:text-4xl mb-2">{cat.img}</div>
                <p className="text-xs sm:text-sm font-medium text-slate-900">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 sm:p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">DEALS OF THE DAY</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-2">UP TO 60% OFF</h3>
              <Link href="/products" className="inline-block mt-3 sm:mt-4 text-xs sm:text-sm font-semibold underline">Shop Now</Link>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 sm:p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">NEW ARRIVALS</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-2">Check Out What's New</h3>
              <Link href="/products" className="inline-block mt-3 sm:mt-4 text-xs sm:text-sm font-semibold underline">Explore</Link>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">SAME DAY DELIVERY</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-2">Fast Delivery at Your Doorstep</h3>
              <Link href="/products" className="inline-block mt-3 sm:mt-4 text-xs sm:text-sm font-semibold underline">Order Now</Link>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-4 sm:p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">BIG SAVINGS</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-2">On Bulk Orders</h3>
              <Link href="/products" className="inline-block mt-3 sm:mt-4 text-xs sm:text-sm font-semibold underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Best Sellers</h2>
            <Link href="/products" className="text-secondary font-semibold hover:underline text-sm sm:text-base">View All →</Link>
          </div>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4">
            {featuredProducts.map((product, index) => {
              const fallbackIndex = index % 3;
              const bg = fallbackIndex === 0 ? 'bg-slate-100' : fallbackIndex === 1 ? 'bg-blue-100' : 'bg-yellow-100';
              const emoji = product.image && typeof product.image === 'string' && !product.image.startsWith('http') ? product.image : ['📄', '✏️', '📓'][fallbackIndex];

              return (
                <div key={product._id || `${product.name}-${index}`} className="min-w-[200px] sm:min-w-[250px] bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
                  <div className="relative">
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                        -{product.discount}%
                      </span>
                    )}
                    <div className={`h-36 sm:h-48 ${bg} flex items-center justify-center`}>
                      {product.image && typeof product.image === 'string' && product.image.startsWith('http') ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-5xl sm:text-7xl">{emoji}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 truncate">{product.name}</h3>
                    {product.brand && <p className="mt-1 text-xs sm:text-sm text-slate-500">{product.brand}</p>}
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`text-xs sm:text-sm ${i < 4 ? 'text-yellow-400' : 'text-slate-300'}`} />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">(4.7)</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-slate-900">₹{product.price}</span>
                    </div>
                    <button className="mt-3 w-full bg-secondary text-white py-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm">
                      <FiShoppingCart className="text-sm sm:text-base" /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose PINANKK */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6 sm:mb-8">Why Choose PINANKK?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: FiCheckCircle, title: '100% Original Products' },
              { icon: FiLock, title: 'Secure Payments' },
              { icon: FiRefreshCw, title: 'Easy Returns' },
              { icon: FiStar, title: 'Customer Satisfaction' },
              { icon: FiTag, title: 'Wide Range of Products' },
              { icon: FiShield, title: 'Best Prices Everyday' },
              { icon: FiTruck, title: 'Fast & Reliable Delivery' },
              { icon: FiLock, title: 'Secure Shopping' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <item.icon className="text-2xl sm:text-3xl text-secondary mx-auto mb-2 sm:mb-3" />
                <p className="font-semibold text-xs sm:text-sm text-slate-900">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-8 sm:py-12 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">Get the latest updates on new arrivals, exclusive offers & more.</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-slate-900 outline-none text-sm sm:text-base"
            />
            <button className="bg-secondary px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-orange-600 transition text-sm sm:text-base">
              Subscribe
            </button>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-300">
            <span>✓ Exclusive Offers</span>
            <span>✓ New Arrivals</span>
            <span>✓ Special Discounts</span>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6 sm:mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: 'Rahul Sharma', rating: 5, review: 'Excellent quality products and fast delivery. Highly recommended for all stationery needs!', avatar: 'RS' },
              { name: 'Priya Patel', rating: 5, review: 'Best prices in the market. I always order my office supplies from PINAKK. Great service!', avatar: 'PP' },
              { name: 'Amit Kumar', rating: 4, review: 'Wide variety of products. The customer support team is very helpful. Will definitely order again.', avatar: 'AK' },
            ].map((review, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-slate-900">{review.name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`text-xs sm:text-sm ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6 sm:mb-8">Follow Us on Instagram</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {['📝', '🎨', '✏️', '📊', '🎁', '🧴'].map((item, idx) => (
              <div key={idx} className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center text-4xl sm:text-6xl hover:scale-105 transition cursor-pointer">
                {item}
              </div>
            ))}
          </div>
          <div className="text-center mt-4 sm:mt-6">
            <a href="https://instagram.com/pinakk" target="_blank" rel="noopener noreferrer" className="text-secondary font-semibold hover:underline text-sm sm:text-base">
              @pinakk →
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-6 sm:mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3 sm:space-y-4">
            {[
              { q: 'What is your return policy?', a: 'We offer a 7-day return policy for most products. Items must be in their original condition with tags attached.' },
              { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available for select locations with 1-2 day delivery.' },
              { q: 'Do you offer bulk discounts?', a: 'Yes! We offer special discounts on bulk orders. Contact our sales team for custom quotes on large orders.' },
              { q: 'What payment methods do you accept?', a: 'We accept UPI, Credit/Debit Cards, Net Banking, Razorpay, and Cash on Delivery for eligible orders.' },
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-3 sm:p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                    <span className="font-semibold text-sm sm:text-base text-slate-900">{faq.q}</span>
                    <span className="text-secondary group-open:rotate-180 transition text-sm sm:text-base">▼</span>
                  </summary>
                  <div className="p-3 sm:p-4 text-slate-600 text-xs sm:text-sm">
                    {faq.a}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Latest from Our Blog</h2>
            <Link href="/blog" className="text-secondary font-semibold hover:underline text-sm sm:text-base">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'Top 10 Stationery Essentials for Students', excerpt: 'Discover the must-have stationery items every student needs for a successful academic year.', date: 'July 10, 2024' },
              { title: 'How to Organize Your Office Desk', excerpt: 'Tips and tricks to create a productive and organized workspace that boosts efficiency.', date: 'July 5, 2024' },
              { title: 'Sustainable Stationery Choices', excerpt: 'Learn about eco-friendly stationery options that help reduce your environmental footprint.', date: 'June 28, 2024' },
            ].map((post, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
                <div className="h-36 sm:h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-4xl sm:text-6xl">
                  📝
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-xs text-slate-500 mb-2">{post.date}</p>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600">{post.excerpt}</p>
                  <Link href="/blog" className="inline-block mt-3 sm:mt-4 text-secondary font-semibold text-xs sm:text-sm hover:underline">
                    Read More →
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