import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import placeholder from "../assets/placeholder.png";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { id, name, price, image, color, size } = product ?? {};

  const stock = Number(product?.stock ?? 0);
  const inStock = stock > 0;

  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:8000")
    .replace(/\/$/, "")
    .replace(/\/api$/, "");
  let src;
  if (!image) {
    src = placeholder;
  } else if (typeof image === "string" && image.startsWith("/")) {
    src = `${apiBase}${image}`;
  } else if (typeof image === "string" && /^https?:\/\//.test(image)) {
    src = image;
  } else {
    src = `${apiBase}/static/products/${image}`;
  }

  return (
    <article className="rounded-2xl overflow-hidden flex flex-col h-full max-w-[360px] w-full mx-auto shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${id}`} className="block relative w-full">
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {!inStock && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center text-sm font-semibold text-gray-700">
              Out of stock
            </div>
          )}
          <img
            src={src}
            alt={name}
            onError={(e) => (e.currentTarget.src = placeholder)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${id}`} className="hover:underline">
          <h2 className="text-base font-semibold mb-1 line-clamp-2">{name}</h2>
        </Link>

        <p className="text-xs text-gray-500 mb-1">{color ?? "N/A"} – Size {size ?? "N/A"}</p>
        <p className="text-[11px] text-gray-400 mb-4">{inStock ? `In stock: ${stock}` : "Out of stock"}</p>

        <div className="mt-auto flex gap-2">
          <span className="block font-bold text-gray-900 text-xl mb-2">{price?.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            disabled={!inStock}
            aria-disabled={!inStock}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium border ${inStock ? "border-black bg-transparent text-black hover:bg-black hover:text-white" : "border-gray-400 bg-transparent text-gray-400 cursor-not-allowed"}`}
            title={inStock ? "Add to Cart" : "Out of Stock"}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <Link to={`/product/${id}`} className="px-4 py-2 rounded-full border text-sm font-medium hover:bg-gray-50 transition">Details</Link>
        </div>
      </div>
    </article>
  );
}
