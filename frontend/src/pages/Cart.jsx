// src/pages/Cart.jsx
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const {
    cartItems,
    updateItemQty,
    removeItem,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  // Cálculo de totales
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.1; // 10%
  const total = subtotal + tax;

  return (
    <div className="page-wrapper py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty. <Link to="/" className="text-primary hover:underline">Go shopping</Link>
        </p>
      ) : (
        <>
          {/* Lista de ítems */}
          <ul className="divide-y divide-gray-200 mb-8">
            {cartItems.map(item => (
              <li key={item.id} className="py-6 flex items-center gap-6">
                {/* Imagen */}
                <img
                  src={`${import.meta.env.VITE_API_URL || ""}${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Detalles y controles */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500">
                    {item.color || "N/A"} – Size {item.size || "N/A"}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => updateItemQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="px-3">{item.qty}</span>
                    <button
                      onClick={() => updateItemQty(item.id, item.qty + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal y Remove */}
                <div className="text-right space-y-1">
                  <p className="text-xl font-semibold text-gray-800">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Resumen */}
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-right">
              <p>Subtotal: ${subtotal.toFixed(2)}</p>
              <p>Tax (10%): ${tax.toFixed(2)}</p>
              <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
