import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems]       = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading]           = useState(false);

  const GUEST_KEY = "koala_guest_cart";

  // Load cart on mount or when user changes
  useEffect(() => {
    if (user) {
      localStorage.removeItem(GUEST_KEY);
      fetchCartFromServer();
    } else {
      const stored = localStorage.getItem(GUEST_KEY);
      setCartItems(stored ? JSON.parse(stored) : []);
    }
  }, [user]);

  const persistGuestCart = (items) => {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  };

  const fetchCartFromServer = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/cart");
      setCartItems(res.data.items);
    } catch {
      setNotification({ text: "Could not load cart." });
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (product) => {
    console.log("[CartContext] addToCart called; user:", user, "current cartItems:", cartItems);
    if (!user) {
      const exists = cartItems.find((i) => i.id === product.id);
      const updated = exists
        ? cartItems.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...cartItems, { ...product, qty: 1 }];
      setCartItems(updated);
      persistGuestCart(updated);
      setNotification({ text: "Added to cart!" });
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post("/cart/items", {
        product_id: product.id,
        quantity: 1,
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

  // Update item quantity
  const updateItemQty = async (itemId, qty) => {
    if (qty < 1) return;
    if (!user) {
      const updated = cartItems.map((i) =>
        i.id === itemId ? { ...i, qty } : i
      );
      setCartItems(updated);
      persistGuestCart(updated);
      setNotification({ text: "Cart updated." });
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.patch(`/cart/items/${itemId}`, {
        quantity: qty,
      });
      setCartItems(res.data.items);
      setNotification({ text: "Cart updated." });
    } catch {
      setNotification({ text: "Could not update item." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    if (!user) {
      const updated = cartItems.filter((i) => i.id !== itemId);
      setCartItems(updated);
      persistGuestCart(updated);
      setNotification({ text: "Item removed." });
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.delete(`/cart/items/${itemId}`);
      setCartItems(res.data.items);
      setNotification({ text: "Item removed." });
    } catch {
      setNotification({ text: "Could not remove item." });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) {
      setCartItems([]);
      persistGuestCart([]);
      setNotification({ text: "Cart cleared." });
      setTimeout(() => setNotification(null), 2500);
      return;
    }
    setLoading(true);
    try {
      await apiClient.delete("/cart");
      setCartItems([]);
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
