// src/components/FilterBar.jsx
import React, { useState, useEffect } from "react";

export default function FilterBar({ filter, onFilter }) {
  const [local, setLocal] = useState({
    category:   filter.category   ?? "All",
    term:       filter.term       ?? "",
    priceRange: filter.priceRange ?? "all",
    size:       filter.size       ?? "all",
    color:      filter.color      ?? "all",
    sort:       filter.sort       ?? "default",
  });

  useEffect(() => {
    onFilter(local);
  }, [local]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-wrapper mb-8 overflow-x-auto">
      <div className="inline-flex items-center bg-white shadow-sm rounded-xl p-4 gap-4 min-w-max">
        {/* Search */}
        <input
          type="text"
          name="term"
          value={local.term}
          onChange={handleChange}
          placeholder="Search products..."
          className="flex-shrink-0 w-48 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        />

        {/* Category */}
        <select
          name="category"
          value={local.category}
          onChange={handleChange}
          className="flex-shrink-0 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
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
          className="flex-shrink-0 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="all">All prices</option>
          <option value="0-30">Under $30</option>
          <option value="30-50">$30 - $50</option>
          <option value="50-9999">Over $50</option>
        </select>

        {/* Size */}
        <select
          name="size"
          value={local.size}
          onChange={handleChange}
          className="flex-shrink-0 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="all">All sizes</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

        {/* Color */}
        <select
          name="color"
          value={local.color}
          onChange={handleChange}
          className="flex-shrink-0 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="all">All colors</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
        </select>

        {/* Sort */}
        <select
          name="sort"
          value={local.sort}
          onChange={handleChange}
          className="flex-shrink-0 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
      </div>
    </div>
  );
}
