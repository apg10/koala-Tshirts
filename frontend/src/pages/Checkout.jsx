import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[CHECKOUT] Entered checkout page.");
    console.log("[CHECKOUT] Cart contents:", cartItems);
  }, [cartItems]);

  const handleConfirm = () => {
    console.log("[CHECKOUT] Purchase confirmed.");
    console.log("[CHECKOUT] Total: $", total.toFixed(2));
    clearCart();
    navigate("/confirmation");
  };

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item) => (
              <li key={item.id} className="py-2 flex justify-between text-sm">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <p className="text-lg font-bold mb-4">Total: ${total.toFixed(2)}</p>

          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Confirm Purchase
          </button>
        </>
      )}
    </section>
  );
}
