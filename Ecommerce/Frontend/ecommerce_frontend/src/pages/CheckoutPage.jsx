import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const CheckoutPage = () => {
  const { orderId } = useParams();
const [confirmLoading, setConfirmLoading] = useState(false);
const [confirmError, setConfirmError] = useState(null);
const [confirmSuccess, setConfirmSuccess] = useState(null);


const updateCustomerInfo = async () => {
  const res = await fetch(`http://localhost:5000/api/orders/${orderId}/customer-info`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, address }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update customer info');
  }
};
 const handleConfirmOrder = async (paymentMethod) => {
    // Validate mandatory fields
    if (!phone.trim() || !name.trim() || !address.trim()) {
      setConfirmError('Please fill in your name, phone number, and address.');
      return;
    }

    setConfirmLoading(true);
    setConfirmError(null);
    setConfirmSuccess(null);
    await updateCustomerInfo();
    try {
      // Update order status
      const statusRes = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      });
      const statusData = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusData.error || 'Failed to update order status');

      // Update payment method and customer info (phone, name, address)
      const methodRes = await fetch(`http://localhost:5000/api/orders/${orderId}/method`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: paymentMethod,
          phone,
          name,
          address,
        }),
      });
      const methodData = await methodRes.json();
      if (!methodRes.ok) throw new Error(methodData.error || 'Failed to update order details');

      setConfirmSuccess('Order confirmed! Order will be delivered in 2-3 weeks.');
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'online'
const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Load 2Checkout JS library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.2checkout.com/checkout/api/2co.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrder(true);
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch order');
        }
        const data = await res.json();
        setOrder(data);

        // Pre-fill phone, name, address if available in order
        setPhone(data.phone || '');
        setName(data.name || '');
        setAddress(data.address || '');

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOrder(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId,confirmSuccess]);

  // Handle 2Checkout tokenization success
  const successCallback = async (data) => {
    setPaymentLoading(true);
    setPaymentError(null);
    

    try {
      const token = data.response.token.token;

      // Send token and order info to backend
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          token,
          amount: order.total,
        }),
      });

      const paymentResult = await res.json();

      if (!res.ok) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      setPaymentSuccess('Payment processed successfully!');
      setPaymentError(null);
      handleConfirmOrder('online')
    } catch (err) {
      setPaymentError(err.message);
      setPaymentSuccess(null);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle 2Checkout tokenization error
  const errorCallback = (data) => {
    setPaymentError(data.errorMsg || 'Payment tokenization failed');
    setPaymentSuccess(null);
    setPaymentLoading(false);
  };

  // Submit payment form
  const handleOnlinePayment = (e) => {
    e.preventDefault();

    // Basic validation
    if (!cardNumber || !expMonth || !expYear || !cvv || !billingAddress) {
      setPaymentError('Please fill in all payment fields');
      return;
    }

    if (!window.TCO) {
      setPaymentError('2Checkout library not loaded');
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    // Load public key and request token
    window.TCO.loadPubKey('sandbox', () => {
      window.TCO.requestToken(
        successCallback,
        errorCallback,
        {
          sellerId: 'your_merchant_code', // Replace with your merchant code
          publishableKey: 'your_publishable_key', // Replace with your publishable key
          ccNo: cardNumber.replace(/\s+/g, ''),
          cvv,
          expMonth,
          expYear,
          billingAddr: billingAddress,
        }
      );
    });
  };
  if (loadingOrder) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-6 shadow-md max-w-md w-full">
          <p className="font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg p-6 shadow-md max-w-md w-full text-center">
          <p className="font-medium">No order found.</p>
        </div>
      </div>
    );
  }

  if (confirmSuccess) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 border border-indigo-100">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 pb-2 border-b">{confirmSuccess}</h2>
        <div className="mb-6 border p-6 rounded-lg bg-gray-50 shadow-inner">
          <h2 className="font-semibold mb-4 text-lg text-indigo-700">Order Summary</h2>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium text-gray-900">Name:</span> {name}</p>
            <p><span className="font-medium text-gray-900">Phone:</span> {phone}</p>
            <p><span className="font-medium text-gray-900">Address:</span> {address}</p>
            <p><span className="font-medium text-gray-900">Email:</span> {order.customer_email}</p>
            <p><span className="font-medium text-gray-900">Status:</span> 
              <span className="ml-1 text-green-600 font-medium">{order.order_status}</span>
            </p>
            <p><span className="font-medium text-gray-900">Payment Status:</span> {order.payment_status}</p>
            <p><span className="font-medium text-gray-900">Payment Type:</span> {order.payment_type}</p>
            <p><span className="font-medium text-gray-900">Total:</span> 
              <span className="ml-1 text-indigo-700 font-bold">${order.total.toFixed(2)}</span>
            </p>
          </div>

          <h3 className="mt-6 mb-3 font-semibold text-indigo-700">Items:</h3>
          <ul className="space-y-4">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border border-gray-200" />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <div className="flex space-x-4 mt-1 text-sm text-gray-600">
                    <p>Qty: <span className="font-medium">{item.quantity}</span></p>
                    <p>Price: <span className="font-medium">${item.price.toFixed(2)}</span></p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition duration-300 font-medium w-full"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 pb-3 border-b">Checkout - Order {order.order_number}</h1>

      {/* Order Summary */}
      <div className="mb-8 border p-6 rounded-lg bg-gray-50 shadow-sm">
        <h2 className="font-semibold mb-4 text-lg text-indigo-700">Order Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
          <p><span className="font-medium text-gray-900">Email:</span> {order.customer_email}</p>
          <p><span className="font-medium text-gray-900">Status:</span> 
            <span className="ml-1 text-amber-600 font-medium">{order.order_status}</span>
          </p>
          <p><span className="font-medium text-gray-900">Payment Status:</span> {order.payment_status}</p>
          <p><span className="font-medium text-gray-900">Total:</span> 
            <span className="ml-1 text-indigo-700 font-bold">${order.total.toFixed(2)}</span>
          </p>
        </div>

        <h3 className="mt-6 mb-3 font-semibold text-indigo-700">Items:</h3>
        <ul className="space-y-3">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border border-gray-200" />
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <div className="flex space-x-4 mt-1 text-sm text-gray-600">
                  <p>Qty: <span className="font-medium">{item.quantity}</span></p>
                  <p>Price: <span className="font-medium">${item.price.toFixed(2)}</span></p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info Form */}
      <div className="mb-8">
        <h2 className="font-semibold mb-4 text-lg text-indigo-700">Contact Information</h2>
        <form className="space-y-4 max-w-md">
          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              required
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              required
              placeholder="Your contact number"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="address">Address *</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              rows={3}
              required
              placeholder="Your shipping address"
            />
          </div>
        </form>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-8">
        <h2 className="font-semibold mb-4 text-lg text-indigo-700">Select Payment Method</h2>
        <div className="flex space-x-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition duration-200 border-gray-200 flex-1">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 font-medium text-gray-800">Cash on Delivery</span>
          </label>
          <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition duration-200 border-gray-200 flex-1">
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={() => setPaymentMethod('online')}
              className="h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 font-medium text-gray-800">Online Payment</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'online' && (
        <form onSubmit={handleOnlinePayment} className="space-y-4 max-w-md border-t pt-6">
          <h3 className="font-semibold mb-4 text-lg text-indigo-700">Card Information</h3>
            
          {paymentError && (
            <p className="text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200">{paymentError}</p>
          )}
          {paymentSuccess && (
            <p className="text-green-600 font-semibold bg-green-50 p-3 rounded-lg border border-green-200">{paymentSuccess}</p>
          )}

          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="cardNumber">Card Number</label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4111 1111 1111 1111"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              disabled={paymentLoading}
              maxLength={19}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium text-gray-700" htmlFor="expMonth">Expiration Month (MM)</label>
              <input
                id="expMonth"
                type="text"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                placeholder="MM"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                disabled={paymentLoading}
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium text-gray-700" htmlFor="expYear">Expiration Year (YYYY)</label>
              <input
                id="expYear"
                type="text"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                placeholder="YYYY"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                disabled={paymentLoading}
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="cvv">CVV</label>
            <input
              id="cvv"
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              disabled={paymentLoading}
              maxLength={4}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="billingAddress">Billing Address</label>
            <textarea
              id="billingAddress"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              placeholder="123 Main St, City, Country"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              disabled={paymentLoading}
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={paymentLoading}
            className={`w-full py-3 rounded-lg text-white font-medium shadow-md transition duration-300 ${
              paymentLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {paymentLoading ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </form>
      )}

      {paymentMethod === 'cod' && (
        order.order_status !== 'confirmed' ? (
          <div className="p-6 bg-amber-50 rounded-lg space-y-3 border border-amber-200 mb-6">
            <p className="font-medium text-gray-700">Please prepare the payment upon delivery.</p>

            {confirmError && <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{confirmError}</p>}
            {confirmSuccess && <p className="text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">{confirmSuccess}</p>}

            <button
              onClick={() => handleConfirmOrder('cod')}
              disabled={confirmLoading}
              className={`mt-4 w-full px-4 py-3 rounded-lg text-white font-medium shadow-md transition duration-300 ${
                confirmLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {confirmLoading ? 'Confirming...' : 'Confirm Order'}
      </button>
    </div>
  ) : (
    <div className="p-4 bg-green-100 rounded text-green-700 font-semibold">
      Order already confirmed.
    </div>
  )
)}

    </div>
  );
};

export default CheckoutPage;
