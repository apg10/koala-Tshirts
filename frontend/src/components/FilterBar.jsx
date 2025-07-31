import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterBar({ onFilter }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [term, setTerm] = useState(searchParams.get("search") || "");

  // Actualiza la URL y dispara el callback de filtro
  useEffect(() => {
    const params = {};
    if (category && category !== "All") params.category = category;
    if (term) params.search = term;
    setSearchParams(params);
    onFilter({ category, term });
  }, [category, term]);

  return (
    <div className="page-wrapper mb-8">
      <div className="flex flex-col sm:flex-row items-center bg-white shadow-sm rounded-xl p-4 gap-4">
        {/* Selector de categoría */}
        <div className="flex-1 sm:flex-none">
          <label className="sr-only">Filter by category</label>
          <select
            className="w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Hoodies">Hoodies</option>
          </select>
        </div>

        {/* Input de búsqueda */}
        <div className="flex-1">
          <label className="sr-only">Search products</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search products..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
