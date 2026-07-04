import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("voltstride_cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("voltstride_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product === product._id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id && i.size === size ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          size,
          qty,
          maxStock: product.countInStock,
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) => prev.filter((i) => !(i.product === productId && i.size === size)));
  };

  const updateQty = (productId, size, qty) => {
    setCartItems((prev) =>
      prev.map((i) => (i.product === productId && i.size === size ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const itemsCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const itemsPrice = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, itemsCount, itemsPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
