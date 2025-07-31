// src/components/ProductList.jsx
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const endpoint = category
      ? `${API}/products?category=${encodeURIComponent(category)}`
      : `${API}/products`;
    fetch(endpoint)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setProducts)
      .catch(err => console.error("[ERROR] Failed to fetch products:", err));
  }, [category]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
