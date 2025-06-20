// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API_URL}/products/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-8">Loading…</p>;
  if (error)   return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center py-8">Product not found.</p>;

  return (
    <div className="page-wrapper py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Catalog
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagen principal o galería */}
        <div className="lg:w-1/2">
          <img
            src={`${import.meta.env.VITE_API_URL}${product.image}`}
            alt={product.name}
            className="w-full rounded-lg shadow mb-4"
          />
          {/* Si tuvieras varias imágenes, las podrías mapear aquí */}
        </div>

        {/* Detalles */}
        <div className="lg:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Precio */}
          <span className="text-2xl font-semibold text-primary mb-6">
            ${Number(product.price).toFixed(2)}
          </span>

          {/* Selectores (estáticos por ahora) */}
          <div className="flex gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select className="border rounded px-3 py-2 w-full">
                <option value={product.color || ""}>
                  {product.color || "Default"}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select className="border rounded px-3 py-2 w-full">
                <option value={product.size || ""}>
                  {product.size || "Default"}
                </option>
              </select>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addToCart(product)}
            className="w-full lg:w-auto bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
