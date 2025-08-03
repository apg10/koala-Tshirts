// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import placeholder from "../assets/placeholder.png";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { id, name, price, image, color, size } = product;

  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");
  let src;
  if (!image) {
    src = placeholder;
  } else if (image.startsWith("/")) {
    src = `${apiBase}${image}`;
  } else if (/^https?:\/\//.test(image)) {
    src = image;
  } else {
    src = `${apiBase}/static/products/${image}`;
  }

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md
                 transition-transform hover:-translate-y-1 flex flex-col
                 max-w-[300px] w-full mx-auto h-full relative"
    >
      {/* badge NEW */}
      <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
        NEW
      </span>

      {/* Imagen */}
      <Link to={`/product/${id}`} className="block overflow-hidden rounded-t-2xl">
        <img
          src={src}
          alt={name}
          onError={e => (e.currentTarget.src = placeholder)}
          className="w-full aspect-square object-cover
                     group-hover:grayscale-0 group-hover:scale-105
                     grayscale transition-transform duration-300 ease-out"
        />
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${id}`} className="hover:underline">
          <h2 className="text-base font-semibold mb-1">{name}</h2>
        </Link>
        <p className="text-xs text-gray-500 mb-4">
          {color ?? "N/A"} &ndash; Size {size ?? "N/A"}
        </p>

        <div className="mt-auto">
          <span className="block font-bold text-blue-600 text-xl mb-2">
            ${Number(price).toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="w-full px-4 py-2 rounded-full bg-blue-600 text-white
                       text-sm font-medium hover:bg-blue-700 active:scale-95
                       transition disabled:opacity-50"
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
