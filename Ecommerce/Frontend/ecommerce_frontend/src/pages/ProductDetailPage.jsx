import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/cartcontext';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';


const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [category, setcategory] = useState();

const getCategoryName = async (category) => {
  try {
    const response = await fetch(`http://localhost:5000/api/categories/${category}`);
    if (!response.ok) throw new Error('Category not found');
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error('Error fetching category:', error.message);
    return null;
  }
};
useEffect(() => {
  const fetchCategory = async () => {
    if (product && product.category_id) {
      const categoryName = await getCategoryName(product.category_id.$oid);
      setcategory(categoryName);
    }
  };

  fetchCategory();
}, [product]);

useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Fetch only the specific product by ID
      const response = await fetch(`http://localhost:5000/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      data.salePrice = data.price * 1.2
      setProduct(data);
      
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details. Please try again later.');
      setLoading(false);
    }
  };

  fetchProduct();
}, [productId]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (productId) {
      addToCart(productId, quantity);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  // Generate random ratings for demo purposes
  const rating = 4.5;
  const reviewCount = 12;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-500">
            <li className="hover:text-blue-600">
              <Link to="/">Home</Link>
            </li>
            <li className="mx-2">/</li>
            <li className="hover:text-blue-600">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="mx-2">/</li>
            <li className="hover:text-blue-600">
              <Link to={`/shop?category=${product.category_id.$oid}`}>{category}</Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-900">{product.title}</li>
          </ol>
        </nav>
        
        <div className="flex flex-col md:flex-row -mx-4">
          {/* Product Image */}
          <div className="md:w-1/2 px-4 mb-8 md:mb-0">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-contain object-center"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(rating) ? (
                      <StarIcon className="h-5 w-5" />
                    ) : i < Math.ceil(rating) && rating % 1 !== 0 ? (
                      <StarIcon className="h-5 w-5" />
                    ) : (
                      <StarOutlineIcon className="h-5 w-5" />
                    )}
                  </span>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">{reviewCount} reviews</span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <span className="ml-2 text-lg text-gray-500 line-through">${product.salePrice.toFixed(2)}</span>
                  <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 text-xs font-medium rounded">
                    {Math.round((1- product.price / product.salePrice) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700">
                This premium {product.title.toLowerCase()} is designed for comfort and style. Made with high-quality materials that are built to last. Perfect for everyday use and special occasions.
              </p>
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Quantity</h2>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 bg-gray-100 rounded-l-md flex items-center justify-center hover:bg-gray-200 transition"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center border-t border-b">
                  {quantity}
                </span>
                <button
                  className="w-10 h-10 bg-gray-100 rounded-r-md flex items-center justify-center hover:bg-gray-200 transition"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="mb-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
              >
                Add to Cart
              </button>
            </div>
            
            {/* Additional Info */}
            <div className="border-t pt-6">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Category: </span>
                <Link to={`/shop?category_id=${product.category_id.$oid}`} className="text-sm text-blue-600 hover:underline">
                  {category}
                </Link>
              </div>
              <div className="mb-4">
                <span className="text-sm text-gray-500">Tags: </span>
                <span className="text-sm text-gray-700">fashion, trending, seasonal</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Share: </span>
                <div className="inline-flex space-x-2 mt-1">
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                    <span className="text-gray-600">f</span>
                  </button>
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                    <span className="text-gray-600">t</span>
                  </button>
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                    <span className="text-gray-600">in</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;