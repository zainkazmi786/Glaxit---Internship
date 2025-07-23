import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartcontext';
import { TrashIcon } from '@heroicons/react/24/outline';
import CheckoutForm from '../components/CheckoutForm';

const CartPage = () => {
  const { cartItems, removeFromCart, UpdateQuantity, clearCart } = useCart();
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      console.log("cartitems  : ", cartItems)
      if (cartItems.length === 0) return;

      const ids = cartItems.map(item => item.product_id);
      try {
        const res = await fetch(`${"http://127.0.0.1:3000"}/api/products/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids })
        });
        const data = await res.json();
        console.log("Fetched product details in cart page:", data);
        // Map products by id for easy access
        const productMap = {};
        data.forEach(p => (productMap[p._id] = p));
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
      <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">Your Cart</h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-12 text-center">
            <div className="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-600 text-base sm:text-lg mb-4">Your cart is currently empty</p>
              <p className="text-gray-500 text-sm sm:text-base mb-6">Looks like you haven't added any products to your cart yet.</p>
            </div>
            <Link 
              to="/shop" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">Your Cart</h1>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6 sm:mb-10"></div>
        
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const product = products[item.product_id];
                    if (!product) return null;
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
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
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

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {cartItems.map((item) => {
                const product = products[item.product_id];
                if (!product) return null;
                return (
                  <div key={item.product_id} className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="min-w-0 flex-1 pr-2">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 mb-1">
                              {product.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-indigo-600">{product.brand}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-red-500 hover:text-red-700 transition p-1 flex-shrink-0"
                            aria-label={`Remove ${product.title} from cart`}
                          >
                            <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                        
                        {/* Price and Total Row */}
                        <div className="flex justify-between items-center text-sm mb-3">
                          <span className="text-gray-600">Price: <span className="font-medium text-gray-900">${product.price.toFixed(2)}</span></span>
                          <span className="font-bold text-gray-900">${(product.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                              className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 transition text-sm"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="px-3 sm:px-4 py-1 font-medium text-sm">{item.quantity}</span>
                            <button
                              className="px-2 sm:px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 transition text-sm"
                              onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:justify-between">
              <Link 
                to="/shop" 
                className="px-4 sm:px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
              <button 
                onClick={clearCart}
                className="px-4 sm:px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                Clear Cart
              </button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="xl:w-96 lg:w-80">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 pb-4 border-b">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 sm:pt-4 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-base sm:text-lg">Total</span>
                    <span className="font-bold text-lg sm:text-xl text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Tax included if applicable</p>
                </div>
              </div>
              
              <CheckoutForm cart={cartItems} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;