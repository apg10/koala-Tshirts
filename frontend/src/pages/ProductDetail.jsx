// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";

const buildImageSrc = (path) => {
  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
  if (!path) return "/assets/placeholder.png";
  if (path.startsWith("/")) return `${apiBase}${path}`;
  if (/^https?:\/\//.test(path)) return path;
  return `${apiBase}/static/products/${path}`;
};

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
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        if (data.sizes?.length)  setSelectedSize(data.sizes[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (error)
    return (
      <p className="text-center py-8 text-red-500">
        Error: {error}
      </p>
    );
  if (!product)
    return (
      <p className="text-center py-8">
        Product not found.
      </p>
    );

  const stock = product.stock ?? 0;
  const canAdd = stock > 0 && selectedColor && selectedSize;

  return (
    <div className="page-wrapper py-8">
      <Link
        to="/"
        className="inline-block mb-6 text-sm font-medium text-primary hover:underline"
      >
        ← Back to Catalog
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image */}
        <div className="lg:w-1/2 flex-shrink-0">
          <div className="w-full rounded-xl overflow-hidden shadow-card">
            <img
              src={buildImageSrc(product.image)}
              alt={`Photo of ${product.name}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/placeholder.png";
              }}
              className="w-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="lg:w-1/2 flex flex-col">
          <h1
            className="text-4xl font-bold text-gray-900 mb-3"
            aria-label={`Details for product ${product.name}`}
          >
            {product.name}
          </h1>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-extrabold text-primary">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Color selector */}
          {product.colors && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Color
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      selectedColor === c
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:shadow-sm"
                    }`}
                    aria-pressed={selectedColor === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Size
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      selectedSize === s
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:shadow-sm"
                    }`}
                    aria-pressed={selectedSize === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + stock */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="inline-flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="px-3 py-2 disabled:opacity-50"
              >
                −
              </button>
              <div className="px-4 py-2 font-medium" aria-live="polite">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                disabled={quantity >= stock}
                aria-label="Increase quantity"
                className="px-3 py-2 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className="text-sm text-gray-500">
              In stock: <span className="font-semibold">{stock}</span>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mb-4">
            <button
              onClick={() =>
                addToCart({
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  color: selectedColor,
                  size: selectedSize,
                  qty: quantity,
                })
              }
              disabled={!canAdd}
              className="w-full lg:w-auto flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:brightness-95 active:scale-95 transition disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
              aria-label="Add to cart"
            >
              Add to Cart
            </button>
          </div>

          {/* Stock / status */}
          {stock === 0 && (
            <div className="text-sm text-red-600 font-medium mt-1">
              Out of stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
