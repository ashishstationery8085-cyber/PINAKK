import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiYoutube, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="PINAKK" className="h-12 w-auto object-contain" />
              <div>
                <h3 className="text-2xl font-bold text-white">PINAKK</h3>
                <p className="text-sm text-slate-300">Shop Smart, Live Better</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-white hover:text-secondary transition"><FiFacebook className="text-xl" /></a>
              <a href="#" className="text-white hover:text-secondary transition"><FiTwitter className="text-xl" /></a>
              <a href="#" className="text-white hover:text-secondary transition"><FiLinkedin className="text-xl" /></a>
              <a href="#" className="text-white hover:text-secondary transition"><FiYoutube className="text-xl" /></a>
              <a href="#" className="text-white hover:text-secondary transition"><FiInstagram className="text-xl" /></a>
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

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Return Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-semibold text-white mb-4">My Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-white transition">My Profile</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><Link href="/dashboard/addresses" className="hover:text-white transition">Addresses</Link></li>
              <li><Link href="/orders/track" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/dashboard/coupons" className="hover:text-white transition">Coupons</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">📍</span>
                <span>Ashish Stationary & Photocopy<br />Near Range Gate Main Road<br />Rehti, District Sehore<br />Madhya Pradesh 466446</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary">📞</span>
                <a href="tel:+918085212103" className="hover:text-white transition">+91 80852 12103</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary">📧</span>
                <span>support@pinakk.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-secondary">🕐</span>
                <span>Mon-Sat: 10AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm font-semibold text-white mb-4">Payment Methods</p>
          <div className="flex gap-4 text-2xl text-slate-400">
            <span>💳</span>
            <span>🏦</span>
            <span>💰</span>
            <span>📱</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2024 PINAKK - Powered by Ashish Stationary & Photocopy</p>
          <p>📍 Rehti, Sehore, Madhya Pradesh</p>
          <p>All Rights Reserved | <a href="tel:+918085212103" className="hover:text-white transition">+91 80852 12103</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
