import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartcontext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  product.salePrice = product.price * 1.2;

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/30 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02] relative"
      onClick={handleCardClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-200/0 via-blue-200/0 to-indigo-200/0 group-hover:from-indigo-200/20 group-hover:via-blue-200/10 group-hover:to-indigo-200/20 transition-all duration-500"></div>
      
      <div className="relative overflow-hidden aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50/50">
        {product.isSale && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full z-10 animate-pulse shadow-lg">
            Sale
          </span>
        )}
        
        {/* Animated background rings */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-indigo-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 border border-blue-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <img
          src={product.image}
          alt={product.title}
          className="w-5/6 h-5/6 object-contain group-hover:scale-110 transition-transform duration-700 ease-out relative z-10"
        />
        
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 via-indigo-500 to-blue-500 text-white py-4 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => addToCart(product._id)}
            className="w-full bg-white text-indigo-600 font-medium py-2.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg group/button relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/50 to-transparent transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-500"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover/button:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="relative z-50">Add to Cart</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="text-xs text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text font-medium mb-1 group-hover:from-indigo-700 group-hover:to-blue-700 transition-all duration-300">
          {product.brand}
        </div>
        <h3 className="font-medium text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300 mb-2 line-clamp-2 h-12">
          {product.title}
        </h3>
        <div className="flex items-center">
          {product.salePrice ? (
            <>
              <span className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.salePrice.toFixed(2)}
              </span>
              <span className="ml-auto text-xs font-medium text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text animate-pulse">
                Save {Math.round((1 - product.price / product.salePrice) * 100)}%
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
    </div>
  );
};

export default ProductCard;