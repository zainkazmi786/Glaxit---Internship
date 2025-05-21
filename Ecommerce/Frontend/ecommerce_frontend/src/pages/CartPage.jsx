import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartcontext';
import { TrashIcon } from '@heroicons/react/24/outline';
import CheckoutForm from '../components/CheckoutForm';
const CartPage = () => {
const { cartItems, removeFromCart  , UpdateQuantity, clearCart } = useCart();
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

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    UpdateQuantity(id, newQuantity);
  };
if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Your Cart</h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 text-lg mb-4">Your cart is currently empty</p>
              <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            </div>
            <Link 
              to="/shop" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Your Cart</h1>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-10"></div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="">
            <div className="bg-white rounded-xl shadow-lg ">
              <table className="min-w-full divide-y divide-gray-200 table-fixed overflow-hidden rounded-xl">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const product = products[item.product_id];
                  if (!product) return null; // skip if product data hasn't loaded yet
                  return (
                    <tr key={item.product_id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-contain p-2"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.title}
                            </div>
                            <div className="text-xs text-indigo-600">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center border rounded-lg overflow-hidden w-max">
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-medium">{item.quantity}</span>
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          ${(product.price * item.quantity).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-20">
                        <div className="flex justify-end">
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-red-500 hover:text-red-700 transition p-1"
                            aria-label={`Remove ${product.title} from cart`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Link 
                to="/shop" 
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
              <button 
                onClick={clearCart}
                className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg shadow-sm transition flex items-center gap-2"
              >
                <TrashIcon className="h-5 w-5" />
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-2/5">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-4 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Tax included if applicable</p>
                </div>
              </div>
              
              <CheckoutForm cart={cartItems} />
              
              <div className="mt-8 pt-6 border-t">
                <div className="text-sm text-gray-500 mb-3">We accept:</div>
                <div className="flex space-x-3">
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                  <div className="h-8 w-12 bg-gray-200 rounded"></div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  Your payment information is processed securely. We do not store credit card details nor have access to your credit card information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;