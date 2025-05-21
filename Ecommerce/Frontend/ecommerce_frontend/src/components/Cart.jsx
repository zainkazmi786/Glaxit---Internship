import { useCart } from "../context/cartcontext";
import { useEffect, useState } from "react";
import { TrashIcon } from '@heroicons/react/24/outline';


const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("cartitems  : " , cartItems)
      if (cartItems.length === 0) return;

      const ids = cartItems.map(item => item.product_id);
      try {
        const res = await fetch(`${"http://127.0.0.1:5000"}/api/products/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids })
        });
        const data = await res.json();
        console.log("Fetched product details:", data);
        // Map products by id for easy access
        const productMap = {};
        data.forEach(p => (productMap[p._id.$oid] = p));
        setProducts(productMap);
        console.log("Fetched products:", productMap);
      } catch (err) {
        console.error("Failed to fetch product details", err);
      }
    };

    fetchDetails();
  }, [cartItems]);
  const total = cartItems.reduce((acc, item) => {
    const product = products[item.product_id];
    return product ? acc + item.quantity * product.price : acc;
  }, 0);


  return (
    <div className="w-80 bg-white shadow-lg rounded-md p-4 max-h-96 overflow-y-auto">
  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Shopping Cart</h3>

  {cartItems.length === 0 ? (
    <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
  ) : (
    <ul className="space-y-4">
      {cartItems.map(item => {
        const product = products[item.product_id];
        if (!product) return null;

        return (
          <li
            key={item.product_id}
            className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-14 h-14 object-contain rounded-md bg-gray-50 p-1"
            />

            <div className="flex-1 ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              <p className="text-sm text-indigo-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
            </div>

            <button
              onClick={() => removeFromCart(item.product_id, 1)}
              aria-label={`Remove ${product.title} from cart`}
              className="text-gray-400 hover:text-red-600 transition p-1 rounded"
              title="Remove item"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </li>
        );
      })}
    </ul>
  )}

  <div className="mt-6 border-t pt-4 text-right">
    <span className="text-base font-semibold text-gray-900">
      Total: ${total.toFixed(2)}
    </span>
  </div>
</div>

  );
};

export default Cart;
