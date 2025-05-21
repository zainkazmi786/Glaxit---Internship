// src/App.js
import React from 'react';
import { CartProvider } from './context/cartcontext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // adjust path as needed
import HomePage from './pages/Homepage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage'; // adjust path as needed
import { ToastContainer } from 'react-toastify';
import AdminAuth from './components/AdminAuth';
import AdminDashboard from './pages/AdminDashBoard';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer'; // adjust path as needed
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminAuth />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/checkout/:orderId" element={<CheckoutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<div className="p-4">404 Not Found</div>} />
        </Routes>
        <Footer/>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </CartProvider>
  );
};

export default App;