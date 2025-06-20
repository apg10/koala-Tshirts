// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems]       = useState([]);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading]           = useState(false);

  // Al montar, obtiene el carrito del backend
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/cart");
      setCartItems(res.data.items);
    } catch (err) {
      console.error(err);
      setNotification({ text: "Could not load cart." });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    setLoading(true);
    try {
      const res = await apiClient.post("/cart/items", {
        product_id: product.id,
        quantity: 1,
      });
      setCartItems(res.data.items);
      setNotification({ text: "Added to cart!" });
    } catch (err) {
      console.error(err);
      setNotification({ text: "Could not add to cart." });
    } finally {
      setLoading(false);
    }
  };

  const updateItemQty = async (itemId, qty) => {
    setLoading(true);
    try {
      const res = await apiClient.patch(`/cart/items/${itemId}`, {
        quantity: qty,
      });
      setCartItems(res.data.items);
      setNotification({ text: "Cart updated." });
    } catch (err) {
      console.error(err);
      setNotification({ text: "Could not update item." });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const res = await apiClient.delete(`/cart/items/${itemId}`);
      setCartItems(res.data.items);
      setNotification({ text: "Item removed." });
    } catch (err) {
      console.error(err);
      setNotification({ text: "Could not remove item." });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await apiClient.delete("/cart");
      setCartItems([]);
      setNotification({ text: "Cart cleared." });
    } catch (err) {
      console.error(err);
      setNotification({ text: "Could not clear cart." });
    } finally {
      setLoading(false);
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
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
