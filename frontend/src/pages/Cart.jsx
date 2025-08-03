import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, updateItemQty, removeItem } = useCart();

  const items = cartItems.map(item => ({
    id: item.id ?? item.product_id,
    name: item.product?.name ?? item.name,
    price: Number(item.product?.price ?? item.price),
    qty: item.quantity ?? item.qty
  }));

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const taxRate = 0.1;
  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return (
    <section className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Product</th>
                <th className="text-right p-2 border-b">Price</th>
                <th className="text-center p-2 border-b">Quantity</th>
                <th className="text-right p-2 border-b">Total</th>
                <th className="p-2 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="p-2 border-b">{item.name}</td>
                  <td className="p-2 text-right border-b">${item.price.toFixed(2)}</td>
                  <td className="p-2 text-center border-b">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={e => updateItemQty(item.id, Number(e.target.value))}
                      className="w-16 text-center border rounded"
                    />
                  </td>
                  <td className="p-2 text-right border-b">
                    ${(item.price * item.qty).toFixed(2)}
                  </td>
                  <td className="p-2 text-center border-b">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right space-y-2">
            <p>
              Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </p>
            <p>
              Tax ({taxRate * 100}%): <span className="font-semibold">${tax.toFixed(2)}</span>
            </p>
            <p>
              Total: <span className="font-semibold">${total.toFixed(2)}</span>
            </p>
          </div>

          <div className="text-right mt-6">
            <Link to="/checkout" className="btn btn-primary">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
