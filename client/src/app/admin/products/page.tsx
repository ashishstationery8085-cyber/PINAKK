'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authHeaders, getAuthToken } from '../../../lib/auth';
import { useRouter } from 'next/navigation';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiDownload, FiArrowRight, FiGrid, FiList } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const AdminProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/admin/products`, { headers: requestHeaders });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: requestHeaders,
      });
      const data = await response.json();
      if (data.success) {
        loadProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-slate-100 text-slate-700';
      case 'out_of_stock': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">
              <FiArrowRight className="rotate-180" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Products Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white hover:bg-orange-600 text-sm"
            >
              <FiPlus /> Add Product
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm">
              <FiDownload /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary w-full lg:w-64"
                />
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
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-500">Loading products...</div>
        ) : filteredProducts.length ? (
          viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="h-48 bg-slate-100 flex items-center justify-center text-6xl">
                    📦
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{product.category}</p>
                    <p className="text-sm text-slate-600 mb-3">Brand: {product.brand || 'N/A'}</p>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-lg font-bold text-slate-900">₹{product.price}</p>
                      <p className="text-sm text-slate-600">Stock: {product.stock || 0}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm"
                      >
                        <FiEye /> View
                      </Link>
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-secondary text-white hover:bg-orange-600 text-sm"
                      >
                        <FiEdit /> Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Brand</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center text-xl">📦</div>
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-600">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{product.category}</td>
                      <td className="px-6 py-4 text-slate-700">{product.brand || 'N/A'}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">₹{product.price}</td>
                      <td className="px-6 py-4 text-slate-700">{product.stock || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                            title="View"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
                            title="Edit"
                          >
                            <FiEdit />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-slate-500">
            No products found matching your filters
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {filteredProducts.length} of {products.length} products
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

export default AdminProductsPage;
