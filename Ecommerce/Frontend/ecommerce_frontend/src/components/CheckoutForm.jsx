import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CheckoutForm = ({ cart }) => {
  const navigate = useNavigate();
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleCheckout = async () => {
    // Validate email
    if (!customerEmail || !customerEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate cart
    if (!cart || cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        customer_email: customerEmail,
        items: cart,
      };

      const response = await fetch('http://localhost:5000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      console.log('Order response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderCreated(true);
      setOrderDetails(data);
      
      
      // Clear cart from localStorage after successful order
      localStorage.removeItem('cart');
      navigate(`/checkout/${data.id}`);
    } catch (err) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      {orderCreated ? (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">Order Created Successfully!</h3>
          <p>Order ID: {orderDetails?.id || 'N/A'}</p>
          {/* You can display more order details here */}
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              {error}
            </div>
          )}

          <label htmlFor="email" className="block mb-1 font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="you@example.com"
            disabled={loading}
          />

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutForm;
