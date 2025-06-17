import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    console.log(`[Cart] Attempting to add: ${product.name}`);

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);

      if (existing) {
        console.log(`[Cart] ${product.name} already in cart. Increasing quantity.`);
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        console.log(`[Cart] ${product.name} added to cart.`);
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  const removeItem = (productId) => {
    console.log(`[Cart] Removing item with ID: ${productId}`);
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    console.log("[Cart] Clearing all items from cart.");
    setCartItems([]);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
