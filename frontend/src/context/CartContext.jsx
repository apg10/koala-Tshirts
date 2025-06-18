import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState("");

  const addToCart = (product) => {
    console.log(`[Cart] Attempting to add: ${product.name}`);

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);

      if (existing) {
        console.log(`[Cart] ${product.name} already in cart. Increasing quantity.`);
        setNotification(`${product.name} quantity updated`);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        console.log(`[Cart] ${product.name} added to cart.`);
        setNotification(`${product.name} added to cart`);
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  const removeItem = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    if (item) {
      setNotification(`${item.name} removed from cart`);
      console.log(`[Cart] Removing item: ${item.name}`);
    }
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    console.log("[Cart] Clearing all items from cart.");
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

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
