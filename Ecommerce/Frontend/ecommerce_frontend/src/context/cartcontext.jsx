import { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product_id, quantity = 1) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.product_id === product_id);
      if (exists) {
        return prev.map(item =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success('Product added to cart!');

      return [...prev, { product_id, quantity }];
    });
  };
  const UpdateQuantity = (product_id, quantity) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.product_id === product_id);
      if (exists) {
        return prev.map(item =>
          item.product_id === product_id
            ? { ...item, quantity }
            : item
        );
      }
      return [...prev, { product_id, quantity }];
    });
  };

const removeFromCart = (product_id) => {
  setCartItems(prev =>
    prev.flatMap(item => {
      if (item.product_id === product_id) {
        // If quantity is more than 1, decrement it
        if (item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        // If quantity is 1, remove the item (return empty array)
        return [];
      }
      // For all other items, keep them as they are
      return item;
    })
  );
};


  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart , UpdateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
