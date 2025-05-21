import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import ProductCard from '../components/ProductCard';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categoryname, setcategoryname] = useState('all');

const location = useLocation();

  // Helper to get query params
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

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
    const query = useQuery();
    const category_id = query.get('category_id');
      if (category_id) {
        const categoryname = await getCategoryName(category_id);
        setcategoryname(categoryname);
      }
    };
  
    fetchCategory();
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const query = useQuery();
        const category_id = query.get('category_id');

        // Build API URL with category query param if exists
        let apiUrl = 'http://localhost:5000/api/products';
        if (category_id) {
          apiUrl += `?category_id=${category_id}`;  // Note: backend expects 'category_id' param
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search])



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md max-w-md">
          <h2 className="font-bold text-xl mb-2">Oops! Something went wrong.</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()} // Or a more specific error recovery function
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16"> {/* Softer background, consistent padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Responsive padding */}
        <header className="text-center mb-10 md:mb-12"> {/* Increased bottom margin for better separation */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {categoryname === "all" ? "Shop All Products" : `Shop ${categoryname}`}
          </h1>
          {/* Optional: Add a subtitle or breadcrumbs here for better navigation */}
          {/* <p className="text-lg text-gray-600 mt-2">Discover our latest collection.</p> */}
        </header>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-y-10 lg:gap-x-8"> {/* Adjusted gap for better spacing, removed px-16 from here as container handles padding */}
            {products.map(product => (
              <div key={product.id} className="group flex flex-col"> {/* Added flex flex-col to ensure consistent height if ProductCard internals vary */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-gray-700">No Products Found</h2>
            <p className="mt-1 text-gray-500">
              {categoryname === "all"
                ? "It seems we're out of stock. Please check back later!"
                : `Sorry, there are no products available in the "${categoryname}" category right now.`}
            </p>
            {/* Optional: Add a button to go back or to all products */}
          <button
              onClick={() => { /* Navigate to all products or homepage */ }}
              className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
            >
              Shop All Products
            </button> 
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;