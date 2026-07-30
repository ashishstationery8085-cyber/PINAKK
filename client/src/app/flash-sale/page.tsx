'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiClock, FiShoppingCart, FiArrowRight } from 'react-icons/fi';

const flashSaleProducts = [
  {
    id: '1',
    name: 'Classmate Notebook Set (6 Pack)',
    originalPrice: 599,
    salePrice: 299,
    discount: 50,
    image: '📓',
    category: 'Stationery',
    stock: 45,
    sold: 155
  },
  {
    id: '2',
    name: 'Parker Vector Ball Pen (Pack of 10)',
    originalPrice: 899,
    salePrice: 449,
    discount: 50,
    image: '✏️',
    category: 'Pens',
    stock: 32,
    sold: 168
  },
  {
    id: '3',
    name: 'Apsara Drawing Pencils Set',
    originalPrice: 399,
    salePrice: 199,
    discount: 50,
    image: '✏️',
    category: 'Art Supplies',
    stock: 67,
    sold: 133
  },
  {
    id: '4',
    name: 'Camlin Water Color Tubes (24 Colors)',
    originalPrice: 799,
    salePrice: 399,
    discount: 50,
    image: '🎨',
    category: 'Art Supplies',
    stock: 28,
    sold: 172
  },
  {
    id: '5',
    name: 'Navneet Exam Pad',
    originalPrice: 199,
    salePrice: 99,
    discount: 50,
    image: '📋',
    category: 'Stationery',
    stock: 89,
    sold: 111
  },
  {
    id: '6',
    name: 'Geometry Box Premium',
    originalPrice: 449,
    salePrice: 225,
    discount: 50,
    image: '📐',
    category: 'Stationery',
    stock: 54,
    sold: 146
  }
];

export default function FlashSalePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">⚡ Flash Sale</h1>
              <p className="text-lg opacity-90">Up to 50% OFF on selected items!</p>
            </div>
            <div className="flex items-center gap-4 bg-white/20 backdrop-blur rounded-xl px-6 py-4">
              <FiClock className="text-3xl" />
              <div className="flex gap-2 text-2xl sm:text-3xl font-bold">
                <div className="bg-white text-red-600 px-3 py-2 rounded-lg min-w-[60px] text-center">
                  {formatTime(timeLeft.hours)}
                </div>
                <span>:</span>
                <div className="bg-white text-red-600 px-3 py-2 rounded-lg min-w-[60px] text-center">
                  {formatTime(timeLeft.minutes)}
                </div>
                <span>:</span>
                <div className="bg-white text-red-600 px-3 py-2 rounded-lg min-w-[60px] text-center">
                  {formatTime(timeLeft.seconds)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition border-2 border-red-200">
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                -{product.discount}%
              </div>

              {/* Product Image */}
              <div className="relative h-48 sm:h-56 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-7xl">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-6">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
                
                {/* Price */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-red-600">₹{product.salePrice}</span>
                  <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
                </div>

                {/* Stock Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{product.sold} sold</span>
                    <span>{product.stock} left</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${(product.sold / (product.sold + product.stock)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-600 transition"
                >
                  <FiShoppingCart /> Add to Cart
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition text-lg"
          >
            View All Products <FiArrowRight />
          </Link>
        </div>

        {/* Sale Terms */}
        <div className="mt-12 rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Flash Sale Terms & Conditions</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li>• Limited time offer - valid only while stocks last</li>
            <li>• Discount applied automatically at checkout</li>
            <li>• Cannot be combined with other coupons or offers</li>
            <li>• Free shipping on orders above ₹499</li>
            <li>• Standard return policy applies to flash sale items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
