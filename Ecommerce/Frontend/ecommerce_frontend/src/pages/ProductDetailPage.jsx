import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/cartcontext';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { HeartIcon, ShareIcon, TruckIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { addToCart } = useCart();
  const [category, setcategory] = useState();

  const getCategoryName = async (category) => {
    try {
      const response = await fetch(`${API_URL}/categories/${category}`);
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
        const categoryName = await getCategoryName(product.category_id);
        setcategory(categoryName);
      }
    };
    fetchCategory();
  }, [product]);

  useEffect(() => {
    scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        data.salePrice = data.price * 1.2;
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
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rating = 4.5;
  const reviewCount = 12;

  // Mock additional images for gallery
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          {/* Enhanced Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center text-sm text-gray-500 space-x-2">
              <li className="hover:text-indigo-600 transition-colors">
                <Link to="/" className="flex items-center">
                  <span>Home</span>
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="hover:text-indigo-600 transition-colors">
                <Link to="/shop">Shop</Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="hover:text-indigo-600 transition-colors">
                <Link to={`/shop?category=${product.category_id}`}>{category}</Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{product.title}</li>
            </ol>
          </nav>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Product Image Gallery */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-96 lg:h-[500px] object-contain object-center group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={toggleWishlist}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200 ${
                    isWishlisted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <HeartIcon className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              {/* Image Thumbnails */}
              <div className="flex space-x-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-indigo-500 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Enhanced Product Details */}
            <div className="space-y-6">
              {/* Product Title & Category */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Link 
                    to={`/shop?category_id=${product.category_id}`} 
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
                  >
                    {category}
                  </Link>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
              </div>
              
              {/* Enhanced Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
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
                  <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
                </div>
                <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Write a review
                </button>
              </div>
              
              {/* Enhanced Price */}
              <div className="bg-gray-50 rounded-xl p-6">
                {product.salePrice ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className="text-xl text-gray-500 line-through">${product.salePrice.toFixed(2)}</span>
                    </div>
                    <div className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 text-sm font-semibold rounded-full">
                      <span className="mr-1">🔥</span>
                      {Math.round((1- product.price / product.salePrice) * 100)}% OFF - Limited Time!
                    </div>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              {/* Enhanced Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-3 text-gray-900">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  This premium {product.title.toLowerCase()} is designed for comfort and style. Made with high-quality materials that are built to last. Perfect for everyday use and special occasions. Experience the perfect blend of functionality and elegance.
                </p>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm">
                  <TruckIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">Orders over $50</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm">
                  <ShieldCheckIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">2 Year Warranty</p>
                  <p className="text-xs text-gray-500">Full coverage</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm">
                  <ClockIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">24/7 Support</p>
                  <p className="text-xs text-gray-500">Always here</p>
                </div>
              </div>
              
              {/* Enhanced Quantity & Add to Cart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden">
                      <button
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 font-semibold"
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-16 h-12 flex items-center justify-center bg-white border-x border-gray-200 font-semibold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 font-semibold"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {quantity > 1 ? `${quantity} items` : '1 item'} selected
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </button>
                  <button className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
                    <HeartIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Enhanced Additional Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Category</span>
                  <Link 
                    to={`/shop?category_id=${product.category_id}`} 
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {category}
                  </Link>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Tags</span>
                  <div className="flex space-x-2">
                    {['fashion', 'trending', 'seasonal'].map((tag) => (
                      <span 
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-gray-600">Share</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ShareIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Share</span>
                    </button>
                    
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">f</span>
                          </div>
                          <span>Facebook</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">t</span>
                          </div>
                          <span>Twitter</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">in</span>
                          </div>
                          <span>LinkedIn</span>
                        </button>
                      </div>
                    )}
                  </div>
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