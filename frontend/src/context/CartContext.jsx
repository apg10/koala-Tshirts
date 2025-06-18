import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export function useCart() { return useContext(CartContext); }

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null); // { id, text }

  /** Utilidad interna para disparar toast */
  const notify = (text) => {
  const newMsg = { id: Date.now(), text };
  console.log("[CartContext] notify →", newMsg);   // 👈 LOG
  setNotification(newMsg);
};

  /* ───────── acciones carrito ───────── */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        notify(`${product.name} quantity updated`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      notify(`${product.name} added to cart`);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeItem = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) notify(`${item.name} removed from cart`);
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => {
    notify("Cart cleared");
    setCartItems([]);
  };

  /* Totales */
  const total     = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty  = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        clearCart,
        total,
        totalQty,
        notification,   // <- se expone como objeto {id,text}
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
