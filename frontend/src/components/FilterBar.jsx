// src/components/FilterBar.jsx
import React, { useState, useEffect } from "react";

const priceOptions = [
  { label: "All prices", value: "all" },
  { label: "Under $30",  value: "0-30" },
  { label: "$30 - $50",  value: "30-50" },
  { label: "Over $50",   value: "50-9999" },
];

const sizeOptions = [
  { label: "All sizes", value: "all" },
  { label: "XS", value: "XS" },
  { label: "S",  value: "S" },
  { label: "M",  value: "M" },
  { label: "L",  value: "L" },
  { label: "XL", value: "XL" },
];

const colorOptions = [
  { label: "All colors", value: "all" },
  { label: "Black", value: "Black" },
  { label: "White", value: "White" },
  { label: "Red",   value: "Red" },
  { label: "Blue",  value: "Blue" },
];

const sortOptions = [
  { label: "Default",    value: "default" },
  { label: "Price ↑",    value: "price-asc" },
  { label: "Price ↓",    value: "price-desc" },
];

export default function FilterBar({ filter, onFilter }) {
  const [local, setLocal] = useState({
    category:   filter.category   ?? "All",
    term:       filter.term       ?? "",
    priceRange: filter.priceRange ?? "all",
    size:       filter.size       ?? "all",
    color:      filter.color      ?? "all",
    sort:       filter.sort       ?? "default",
  });

  // Notify parent whenever any filter value changes
  useEffect(() => {
    onFilter(local);
  }, [local]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-wrapper mb-8">
      <div className="flex flex-wrap items-center bg-white shadow-sm rounded-xl p-4 gap-4">
        {/* Search */}
        <input
          type="text"
          name="term"
          value={local.term}
          onChange={handleChange}
          placeholder="Search products..."
          className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        />

        {/* Category */}
        <select
          name="category"
          value={local.category}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Categories</option>
          <option value="T-Shirts">T-Shirts</option>
          <option value="Hoodies">Hoodies</option>
        </select>

        {/* Price Range */}
        <select
          name="priceRange"
          value={local.priceRange}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          {priceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Size */}
        <select
          name="size"
          value={local.size}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          {sizeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Color */}
        <select
          name="color"
          value={local.color}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          {colorOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          name="sort"
          value={local.sort}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
