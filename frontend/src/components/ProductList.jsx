// src/components/ProductList.jsx
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const endpoint = category
          ? `http://localhost:8000/products?category=${category}`
          : `http://localhost:8000/products`;
        const response = await fetch(endpoint);
        const data = await response.json();
        setProducts(data);
        console.log("[FETCH] Products loaded:", data);
      } catch (error) {
        console.error("[ERROR] Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
