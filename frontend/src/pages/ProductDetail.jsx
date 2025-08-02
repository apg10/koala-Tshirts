// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize,  setSelectedSize]  = useState("");
  const [quantity,     setQuantity]       = useState(1);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
    fetch(`${API}/products/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setProduct(data);
        // Preseleccionar primera opción si existe
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        if (data.sizes?.length)  setSelectedSize(data.sizes[0]);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error)   return <p className="text-center py-8 text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center py-8">Product not found.</p>;

  const stock = product.stock ?? 0;
  const canAdd = stock > 0 && selectedColor && selectedSize;

  return (
    <div className="page-wrapper py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Catalog
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagen del producto */}
        <div className="lg:w-1/2">
          <img
            src={`${import.meta.env.VITE_API_URL || ""}${product.image}`}
            alt={`Product photo: ${product.name}, available in colors: ${product.colors?.join(", ")}`}
            className="w-full rounded-lg shadow mb-4"
          />
        </div>

        {/* Detalles y controles */}
        <div className="lg:w-1/2 flex flex-col">
          <h1
            className="text-3xl font-bold text-gray-800 mb-4"
            aria-label={`Details for product ${product.name}`}
          >
            {product.name}
          </h1>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <span className="text-2xl font-semibold text-primary mb-6">
            ${Number(product.price).toFixed(2)}
          </span>

          {/* Selector de color */}
          {product.colors && (
            <div className="mb-4">
              <label htmlFor="color-select" className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select
                id="color-select"
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              >
                {product.colors.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Selector de talla */}
          {product.sizes && (
            <div className="mb-4">
              <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                required
              >
                {product.sizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Control de cantidad y Stock */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              aria-label="Increase quantity"
            >
              +
            </button>
            <span className="text-sm text-gray-500 ml-auto">
              In stock: <strong>{stock}</strong>
            </span>
          </div>

          {/* Botón Add to Cart */}
          <button
            onClick={() =>
              addToCart({
                productId: product.id,
                name:      product.name,
                price:     product.price,
                color:     selectedColor,
                size:      selectedSize,
                qty:       quantity,
              })
            }
            disabled={!canAdd}
            className="w-full lg:w-auto bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition disabled:opacity-50"
            aria-label="Add to cart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
