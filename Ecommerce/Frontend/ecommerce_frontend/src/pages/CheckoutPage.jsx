import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const API_URL = import.meta.env.VITE_API_URL;

const CheckoutPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // Order state
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});

  // Confirmation state
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const [confirmSuccess, setConfirmSuccess] = useState(null);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  // Payment state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Input validation function
  const validateInputs = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!address.trim()) {
      errors.address = 'Address is required';
    } else if (address.trim().length < 10) {
      errors.address = 'Please enter a complete address (minimum 10 characters)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update customer info
  const updateCustomerInfo = async () => {
    const res = await fetch(`${API_URL}/orders/${orderId}/customer-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim(), address: address.trim() }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update customer info');
    }
  };

  // Handle order confirmation
  const handleConfirmOrder = async (paymentMethodType) => {
    // Validate inputs
    if (!validateInputs()) {
      setConfirmError('Please fix the errors below.');
      return;
    }

    setConfirmLoading(true);
    setConfirmError(null);
    setConfirmSuccess(null);

    try {
      // Update customer info first
      await updateCustomerInfo();

      // Update order status
      const statusRes = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      });
      const statusData = await statusRes.json();
      if (!statusRes.ok) throw new Error(statusData.error || 'Failed to update order status');

      // Update payment method
      const methodRes = await fetch(`${API_URL}/orders/${orderId}/method`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method: paymentMethodType,
          phone: phone.trim(),
          name: name.trim(),
          address: address.trim(),
        }),
      });
      const methodData = await methodRes.json();
      if (!methodRes.ok) throw new Error(methodData.error || 'Failed to update order details');

      // Update local state
      setOrder(prev => ({
        ...prev,
        order_status: 'confirmed',
        payment_type: paymentMethodType,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      }));

      setConfirmSuccess('Order confirmed! Order will be delivered in 2-3 weeks.');
      setIsOrderConfirmed(true);
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      setLoadingOrder(true);
      try {
        const res = await fetch(`${API_URL}/orders/${orderId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to fetch order');
        }
        const data = await res.json();
        setOrder(data);

        // Pre-fill form if data exists
        setPhone(data.phone || '');
        setName(data.name || '');
        setAddress(data.address || '');

        // Check if order is already confirmed
        if (data.order_status === 'confirmed') {
          setIsOrderConfirmed(true);
          setConfirmSuccess('Order confirmed! Order will be delivered in 2-3 weeks.');
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Update payment status function
  const updatePaymentStatus = async (status, sessionId = null) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payment_status: status,
          session_id: sessionId 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update payment status');
      }

      // Update local order state
      setOrder(prev => ({
        ...prev,
        payment_status: status
      }));

      return data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  };

  // Handle payment success callback
  useEffect(() => {
    const confirmOrderAfterPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      // Only run if we have a session_id and order is loaded and not already confirmed
      if (sessionId && order && !isOrderConfirmed && !confirmLoading) {
        console.log('Processing payment success for session:', sessionId);
        
        try {
          setPaymentLoading(true);
          
          // 1. First verify the payment with Stripe
          const res = await fetch(`${API_URL}/payments/session-status/${sessionId}`);
          const data = await res.json();
          
          console.log('Session status:', data);
          
          if (data.status === "complete") {
            // 2. Update payment status to "paid"
            await updatePaymentStatus("paid", sessionId);
            
            // 3. Confirm the order
            await handleConfirmOrder("online");
            
            // Clear the session_id from URL to prevent re-processing
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          } else {
            // Payment failed - update status accordingly
            await updatePaymentStatus("failed", sessionId);
            setPaymentError('Payment was not completed successfully. Please try again.');
          }
        } catch (err) {
          console.error('Payment processing error:', err);
          setPaymentError('Failed to verify payment status: ' + err.message);
          
          // Try to update payment status to failed
          try {
            await updatePaymentStatus("failed", sessionId);
          } catch (statusErr) {
            console.error('Failed to update payment status to failed:', statusErr);
          }
        } finally {
          setPaymentLoading(false);
        }
      }
    };

    confirmOrderAfterPayment();
  }, [order, isOrderConfirmed, confirmLoading]); // Dependencies ensure this runs when order loads

  // Handle online payment
  const handleOnlinePayment = async (e) => {
    e.preventDefault();

    // Validate inputs first
    if (!validateInputs()) {
      setPaymentError('Please fill in all required fields correctly.');
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentError(null);

      // Update customer info before payment
      await updateCustomerInfo();

      // Set payment status to pending before redirecting to Stripe
      await updatePaymentStatus("pending");

      // Create checkout session
      const res = await fetch(`${API_URL}/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          orderItems: order.items,
          total: order.total
        })
      });

      const data = await res.json();
      console.log('Checkout session created:', data);

      if (!data.id) {
        throw new Error("Session creation failed.");
      }

      // Redirect to Stripe checkout
      const stripe = await loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);
      const result = await stripe.redirectToCheckout({ sessionId: data.id });

      if (result.error) {
        // Update payment status to failed if there's an error
        await updatePaymentStatus("failed");
        setPaymentError(result.error.message);
      }
    } catch (err) {
      console.error('Payment error:', err);
      
      // Update payment status to failed on error
      try {
        await updatePaymentStatus("failed");
      } catch (statusErr) {
        console.error('Failed to update payment status:', statusErr);
      }
      
      setPaymentError(err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle input changes with validation
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'address':
        setAddress(value);
        break;
    }
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Loading state
  if (loadingOrder) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-6 shadow-md max-w-md w-full">
          <p className="font-medium">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No order found
  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg p-6 shadow-md max-w-md w-full text-center">
          <p className="font-medium">No order found.</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Success/Confirmation view
  if (isOrderConfirmed && confirmSuccess) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10 border border-indigo-100">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">Thank you for your order. We'll deliver it in 2-3 weeks.</p>
        </div>

        <div className="mb-6 border p-6 rounded-lg bg-gray-50 shadow-inner">
          <h3 className="font-semibold mb-4 text-lg text-indigo-700">Order Details</h3>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium text-gray-900">Order #:</span> {order.order_number}</p>
            <p><span className="font-medium text-gray-900">Name:</span> {name}</p>
            <p><span className="font-medium text-gray-900">Phone:</span> {phone}</p>
            <p><span className="font-medium text-gray-900">Address:</span> {address}</p>
            <p><span className="font-medium text-gray-900">Email:</span> {order.customer_email}</p>
            <p><span className="font-medium text-gray-900">Status:</span> 
              <span className="ml-1 text-green-600 font-medium">Confirmed</span>
            </p>
            <p><span className="font-medium text-gray-900">Payment Status:</span> 
              <span className={`ml-1 font-medium ${
                order.payment_status === 'paid' ? 'text-green-600' : 
                order.payment_status === 'pending' ? 'text-yellow-600' : 
                order.payment_status === 'failed' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'N/A'}
              </span>
            </p>
            <p><span className="font-medium text-gray-900">Payment Method:</span> {order.payment_type || paymentMethod}</p>
            <p><span className="font-medium text-gray-900">Total:</span> 
              <span className="ml-1 text-indigo-700 font-bold">${order.total.toFixed(2)}</span>
            </p>
          </div>

          <h4 className="mt-6 mb-3 font-semibold text-indigo-700">Items:</h4>
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
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition duration-300 font-medium w-full"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-10 border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 pb-3 border-b">
        Checkout - Order {order.order_number}
      </h1>

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
            <label className="block mb-2 font-medium text-gray-700" htmlFor="name">
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                validationErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
              placeholder="Your full name"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="phone">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
              placeholder="Your contact number"
            />
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700" htmlFor="address">
              Address *
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                validationErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              rows={3}
              required
              placeholder="Your complete shipping address"
            />
            {validationErrors.address && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
            )}
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

      {/* Online Payment Form */}
      {paymentMethod === 'online' && (
        <form onSubmit={handleOnlinePayment} className="space-y-4 max-w-md border-t pt-6">
          <h3 className="font-semibold mb-4 text-lg text-indigo-700">Online Payment</h3>
          <p className="text-gray-600 text-sm mb-4">
            You will be redirected to Stripe's secure payment page to complete your payment.
          </p>
            
          {paymentError && (
            <div className="text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
              {paymentError}
            </div>
          )}
          {paymentSuccess && (
            <div className="text-green-600 font-semibold bg-green-50 p-3 rounded-lg border border-green-200">
              {paymentSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={paymentLoading}
            className={`w-full py-3 rounded-lg text-white font-medium shadow-md transition duration-300 ${
              paymentLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {paymentLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : (
              'Pay With Card'
            )}
          </button>
        </form>
      )}

      {/* Cash on Delivery */}
      {paymentMethod === 'cod' && (
        <div className="p-6 bg-amber-50 rounded-lg space-y-3 border border-amber-200 mb-6">
          <h3 className="font-semibold text-lg text-amber-800">Cash on Delivery</h3>
          <p className="font-medium text-gray-700">Please prepare the exact payment amount upon delivery.</p>
          <p className="text-sm text-gray-600">
            Our delivery person will collect ${order.total.toFixed(2)} when your order arrives.
          </p>

          {confirmError && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              {confirmError}
            </div>
          )}

          <button
            onClick={() => handleConfirmOrder('cod')}
            disabled={confirmLoading}
            className={`mt-4 w-full px-4 py-3 rounded-lg text-white font-medium shadow-md transition duration-300 ${
              confirmLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {confirmLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirming...
              </span>
            ) : (
              'Confirm Order'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;