import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartcontext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  product.salePrice = product.price * 1.2; // Example sale price calculation
  return (
    <div className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative overflow-hidden aspect-square">
        {product.isSale && (
          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-sm z-10">
            Sale
          </span>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-indigo-500 text-white py-3 px-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={()=>addToCart(product._id.$oid)} 
            className="w-full bg-white text-indigo-600 font-medium py-2 rounded hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-indigo-600 font-medium mb-1">{product.brand}</div>
        <Link to={`/product/${product._id.$oid}`} className="block">
          <h3 className="font-medium text-gray-800 hover:text-indigo-600 transition mb-2 line-clamp-2 h-12">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center">
          {product.salePrice ? (
            <>
              <span className="font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.salePrice.toFixed(2)}
              </span>
              <span className="ml-auto text-xs font-medium text-green-600">
                Save {Math.round((1 - product.price / product.salePrice) * 100)}%
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;