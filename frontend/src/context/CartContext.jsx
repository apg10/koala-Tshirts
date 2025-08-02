// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems]       = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading]           = useState(false);

  const GUEST_KEY = "koala_guest_cart";

  useEffect(() => {
    if (user) {
      localStorage.removeItem(GUEST_KEY);
      fetchCartFromServer();
    } else {
      const stored = localStorage.getItem(GUEST_KEY);
      setCartItems(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  const fetchCartFromServer = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCartItems(res.data.items);
    } catch {
      setNotification({ text: "Could not load cart." });
      setTimeout(() => setNotification(null), 2500);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      // lógica para guest cart…
      const updated = [...cartItems];
      // …implementa guest logic aquí si deseas
      setCartItems(updated);
      localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
      setNotification({ text: "Added to cart!" });
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/cart/items", {
        product_id: product.id,
        qty: 1,
      });
      setCartItems(res.data.items);
      setNotification({ text: "Added to cart!" });
    } catch {
      setNotification({ text: "Could not add to cart." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const updateItemQty = async (itemId, qty) => {
    if (!user) {
      // lógica guest…
      return;
    }
    setLoading(true);
    try {
      const res = await api.patch(
        `/cart/items/${itemId}`,
        null,
        { params: { qty } }
      );
      setCartItems(res.data.items);
      setNotification({ text: "Cart updated." });
    } catch {
      setNotification({ text: "Could not update item." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const removeItem = async (itemId) => {
    if (!user) {
      // lógica guest…
      return;
    }
    setLoading(true);
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      setCartItems(res.data.items);
      setNotification({ text: "Item removed." });
    } catch {
      setNotification({ text: "Could not remove item." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const clearCart = async () => {
    if (!user) {
      // lógica guest…
      const empty = [];
      setCartItems(empty);
      localStorage.setItem(GUEST_KEY, JSON.stringify(empty));
      setNotification({ text: "Cart cleared." });
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    setLoading(true);
    try {
      const res = await api.delete("/cart");
      setCartItems(res.data.items);
      setNotification({ text: "Cart cleared." });
    } catch {
      setNotification({ text: "Could not clear cart." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        notification,
        addToCart,
        updateItemQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
