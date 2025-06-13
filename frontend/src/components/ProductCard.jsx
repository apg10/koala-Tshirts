import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white shadow-sm hover:shadow-md rounded-2xl overflow-hidden transition-all duration-300 border border-gray-200">
      {/* Imagen */}
      <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>     

      {/* Contenido */}
      <div className="p-5 flex flex-col justify-between h-[200px]">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-sm text-gray-500">{product.color} – Size {product.size}</p>
        </div>

        <div className="flex justify-between items-end mt-4">
          <span className="text-blue-600 font-bold text-base">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
