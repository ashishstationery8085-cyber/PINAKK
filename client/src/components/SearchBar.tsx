'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const categories = ['All Categories', 'Stationery', 'Perfumes', 'Gifts', 'Office'];

const SearchBar = ({ onSearch }: { onSearch: (value: string) => void }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(categories[0]);

  return (
    <div className="flex w-full max-w-4xl flex-wrap items-center gap-3 rounded-full bg-white/95 p-3 shadow-xl ring-1 ring-slate-200">
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary"
      >
        {categories.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for products, brands and more"
        className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
      />
      <button
        type="button"
        onClick={() => onSearch(query)}
        className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orange-600"
      >
        <FiSearch /> Search
      </button>
    </div>
  );
};

export default SearchBar;
