import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition flex flex-col">
      {/* Imagen en contenedor cuadrado */}
      <div className="w-full h-[250px] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Detalles */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
          <p className="text-sm text-gray-500">
            {product.color} – Size {product.size}
          </p>
          <p className="text-blue-600 font-semibold mt-2">${product.price}</p>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
