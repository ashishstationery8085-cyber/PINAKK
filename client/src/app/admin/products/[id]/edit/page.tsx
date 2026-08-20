'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authHeaders, getAuthToken } from '../../../../../lib/auth';
import { FiArrowLeft, FiUpload, FiX, FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    comparePrice: '',
    sku: '',
    stock: '',
    images: [] as string[],
    variants: [] as any[],
    tags: [] as string[],
    status: 'active',
    featured: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [variantInput, setVariantInput] = useState({ type: '', value: '', price: '' });

  const categories = [
    'Notebooks', 'Pens', 'Pencils', 'Erasers', 'Sharpeners',
    'Geometry Box', 'Art Supplies', 'Files & Folders', 'Diaries',
    'Calculator', 'School Bags', 'Water Bottles', 'Craft Supplies'
  ];

  const brands = [
    'Classmate', 'Navneet', 'Camlin', 'Apsara', 'Reynolds',
    'Faber-Castell', 'Staedtler', 'Pilot', 'Cello', 'Luxor'
  ];

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }
    if (!id) return;
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/admin/products/${id}`, { headers: requestHeaders });
      const data = await response.json();
      if (data.success) {
        const product = data.product;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          category: product.category || '',
          brand: product.brand || '',
          price: product.price?.toString() || '',
          comparePrice: product.comparePrice?.toString() || '',
          sku: product.sku || '',
          stock: product.stock?.toString() || '',
          images: product.images || [],
          variants: product.variants || [],
          tags: product.tags || [],
          status: product.status || 'active',
          featured: product.featured || false,
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setMessage('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddVariant = () => {
    if (variantInput.type && variantInput.value) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...variantInput, price: parseFloat(variantInput.price) || 0 }]
      }));
      setVariantInput({ type: '', value: '', price: '' });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((_, i) => 
        `https://via.placeholder.com/400?text=Image+${formData.images.length + i + 1}`
      );
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        stock: parseInt(formData.stock),
      };

      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'PATCH',
        headers: requestHeaders,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Product updated successfully!');
        setTimeout(() => router.push('/admin/products'), 2000);
      } else {
        setMessage(data.message || 'Failed to update product');
      }
    } catch (error) {
      setMessage('Error updating product');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-slate-600 hover:text-slate-900">
              <FiArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Category & Brand</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand *</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                >
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing & Inventory</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Compare Price (₹)</label>
                <input
                  type="number"
                  name="comparePrice"
                  value={formData.comparePrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Images</h2>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <FiUpload className="mx-auto text-4xl text-slate-400 mb-2" />
                <p className="text-slate-600">Click to upload images</p>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <div className="h-24 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Product Variants</h2>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <input
                type="text"
                value={variantInput.type}
                onChange={(e) => setVariantInput(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Type (e.g., Color)"
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              />
              <input
                type="text"
                value={variantInput.value}
                onChange={(e) => setVariantInput(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Value (e.g., Red)"
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={variantInput.price}
                  onChange={(e) => setVariantInput(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Price"
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                />
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            {formData.variants.length > 0 && (
              <div className="space-y-2">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span>{variant.type}: {variant.value} - ₹{variant.price}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Tags</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600"
              >
                <FiPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Status</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
                  className="text-secondary focus:ring-secondary"
                />
                <span className="text-slate-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                  className="text-secondary focus:ring-secondary"
                />
                <span className="text-slate-700">Inactive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="out_of_stock"
                  checked={formData.status === 'out_of_stock'}
                  onChange={handleChange}
                  className="text-secondary focus:ring-secondary"
                />
                <span className="text-slate-700">Out of Stock</span>
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="text-secondary focus:ring-secondary"
              />
              <span className="text-slate-700">Featured Product</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </Link>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
