import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export function useCart() { return useContext(CartContext); }

const STORAGE_KEY = "koala_cart";

export function CartProvider({ children }) {
  /* ───────── cargar carrito almacenado ───────── */
  const initialCart = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const [cartItems, setCartItems] = useState(initialCart);
  const [notification, setNotification] = useState(null); // { id, text }

  const notify = (text) =>
    setNotification({ id: Date.now(), text });

  /* ───────── acciones carrito ───────── */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        notify(`${product.name} quantity updated`);
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      notify(`${product.name} added to cart`);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) notify(`${item.name} removed`);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    notify("Cart cleared");
    setCartItems([]);
  };

  /* ───────── guardar en localStorage ───────── */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /* Totales */
  const total    = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        clearCart,
        total,
        totalQty,
        notification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
