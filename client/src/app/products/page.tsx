'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import { FiGrid, FiList, FiFilter, FiX, FiHeart, FiShoppingCart, FiArrowUp, FiArrowDown, FiStar } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const categories = [
  'Stationery', 'Paper Products', 'Office Supplies', 'Gift Items', 
  'Perfumes', 'Belts', 'General Store', 'Accessories'
];

const brands = ['Classmate', 'Navneet', 'Camlin', 'Cello', 'Luxor', 'Faber Castell', 'Apsara', 'Kangaro', 'Doms', 'Pilot', 'Linc', 'Reynolds'];

const ProductsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';
  const categoryFilter = searchParams?.get('category') || '';
  const brandFilter = searchParams?.get('brand') || '';
  const minPrice = searchParams?.get('minPrice') || '';
  const maxPrice = searchParams?.get('maxPrice') || '';
  const ratingFilter = searchParams?.get('rating') || '';
  const availabilityFilter = searchParams?.get('availability') || '';
  const discountFilter = searchParams?.get('discount') || '';
  const sortBy = searchParams?.get('sort') || 'featured';
  const viewMode = searchParams?.get('view') || 'grid';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiMessage, setApiMessage] = useState('Loading catalog from the marketplace API...');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryFilter ? categoryFilter.split(',') : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(brandFilter ? brandFilter.split(',') : []);
  const [priceRange, setPriceRange] = useState({ min: minPrice || '', max: maxPrice || '' });
  const [selectedRating, setSelectedRating] = useState(ratingFilter || '');
  const [selectedAvailability, setSelectedAvailability] = useState(availabilityFilter || '');
  const [selectedDiscount, setSelectedDiscount] = useState(discountFilter || '');
  const [currentSort, setCurrentSort] = useState(sortBy);
  const [currentView, setCurrentView] = useState(viewMode);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategories.length) params.append('category', selectedCategories.join(','));
      if (selectedBrands.length) params.append('brand', selectedBrands.join(','));
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (selectedRating) params.append('rating', selectedRating);
      if (selectedAvailability) params.append('availability', selectedAvailability);
      if (selectedDiscount) params.append('discount', selectedDiscount);
      if (currentSort) params.append('sort', currentSort);

      const url = `${API_BASE}/products${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
      setApiStatus(response.ok ? 'online' : 'offline');
      setApiMessage(response.ok ? 'Catalog connected to the API.' : 'Showing fallback storefront content.');
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setApiStatus('offline');
      setApiMessage('API unavailable — showing the curated demo catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const destination = query?.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : '/products';
    router.push(destination);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategories.length) params.append('category', selectedCategories.join(','));
    if (selectedBrands.length) params.append('brand', selectedBrands.join(','));
    if (priceRange.min) params.append('minPrice', priceRange.min);
    if (priceRange.max) params.append('maxPrice', priceRange.max);
    if (selectedRating) params.append('rating', selectedRating);
    if (selectedAvailability) params.append('availability', selectedAvailability);
    if (selectedDiscount) params.append('discount', selectedDiscount);
    if (currentSort) params.append('sort', currentSort);
    if (currentView) params.append('view', currentView);

    router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setSelectedRating('');
    setSelectedAvailability('');
    setSelectedDiscount('');
    router.push('/products');
  };

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('sort', sort);
    router.push(`/products?${params.toString()}`);
  };

  const toggleViewMode = (mode: 'grid' | 'list') => {
    setCurrentView(mode);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('view', mode);
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryFilter, brandFilter, minPrice, maxPrice, ratingFilter, availabilityFilter, discountFilter, sortBy]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'discount', label: 'Discount' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm text-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium">Catalog status</span>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${apiStatus === 'online' ? 'bg-emerald-500/20 text-emerald-300' : apiStatus === 'offline' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-300'}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-400' : apiStatus === 'offline' ? 'bg-amber-400' : 'bg-slate-400'}`} />
              {apiStatus === 'checking' ? 'Checking' : apiStatus === 'online' ? 'Live API' : 'Demo mode'}
            </span>
            <span className="text-slate-400">{apiMessage}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Shop Products</h1>
            <p className="mt-2 text-slate-600">Search and filter across stationery, fashion, gifts, and everyday essentials.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-full sm:w-[320px]">
              <SearchBar onSearch={handleSearch} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition"
            >
              <FiFilter />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
        {searchQuery && (
          <p className="mt-6 text-sm text-slate-500">
            Showing results for <span className="font-semibold text-slate-900">{searchQuery}</span>
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-4 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-secondary hover:underline">
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-sm text-slate-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Brands</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-sm text-slate-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating.toString()}
                        onChange={() => setSelectedRating(rating.toString())}
                        className="border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-slate-700">& Up</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === 'in-stock'}
                      onChange={() => setSelectedAvailability('in-stock')}
                      className="border-slate-300 text-secondary focus:ring-secondary"
                    />
                    <span className="text-sm text-slate-700">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === 'out-of-stock'}
                      onChange={() => setSelectedAvailability('out-of-stock')}
                      className="border-slate-300 text-secondary focus:ring-secondary"
                    />
                    <span className="text-sm text-slate-700">Out of Stock</span>
                  </label>
                </div>
              </div>

              {/* Discount */}
              <div className="mb-6">
                <h4 className="font-semibold text-slate-900 mb-3">Discount</h4>
                <div className="space-y-2">
                  {['10', '20', '30', '50'].map((discount) => (
                    <label key={discount} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="discount"
                        checked={selectedDiscount === discount}
                        onChange={() => setSelectedDiscount(discount)}
                        className="border-slate-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-sm text-slate-700">{discount}% or more</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={applyFilters}
                className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
              >
                Apply Filters
              </button>
            </div>
          </aside>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and View Options */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-600">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
            <div className="flex items-center gap-4">
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleViewMode('grid')}
                  className={`p-2 rounded-lg ${currentView === 'grid' ? 'bg-secondary text-white' : 'border border-slate-200'}`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => toggleViewMode('list')}
                  className={`p-2 rounded-lg ${currentView === 'list' ? 'bg-secondary text-white' : 'border border-slate-200'}`}
                >
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className={currentView === 'grid' ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={`rounded-3xl bg-slate-100 ${currentView === 'grid' ? 'h-60' : 'h-32'}`} />
              ))
            ) : products.length ? (
              products.map((product) => (
                <div key={product._id || product.id}>
                  <ProductCard
                    product={{
                      id: product._id || product.id,
                      name: product.name,
                      price: product.price || 0,
                      category: product.category?.name || product.category || 'General',
                      oldPrice: product.comparePrice || product.oldPrice,
                      discount: product.discount || (product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0),
                      image: product.images?.[0] || product.image,
                      description: product.description,
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl bg-white p-12 text-center text-slate-500 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No products found.</p>
                <p className="mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 disabled:opacity-50" disabled>
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-secondary text-white' : 'border border-slate-200 hover:border-slate-300'}`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-slate-500">
        <Link href="/auth/register" className="font-semibold text-primary underline">
          Create an account
        </Link>{' '}
        and enjoy fast checkout, wishlists, and loyalty rewards.
      </div>
    </div>
  );
};

const ProductsPage = () => (
  <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">Loading products...</div>}>
    <ProductsPageContent />
  </Suspense>
);

export default ProductsPage;
