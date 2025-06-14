import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.015] transition-transform duration-300 border border-gray-200 max-w-[340px] w-full mx-auto">
      {/* Imagen */}
      <div className="w-full aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[250px] object-cover"
        />        
      </div>      

      {/* Contenido */}
      <div className="p-4 flex flex-col justify-between h-[180px]">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-sm text-gray-500">
            {product.color} – Size {product.size}
          </p>
        </div>

        <div className="flex justify-between items-end mt-3">
          <span className="text-blue-600 font-bold text-base">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h14l-1.35 6.5a1 1 0 01-.98.75H6.32a1 1 0 01-.98-.8L4 4H2" />
            </svg>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
