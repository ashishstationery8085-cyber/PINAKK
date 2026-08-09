import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiYoutube, FiInstagram, FiMail, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Logo & Description */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="PINAKK" className="h-12 w-auto object-contain" />
              <div>
                <h3 className="text-2xl font-bold text-white">PINAKK</h3>
                <p className="text-sm text-slate-300">Shop Smart, Live Better</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Your one-stop destination for premium stationery, office supplies, gifts, perfumes, and lifestyle products. Quality products at the best prices.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-secondary transition" aria-label="Facebook">
                <FiFacebook className="text-lg" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-secondary transition" aria-label="Twitter">
                <FiTwitter className="text-lg" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-secondary transition" aria-label="Instagram">
                <FiInstagram className="text-lg" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-secondary transition" aria-label="LinkedIn">
                <FiLinkedin className="text-lg" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-secondary transition" aria-label="YouTube">
                <FiYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories/stationery" className="hover:text-white transition">Stationery</Link></li>
              <li><Link href="/categories/paper" className="hover:text-white transition">Paper Products</Link></li>
              <li><Link href="/categories/office" className="hover:text-white transition">Office Supplies</Link></li>
              <li><Link href="/categories/gifts" className="hover:text-white transition">Gifts</Link></li>
              <li><Link href="/categories/perfumes" className="hover:text-white transition">Perfumes</Link></li>
              <li><Link href="/categories/belts" className="hover:text-white transition">Belts</Link></li>
              <li><Link href="/categories/accessories" className="hover:text-white transition">Accessories</Link></li>
              <li><Link href="/categories/general" className="hover:text-white transition">General Store</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/brands" className="hover:text-white transition">Brands</Link></li>
              <li><Link href="/vendors" className="hover:text-white transition">Sell on PINAKK</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Return Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/orders/track" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Help Center</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-semibold text-white mb-4">My Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-white transition">My Profile</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Compare</Link></li>
              <li><Link href="/dashboard/addresses" className="hover:text-white transition">Addresses</Link></li>
              <li><Link href="/dashboard/coupons" className="hover:text-white transition">Coupons</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition">Sign In / Register</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-xl bg-slate-800 p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-sm text-slate-400">Get the latest updates on new arrivals, exclusive offers & more.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="bg-secondary px-6 py-3 rounded-lg font-semibold text-white hover:bg-orange-600 transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-secondary">
              <FiMapPin />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Address</h5>
              <p className="text-xs text-slate-400 mt-1">
                Ashish Stationary & Photocopy<br />
                Near Range Gate Main Road<br />
                Rehti, District Sehore<br />
                Madhya Pradesh 466446
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-secondary">
              <FiPhone />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Phone</h5>
              <a href="tel:+918085212103" className="text-xs text-slate-400 mt-1 hover:text-white transition">
                +91 80852 12103
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-secondary">
              <FiMail />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Email</h5>
              <a href="mailto:support@pinakk.com" className="text-xs text-slate-400 mt-1 hover:text-white transition">
                support@pinakk.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-secondary">
              <FiClock />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Working Hours</h5>
              <p className="text-xs text-slate-400 mt-1">
                Mon - Sat: 10:00 AM - 8:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm font-semibold text-white mb-4">Payment Methods</p>
          <div className="flex flex-wrap gap-4 text-3xl text-slate-400">
            <span title="Credit/Debit Cards">💳</span>
            <span title="Net Banking">🏦</span>
            <span title="UPI">📱</span>
            <span title="Wallets">💰</span>
            <span title="Cash on Delivery">�</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2024 PINAKK - Powered by Ashish Stationary & Photocopy | Design & Managed By DevaCore Studios</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-white transition">Shipping Policy</Link>
          </div>
          <p>📍 Rehti, Sehore, Madhya Pradesh | <a href="tel:+918085212103" className="hover:text-white transition">+91 80852 12103</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
