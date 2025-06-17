import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, clearCart, removeItem, total } = useCart();

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-6">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.color || "N/A"} – Size {item.size || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.qty} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-blue-600 font-semibold">
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

          <div className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4">
            <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Clear Cart
              </button>
              <a
                href="/checkout"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Checkout
              </a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
