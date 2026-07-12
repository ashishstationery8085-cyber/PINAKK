'use client';

import Link from 'next/link';
import { FiTruck, FiRefreshCw, FiShield, FiMapPin, FiTag, FiHeadphones, FiCheckCircle, FiLock, FiStar, FiHeart, FiShoppingCart } from 'react-icons/fi';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">One Stop Shop For All Your Needs</h1>
              <p className="text-lg mb-6 opacity-90">Stationery • Office Supplies • Gifts • Perfumes • Accessories & All General Items</p>
              <Link href="/services" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition">
                SHOP NOW
              </Link>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-xl" />
                  <span className="text-sm">Best Quality Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTag className="text-xl" />
                  <span className="text-sm">Best Price Everyday</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-xl" />
                  <span className="text-sm">Fast & Reliable Delivery</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-32">
                    <div className="text-6xl">🧴</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-32">
                    <div className="text-6xl">🎗️</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-32">
                    <div className="text-6xl">📊</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-32">
                    <div className="text-6xl">✏️</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-32">
                    <div className="text-6xl">📄</div>
                  </div>
                  <div className="bg-white/30 backdrop-blur rounded-xl p-4 flex items-center justify-center h-32">
                    <div className="text-6xl">🎁</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features Bar */}
      <section className="bg-white py-6 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {[
              { icon: FiTruck, title: 'Free Delivery', desc: 'Orders above ₹499' },
              { icon: FiRefreshCw, title: 'Easy Returns', desc: '7 days return policy' },
              { icon: FiShield, title: 'Secure Payment', desc: '100% trusted checkout' },
              { icon: FiMapPin, title: 'Store Pickup', desc: 'Pick from store' },
              { icon: FiTag, title: 'Best Deals', desc: 'Exclusive offers' },
              { icon: FiHeadphones, title: '24/7 Support', desc: 'We are here to help' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <item.icon className="text-2xl text-secondary" />
                <p className="font-semibold text-sm text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
            <Link href="/categories" className="text-secondary font-semibold hover:underline">View All Categories →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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
              <Link key={idx} href={`/categories/${cat.slug}`} className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition border border-slate-200">
                <div className="text-4xl mb-2">{cat.img}</div>
                <p className="text-sm font-medium text-slate-900">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">DEALS OF THE DAY</span>
              <h3 className="text-2xl font-bold mt-2">UP TO 60% OFF</h3>
              <Link href="/products" className="inline-block mt-4 text-sm font-semibold underline">Shop Now</Link>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">NEW ARRIVALS</span>
              <h3 className="text-2xl font-bold mt-2">Check Out What's New</h3>
              <Link href="/products" className="inline-block mt-4 text-sm font-semibold underline">Explore</Link>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">SAME DAY DELIVERY</span>
              <h3 className="text-2xl font-bold mt-2">Fast Delivery at Your Doorstep</h3>
              <Link href="/products" className="inline-block mt-4 text-sm font-semibold underline">Order Now</Link>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider">BIG SAVINGS</span>
              <h3 className="text-2xl font-bold mt-2">On Bulk Orders</h3>
              <Link href="/products" className="inline-block mt-4 text-sm font-semibold underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Best Sellers</h2>
            <Link href="/products" className="text-secondary font-semibold hover:underline">View All →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[
              { id: 1, name: 'A4 Paper Pack', price: 210, oldPrice: 260, discount: 20, rating: 4.5, img: '📄', bg: 'bg-slate-100' },
              { id: 2, name: 'Parker Pen', price: 340, oldPrice: 400, discount: 15, rating: 4.8, img: '✏️', bg: 'bg-blue-100' },
              { id: 3, name: 'Calculator', price: 450, oldPrice: 500, discount: 10, rating: 4.3, img: '📊', bg: 'bg-green-100' },
              { id: 4, name: 'Perfume Bottle', price: 899, oldPrice: 1199, discount: 25, rating: 4.7, img: '🧴', bg: 'bg-purple-100' },
              { id: 5, name: 'Notebook Set', price: 299, oldPrice: 350, discount: 15, rating: 4.4, img: '📓', bg: 'bg-yellow-100' },
              { id: 6, name: 'Stapler', price: 150, oldPrice: 180, discount: 17, rating: 4.2, img: '📎', bg: 'bg-red-100' },
            ].map((product) => (
              <div key={product.id} className="min-w-[250px] bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  {product.discount && (
                    <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                      -{product.discount}%
                    </span>
                  )}
                  <div className={`h-48 ${product.bg} flex items-center justify-center`}>
                    <span className="text-7xl">{product.img}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-300'}`} />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">({product.rating})</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                    {product.oldPrice && <span className="text-sm text-slate-500 line-through">₹{product.oldPrice}</span>}
                  </div>
                  <button className="mt-3 w-full bg-secondary text-white py-2 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2 font-semibold">
                    <FiShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose PINANKK */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Why Choose PINANKK?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <item.icon className="text-3xl text-secondary mx-auto mb-3" />
                <p className="font-semibold text-sm text-slate-900">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-slate-300 mb-6">Get the latest updates on new arrivals, exclusive offers & more.</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 outline-none"
            />
            <button className="bg-secondary px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
              Subscribe
            </button>
          </div>
          <div className="mt-6 flex justify-center gap-8 text-sm text-slate-300">
            <span>✓ Exclusive Offers</span>
            <span>✓ New Arrivals</span>
            <span>✓ Special Discounts</span>
          </div>
        </div>
      </section>
    </main>
  );
}