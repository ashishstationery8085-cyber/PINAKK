'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiHeart, FiMapPin, FiShoppingCart, FiUser, FiMenu, FiX, FiTruck, FiHelpCircle, FiGrid } from 'react-icons/fi';
import { clearAuthToken, getAuthToken } from '../lib/auth';

const TopNav = () => {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthenticated(!!getAuthToken());
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLogout = () => {
    clearAuthToken();
    setAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <>
      {loading && <div className="loading-bar" />}
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-xs py-2">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <FiMapPin className="text-secondary" />
              <span className="hidden sm:block">Rehti, Sehore, MP 466446</span>
            </div>
            <span className="hidden lg:block text-slate-300">Welcome to PINAKK - Shop Smart, Live Better!</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-slate-300">
            <a href="tel:+918085212103" className="flex items-center gap-1 hover:text-white transition">
              <FiMapPin /> +91 80852 12103
            </a>
            <a href="/orders" className="hidden sm:flex items-center gap-1 hover:text-white transition">
              <FiTruck /> Track Order
            </a>
            <a href="/support" className="hidden sm:flex items-center gap-1 hover:text-white transition">
              <FiHelpCircle /> Help & Support
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="text-4xl">☀️</div>
                  <div className="absolute -right-1 -bottom-1 text-xl">→</div>
                </div>
                <span className="text-3xl font-bold text-slate-900">PINANKK</span>
              </div>
            </Link>

            {/* Categories & Search */}
            <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-l-lg hover:bg-slate-200 transition"
                >
                  <FiGrid />
                  <span className="font-medium text-sm">All Categories</span>
                </button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <Link href="/categories/stationery" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">Stationery</Link>
                      <Link href="/categories/paper" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">Paper Products</Link>
                      <Link href="/categories/office" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">Office Supplies</Link>
                      <Link href="/categories/gifts" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">Gift Items</Link>
                      <Link href="/categories/perfumes" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">Perfumes</Link>
                      <Link href="/categories/accessories" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">Accessories</Link>
                      <Link href="/categories/belts" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">Belts</Link>
                      <Link href="/categories/general" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded">General Store</Link>
                      <Link href="/categories" className="block px-3 py-2 text-sm hover:bg-slate-100 rounded font-semibold border-t mt-2 pt-2">View All Categories</Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full px-4 py-3 border border-slate-200 outline-none focus:border-primary"
                />
                <button className="bg-secondary text-white px-6 py-3 rounded-r-lg hover:bg-orange-600 transition">
                  Search
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-xs text-slate-500">Hello, {authenticated ? 'User' : 'Sign in'}</p>
                <Link href={authenticated ? '/dashboard' : '/auth/login'} className="text-sm font-semibold text-slate-900 hover:text-primary">
                  {authenticated ? 'Account' : 'Account & Lists'}
                </Link>
              </div>
              <Link href="/wishlist" className="hidden sm:flex flex-col items-center text-slate-700 hover:text-primary transition">
                <FiHeart className="text-xl" />
                <span className="text-xs">Wishlist</span>
              </Link>
              <Link href="/cart" className="flex flex-col items-center text-slate-700 hover:text-primary transition relative">
                <FiShoppingCart className="text-xl" />
                <span className="text-xs">Cart</span>
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-xs text-white flex items-center justify-center">0</span>
              </Link>
              <button onClick={() => setOpen(!open)} className="md:hidden p-2">
                {open ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-primary"
            />
            <button className="bg-secondary text-white px-4 py-3 rounded-lg">
              <FiMapPin />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-md">
            <div className="flex flex-col gap-3">
              <Link href="/products" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded">All Products</Link>
              <Link href="/products?category=deals" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded">Deals</Link>
              <Link href="/vendors" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded">Sell on PINANKK</Link>
              <Link href="/support" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded">Help & Support</Link>
              <Link href="/orders" className="block px-3 py-2 text-slate-700 hover:bg-slate-50 rounded">Track Order</Link>
              <div className="pt-2 border-t border-slate-100">
                {authenticated ? (
                  <button onClick={() => { clearAuthToken(); setAuthenticated(false); window.location.href = '/'; }} className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg">
                    Logout
                  </button>
                ) : (
                  <Link href="/auth/login" className="w-full block bg-secondary text-white px-4 py-3 rounded-lg text-center">
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default TopNav;
