// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PropTypes from "prop-types";
import placeholder from "../assets/placeholder.png";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { id, name, price, image, color, size } = product;

  /* ───────── Build absolute image URL ─────────
     1. Usa VITE_API_URL (backend) o, si no existe, fallback a http://localhost:8000
     2. Si `image` ya es URL absoluta (http/https) la usa tal cual.
     3. Si `image` empieza por “/”, la concatena al backend.
     4. Si es solo el nombre del archivo, la convierte en
        `${backend}/static/products/<nombre>`.                     */
  const apiUrl =
    (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

  const imageSrc = image
    ? /^https?:\/\//i.test(image)            // Caso 2
      ? image
      : image.startsWith("/")                // Caso 3
        ? `${apiUrl}${image}`
        : `${apiUrl}/static/products/${image}` // Caso 4
    : placeholder;                           // Sin imagen → placeholder

  const handleAdd = () => addToCart(product);

  return (
    <div className="product-card group bg-white w-full rounded-2xl shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col h-full">
      {/* Imagen + link */}
      <div className="overflow-hidden rounded-t-2xl h-64">
        <Link to={`/product/${id}`}>
          <img
            src={imageSrc}
            alt={name}
            onError={(e) => (e.currentTarget.src = placeholder)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <Link to={`/product/${id}`} className="hover:underline">
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          </Link>
          <p className="text-sm text-gray-500">
            {color ?? "N/A"} &ndash; Size {size ?? "N/A"}
          </p>
        </div>

        {/* Precio + botón */}
        <div className="mt-4">
          <span className="block text-primary font-bold text-base mb-2">
            ${Number(price).toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            className="w-full py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id:    PropTypes.number.isRequired,
    name:  PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
    color: PropTypes.string,
    size:  PropTypes.string,
  }).isRequired,
};
