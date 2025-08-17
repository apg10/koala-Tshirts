// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../utils/url";
import placeholder from "../assets/placeholder.png";

const SIZES  = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Red", "Blue", "Yellow"];

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [p, setP]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState(null);

  const [size, setSize]   = useState("M");
  const [color, setColor] = useState("Black");
  const [qty, setQty]     = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((r) => {
        setP(r.data);
        if (r.data?.size)  setSize(r.data.size);
        if (r.data?.color) setColor(r.data.color);
      })
      .catch((e) => setErr(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-16">Loading…</div>;
  if (err)     return <p className="text-center text-red-600">Error: {err}</p>;
  if (!p)      return null;

  const img = resolveImageUrl(p.image) || placeholder;
  const stock = Number(p.stock ?? 0);
  const inStock = stock > 0;

  return (
    <div className="page-wrapper grid md:grid-cols-2 gap-10">
      <img
        src={img}
        alt={p.name}
        className="w-full rounded-xl object-cover aspect-square"
        onError={(e) => (e.currentTarget.src = placeholder)}
      />

      <div>
        <h1 className="text-3xl font-bold mb-2">{p.name}</h1>
        <p className="text-gray-700 mb-6">{p.description || "No description available."}</p>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <label className="w-24 font-medium">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-24 font-medium">Color</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="w-24 font-medium">Quantity</label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              className="border rounded-lg px-3 py-2 w-24"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ${Number(p.price ?? 0).toFixed(2)}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              {inStock ? `In stock: ${stock}` : "Out of stock"}
            </p>
          </div>

          <button
            onClick={() => addToCart({ ...p, size, color, qty })}
            disabled={!inStock}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold
                       hover:bg-blue-700 active:scale-95 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
            title={inStock ? "Add to Cart" : "Out of Stock"}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
