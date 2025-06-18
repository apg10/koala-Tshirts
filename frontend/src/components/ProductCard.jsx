import { useCart } from "../context/CartContext";
import PropTypes from "prop-types";

// …imports y PropTypes quedan igual
export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const fullImageUrl = product.image.startsWith("/")
    ? `${import.meta.env.VITE_API_URL}${product.image}`
    : product.image;

  return (
    <div className="group bg-white w-full rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col h-full">
      {/* Imagen con altura fija */}
      <div className="overflow-hidden rounded-t-2xl h-64">
        <img
          src={fullImageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500">
            {(product.color ?? "N/A")} – Size {(product.size ?? "N/A")}
          </p>
        </div>

        {/* Precio + botón ancho */}
        <div className="mt-3">
          <span className="block text-primary font-bold text-base mb-2">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition"
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
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    image: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
  }).isRequired,
};
