'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiGrid, FiList, FiFilter, FiStar, FiShoppingCart } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const brandInfo: Record<string, { name: string; description: string; logo: string; founded: string; country: string }> = {
  'classmate': {
    name: 'Classmate',
    description: 'Classmate is India\'s leading notebook brand, known for its high-quality paper and innovative designs. Part of ITC Limited, Classmate offers a wide range of stationery products for students and professionals.',
    logo: '📓',
    founded: '2003',
    country: 'India'
  },
  'navneet': {
    name: 'Navneet',
    description: 'Navneet Education Limited is a leading educational content publisher in India. Known for quality notebooks, educational books, and stationery products that cater to students across all age groups.',
    logo: '📚',
    founded: '1959',
    country: 'India'
  },
  'camlin': {
    name: 'Camlin',
    description: 'Camlin is a renowned Indian stationery brand famous for its art supplies, pens, pencils, and mathematical instruments. Known for innovation and quality in the art and stationery segment.',
    logo: '🎨',
    founded: '1931',
    country: 'India'
  },
  'apsara': {
    name: 'Apsara',
    description: 'Apsara Pencils Limited is one of India\'s leading pencil manufacturers. Known for high-quality pencils, erasers, and sharpeners that are trusted by millions of students.',
    logo: '✏️',
    founded: '1950',
    country: 'India'
  },
  'reynolds': {
    name: 'Reynolds',
    description: 'Reynolds is a premium pen brand known for its smooth writing experience and elegant designs. Part of the Reynolds Group, it offers a wide range of writing instruments.',
    logo: '🖊️',
    founded: '1930',
    country: 'USA'
  },
  'faber-castell': {
    name: 'Faber-Castell',
    description: 'Faber-Castell is one of the world\'s leading manufacturers of high-quality stationery products. German precision and quality in every product, from pencils to art supplies.',
    logo: '✏️',
    founded: '1761',
    country: 'Germany'
  },
  'staedtler': {
    name: 'Staedtler',
    description: 'Staedtler is a German manufacturer of writing, artist, and engineering stationery. Known for innovation, quality, and precision in every product.',
    logo: '📐',
    founded: '1835',
    country: 'Germany'
  },
  'pilot': {
    name: 'Pilot',
    description: 'Pilot Corporation is a Japanese manufacturer of writing instruments. Known for innovative pen technologies and superior writing experience.',
    logo: '✈️',
    founded: '1918',
    country: 'Japan'
  },
  'cello': {
    name: 'Cello',
    description: 'Cello is an Indian stationery brand known for its pens, pencils, and other writing instruments. Trusted by millions for quality and affordability.',
    logo: '🖊️',
    founded: '1965',
    country: 'India'
  },
  'luxor': {
    name: 'Luxor',
    description: 'Luxor Writing Instruments is an Indian company known for its pens, markers, and highlighters. Combining quality with innovative designs.',
    logo: '✒️',
    founded: '1963',
    country: 'India'
  },
  'casio': {
    name: 'Casio',
    description: 'Casio is a Japanese electronics company known for its calculators, watches, and electronic instruments. Trusted for precision and reliability.',
    logo: '🔢',
    founded: '1946',
    country: 'Japan'
  },
  'skybags': {
    name: 'Skybags',
    description: 'Skybags is a leading luggage and backpack brand in India. Known for stylish, durable, and innovative bags for travel and everyday use.',
    logo: '🎒',
    founded: '2009',
    country: 'India'
  },
  'wildcraft': {
    name: 'Wildcraft',
    description: 'Wildcraft is an Indian outdoor gear brand known for backpacks, shoes, and travel accessories. Designed for adventure and everyday use.',
    logo: '🏕️',
    founded: '1998',
    country: 'India'
  },
  'american-tourister': {
    name: 'American Tourister',
    description: 'American Tourister is a global luggage brand known for durable, stylish travel bags and suitcases. Part of Samsonite Group.',
    logo: '🧳',
    founded: '1933',
    country: 'USA'
  },
  'puma': {
    name: 'Puma',
    description: 'Puma is a global sportswear brand known for athletic shoes, clothing, and accessories. Combining performance with style.',
    logo: '🐆',
    founded: '1948',
    country: 'Germany'
  },
  'nike': {
    name: 'Nike',
    description: 'Nike is a global leader in athletic footwear, apparel, and equipment. Known for innovation and the iconic swoosh logo.',
    logo: '👟',
    founded: '1964',
    country: 'USA'
  },
  'milton': {
    name: 'Milton',
    description: 'Milton is India\'s leading brand for insulated water bottles, lunch boxes, and kitchenware. Known for quality and durability.',
    logo: '🍼',
    founded: '1972',
    country: 'India'
  },
  'nataraj': {
    name: 'Nataraj',
    description: 'Nataraj is a popular Indian stationery brand known for affordable pencils, erasers, and sharpeners. Trusted by students across India.',
    logo: '✏️',
    founded: '1959',
    country: 'India'
  },
  'doms': {
    name: 'Doms',
    description: 'Doms is an Indian stationery brand known for quality pencils, pens, and art supplies at affordable prices.',
    logo: '✏️',
    founded: '1976',
    country: 'India'
  },
  'orpat': {
    name: 'Orpat',
    description: 'Orpat is an Indian electronics brand known for calculators, clocks, and home appliances. Affordable and reliable.',
    logo: '🔢',
    founded: '1986',
    country: 'India'
  },
  'texas-instruments': {
    name: 'Texas Instruments',
    description: 'Texas Instruments is an American technology company known for calculators, semiconductors, and educational technology.',
    logo: '🔢',
    founded: '1930',
    country: 'USA'
  },
  'canon': {
    name: 'Canon',
    description: 'Canon is a Japanese multinational corporation specializing in imaging and optical products, including cameras, printers, and calculators.',
    logo: '📷',
    founded: '1937',
    country: 'Japan'
  }
};

const BrandPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');

  const brand = brandInfo[slug as string];

  useEffect(() => {
    if (!slug || !brand) {
      router.push('/shop');
      return;
    }
    loadProducts();
  }, [slug]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products?brand=${slug}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSortedProducts = () => {
    let sorted = [...products];
    
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      sorted = sorted.filter(p => p.price >= min && p.price <= max);
    }
    
    return sorted;
  };

  const addToCart = async (productId: string) => {
    try {
      const token = localStorage.getItem('pinakk_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      
      await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ product: productId, quantity: 1 }),
      });
      
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!brand) return <div className="min-h-screen flex items-center justify-center">Brand not found</div>;

  const sortedProducts = getSortedProducts();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center gap-6">
            <div className="text-8xl">{brand.logo}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{brand.name}</h1>
              <p className="text-orange-100 text-lg mb-4">{brand.description}</p>
              <div className="flex gap-6 text-sm">
                <span>Founded: {brand.founded}</span>
                <span>Country: {brand.country}</span>
                <span>Products: {products.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              >
                <option value="all">All Prices</option>
                <option value="0-100">Under ₹100</option>
                <option value="100-500">₹100 - ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-99999">Above ₹1000</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-500">Loading products...</div>
        ) : sortedProducts.length ? (
          viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
                  <Link href={`/products/${product._id}`}>
                    <div className="h-48 bg-slate-100 flex items-center justify-center text-6xl">
                      📦
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                      {product.comparePrice && (
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{product.category}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={`text-sm ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">(4.0)</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-lg font-bold text-slate-900">₹{product.price}</p>
                        {product.comparePrice && (
                          <p className="text-sm text-slate-500 line-through">₹{product.comparePrice}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock === 0}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                          <div>
                            <Link href={`/products/${product._id}`} className="font-medium text-slate-900 hover:text-secondary">
                              {product.name}
                            </Link>
                            <p className="text-sm text-slate-600">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{product.category}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">₹{product.price}</p>
                        {product.comparePrice && (
                          <p className="text-sm text-slate-500 line-through">₹{product.comparePrice}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{product.stock || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={`text-sm ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                          ))}
                          <span className="text-xs text-slate-500 ml-1">(4.0)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => addToCart(product._id)}
                          disabled={product.stock === 0}
                          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <FiShoppingCart /> Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-500">
            No products found for this brand
          </div>
        )}

        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {sortedProducts.length} products
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;
